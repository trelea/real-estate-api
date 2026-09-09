import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  House,
  HouseStatus,
  HouseFeature,
  HousingCondition,
  HousingStock,
  Location,
  LocationCategory,
  LocationSubcategory,
  Media,
  User,
  UserRole,
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

  /**
   * An agent may only act on the offerts assigned to them; admins act on all.
   * Throws 404 when the offert does not exist so callers cannot probe ids.
   */
  private async assertCanMutate(id: number, req?: Request) {
    const house = await this.housesRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!house) throw new NotFoundException('House not found');
    const isAdmin = req?.user?.role === UserRole.ADMIN;
    const isOwner = !!req?.user?.id && house.user?.id === req.user.id;
    if (!isAdmin && !isOwner)
      throw new ForbiddenException('You can only manage your own offerts');
    return house;
  }

  async findAll(page?: number, limit?: number, req?: Request) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    const skip = (page - 1) * limit;
    /**
     * An agent only ever lists the offerts assigned to them; admins list all.
     * Fail closed: without an identified caller we scope to nothing rather
     * than falling back to an unfiltered query.
     */
    const isAdmin = req?.user?.role === UserRole.ADMIN;
    if (!isAdmin && !req?.user?.id)
      throw new ForbiddenException('You can only list your own offerts');
    const scoped = isAdmin ? {} : { user: { id: req!.user!.id } };

    const [data, total] = await this.housesRepository.findAndCount({
      where: scoped,
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

  async findOne(id: number, req?: Request, includePrivate = false) {
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

      /**
       * PRIVATE offerts are visible only to an admin or the assigned agent.
       * Anyone else gets the same 404 as a non-existent id.
       */
      const isAdmin = req?.user?.role === UserRole.ADMIN;
      const isOwner = !!req?.user?.id && house.user?.id === req.user.id;
      if (
        !includePrivate &&
        house.status !== HouseStatus.PUBLIC &&
        !isAdmin &&
        !isOwner
      )
        throw new NotFoundException('House not found');

      // Skip views increment for now to prevent performance issues during updates
      // TODO: Implement this with a separate incrementViews method

      return house;
    } catch (err) {
      // a missing / non-public offert is a 404, not a server error
      if (err instanceof NotFoundException) throw err;
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

  async update(id: number, updateData: UpdateHouseDto, req?: Request) {
    await this.assertCanMutate(id, req);
    try {
      const house = await this.findOne(id, undefined, true);

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

        // Remove relations from houseData to prevent overwriting with IDs
        delete (houseData as any).features;
        delete (houseData as any).housing_conditions;
        delete (houseData as any).housing_stock;
        delete (houseData as any).user;

        // recompute price_square if needed
        if (houseData.price || houseData.area) {
          const price = houseData.price || house.price;
          const area = houseData.area || house.area;
          house.price_square = price / area;
        }

        Object.assign(house, houseData);

        const updated = await manager.save(house);
        return updated;
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadMedia(id: number, media?: Express.Multer.File, req?: Request) {
    await this.assertCanMutate(id, req);
    try {
      let url: string | undefined = undefined;
      if (media) {
        // Use watermarked upload for house images
        url = (
          await this.awsS3Service.uploadFile(media, {
            propertyType: 'house',
            propertyId: id,
          })
        ).url;
      }

      const _media = this.mediasRepository.create({
        house: id as DeepPartial<House>,
        url,
      });

      return await this.mediasRepository.save(_media);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number, req?: Request) {
    await this.assertCanMutate(id, req);
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

  async removeMedia(id: number, media_id: string, req?: Request) {
    await this.assertCanMutate(id, req);
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

  async incrementViews(id: number): Promise<void> {
    try {
      // Use a simple query with timeout
      await this.housesRepository
        .createQueryBuilder()
        .update(House)
        .set({ views: () => 'views + 1' })
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.error('Failed to increment views:', err);
      // Don't throw error - views increment failure shouldn't break the app
    }
  }
}
