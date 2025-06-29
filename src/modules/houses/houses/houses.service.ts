import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  House,
  HouseFeature,
  HousingCondition,
  HousingStock,
  Location,
  LocationCategory,
  LocationSubcategory,
  Media,
  User,
} from 'src/database/entities';
import { DeepPartial, EntityManager, In, Repository } from 'typeorm';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { CreateHouseDto } from './dtos/create-house.dto';
import { UpdateHouseDto } from './dtos/update-house.dto';
import { Request } from 'express';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly housesRepository: Repository<House>,
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(Media)
    private readonly mediasRepository: Repository<Media>,
    @InjectRepository(LocationCategory)
    private readonly locationCategoryRepository: Repository<LocationCategory>,
    @InjectRepository(LocationSubcategory)
    private readonly locationSubcategoryRepository: Repository<LocationSubcategory>,
    @InjectRepository(HousingStock)
    private readonly housingStockRepository: Repository<HousingStock>,
    @InjectRepository(HousingCondition)
    private readonly housingConditionRepository: Repository<HousingCondition>,
    @InjectRepository(HouseFeature)
    private readonly houseFeatureRepository: Repository<HouseFeature>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async findAll(page?: number, limit?: number) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    const skip = (page - 1) * limit;

    const [data, total] = await this.housesRepository.findAndCount({
      relations: {
        location: true,
        user: {
          profile: true,
        },
        media: true,
      },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, req?: Request) {
    try {
      const house = await this.housesRepository.findOne({
        where: { id },
        relations: {
          location: {
            location_category: true,
            location_subcategory: true,
          },
          user: {
            profile: true,
          },
          media: true,
          housing_stock: true,
          housing_conditions: true,
          features: true,
        },
      });

      if (!house) {
        throw new NotFoundException('House not found');
      }
      if (!req?.user) {
        house.views++;
        await this.housesRepository.save(house);
      }

      return house;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async create(house: CreateHouseDto) {
    try {
      return await this.entityManager.transaction(async (manager) => {
        const {
          location_category,
          location_subcategory,
          lat,
          lng,
          street_en,
          street_ro,
          street_ru,
          features: featureIds,
          housing_conditions: conditionIds,
          ...rest
        } = house;

        const featureEntities = featureIds?.map((id) => ({ id })) as
          | DeepPartial<HouseFeature[]>
          | undefined;
        const conditionEntities = conditionIds?.map((id) => ({ id })) as
          | DeepPartial<HousingCondition[]>
          | undefined;

        const location = this.locationsRepository.create({
          lat,
          lng,
          street_en,
          street_ro,
          street_ru,
          location_category: location_category as DeepPartial<LocationCategory>,
          location_subcategory:
            location_subcategory as DeepPartial<LocationSubcategory>,
        });

        const _house = this.housesRepository.create({
          ...rest,
          price_square: rest.price / rest.area,
          location: await manager.save(location),
          user: rest.user as DeepPartial<User>,
          housing_stock: rest.housing_stock as DeepPartial<HousingStock>,
          housing_conditions: conditionEntities,
          features: featureEntities,
        });

        return await manager.save(_house);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: number, updateData: UpdateHouseDto) {
    try {
      const house = await this.findOne(id);

      return await this.entityManager.transaction(async (manager) => {
        // Update location if provided
        if (
          updateData.location_category ||
          updateData.location_subcategory ||
          updateData.lat ||
          updateData.lng ||
          updateData.street_en ||
          updateData.street_ro ||
          updateData.street_ru
        ) {
          const location = house.location;
          if (updateData.location_category) {
            const category = await this.locationCategoryRepository.findOneBy({
              id: updateData.location_category,
            });
            if (category) location.location_category = category;
          }
          if (updateData.location_subcategory) {
            const subcategory =
              await this.locationSubcategoryRepository.findOneBy({
                id: updateData.location_subcategory,
              });
            if (subcategory) location.location_subcategory = subcategory;
          }
          if (updateData.lat) location.lat = updateData.lat;
          if (updateData.lng) location.lng = updateData.lng;
          if (updateData.street_en) location.street_en = updateData.street_en;
          if (updateData.street_ro) location.street_ro = updateData.street_ro;
          if (updateData.street_ru) location.street_ru = updateData.street_ru;

          await manager.save(location);
        }

        const {
          location_category,
          location_subcategory,
          lat,
          lng,
          street_en,
          street_ro,
          street_ru,
          features: featureIds,
          housing_conditions: conditionIds,
          ...houseData
        } = updateData;

        // update relations
        if (houseData.housing_stock) {
          const housingStock = await this.housingStockRepository.findOneBy({
            id: houseData.housing_stock,
          });
          if (housingStock) house.housing_stock = housingStock;
        }

        if (conditionIds) {
          const conditions = await this.housingConditionRepository.findBy({
            id: In(conditionIds),
          });
          if (conditions.length) house.housing_conditions = conditions;
        }

        if (featureIds) {
          const features = await this.houseFeatureRepository.findBy({
            id: In(featureIds),
          });
          if (features.length) house.features = features;
        }

        if (houseData.user) {
          const user = await this.userRepository.findOneBy({
            id: houseData.user,
          });
          if (user) house.user = user;
        }

        delete (houseData as any).features;
        delete (houseData as any).housing_conditions;

        // recompute price_square if needed
        if (houseData.price || houseData.area) {
          const price = houseData.price || house.price;
          const area = houseData.area || house.area;
          house.price_square = price / area;
        }

        Object.assign(house, houseData);

        const updated = await manager.save(house);
        return this.findOne(updated.id);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadMedia(id: number, media?: Express.Multer.File) {
    try {
      let url: string | undefined = undefined;
      if (media) url = (await this.awsS3Service.uploadFile(media)).url;

      const _media = this.mediasRepository.create({
        house: id as DeepPartial<House>,
        url,
      });

      return await this.mediasRepository.save(_media);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number) {
    try {
      const house = await this.housesRepository.findOne({ where: { id } });

      if (!house) {
        throw new NotFoundException('House not found');
      }

      await this.housesRepository.remove(house);
      return { message: 'House deleted successfully' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async removeMedia(id: number, media_id: string) {
    try {
      const media = await this.mediasRepository.findOne({
        where: { id: media_id, house: { id } },
      });

      if (!media) {
        throw new NotFoundException('Media not found');
      }

      await this.mediasRepository.remove(media);
      return { message: 'Media removed successfully' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
