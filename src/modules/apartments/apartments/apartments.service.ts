import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateApartmentDto } from './dtos/create-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Apartment,
  ApartmentFeature,
  HousingCondition,
  HousingStock,
  Location,
  LocationCategory,
  LocationSubcategory,
  Media,
  User,
} from 'src/database/entities';
import { DeepPartial, EntityManager, Repository, In } from 'typeorm';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { UpdateApartmentDto } from './dtos/update-apartment.dto';
import { Request } from 'express';
// import { ImageProcessingService } from 'src/services/image-processing';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentsRepository: Repository<Apartment>,
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
    @InjectRepository(ApartmentFeature)
    private readonly apartmentFeatureRepository: Repository<ApartmentFeature>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async findAll(page?: number, limit?: number) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    const skip = (page - 1) * limit;

    const [data, total] = await this.apartmentsRepository.findAndCount({
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
      const apartment = await this.apartmentsRepository.findOne({
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

      if (!apartment) {
        throw new NotFoundException('Apartment not found');
      }

      // Skip views increment for now to prevent hanging
      // TODO: Implement this with a queue or background job

      return apartment;
    } catch (err) {
      console.error('Error in findOne:', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async create(apartment: CreateApartmentDto) {
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
        } = apartment;

        // map numeric IDs to relation objects for many-to-many
        const featureEntities = featureIds?.map((id) => ({ id })) as
          | DeepPartial<ApartmentFeature[]>
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

        const _apartment = this.apartmentsRepository.create({
          ...rest,
          price_square: rest.price / rest.surface,
          location: await manager.save(location),
          user: rest.user as DeepPartial<User>,
          housing_stock: rest.housing_stock as DeepPartial<HousingStock>,
          housing_conditions: conditionEntities,
          features: featureEntities,
        });

        return await manager.save(_apartment);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: number, updateData: UpdateApartmentDto) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Get apartment without views increment
      const apartment = await queryRunner.manager.findOne(Apartment, {
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

      if (!apartment) {
        throw new NotFoundException('Apartment not found');
      }

      // Handle location updates
      if (
        updateData.location_category ||
        updateData.location_subcategory ||
        updateData.lat ||
        updateData.lng ||
        updateData.street_en ||
        updateData.street_ro ||
        updateData.street_ru
      ) {
        const location = apartment.location;
        if (updateData.location_category) {
          const category = await queryRunner.manager.findOneBy(
            LocationCategory,
            {
              id: updateData.location_category,
            },
          );
          if (category) location.location_category = category;
        }
        if (updateData.location_subcategory) {
          const subcategory = await queryRunner.manager.findOneBy(
            LocationSubcategory,
            {
              id: updateData.location_subcategory,
            },
          );
          if (subcategory) location.location_subcategory = subcategory;
        }
        if (updateData.lat) location.lat = updateData.lat;
        if (updateData.lng) location.lng = updateData.lng;
        if (updateData.street_en) location.street_en = updateData.street_en;
        if (updateData.street_ro) location.street_ro = updateData.street_ro;
        if (updateData.street_ru) location.street_ru = updateData.street_ru;

        await queryRunner.manager.save(location);
      }

      // Remove location-related fields from updateData
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
        ...apartmentData
      } = updateData;

      // Update apartment relations if provided
      if (apartmentData.housing_stock) {
        const housingStock = await queryRunner.manager.findOneBy(HousingStock, {
          id: apartmentData.housing_stock,
        });
        if (housingStock) apartment.housing_stock = housingStock;
      }
      if (conditionIds) {
        const conditions = await queryRunner.manager.findBy(HousingCondition, {
          id: In(conditionIds),
        });
        if (conditions.length) apartment.housing_conditions = conditions;
      }
      if (featureIds) {
        const features = await queryRunner.manager.findBy(ApartmentFeature, {
          id: In(featureIds),
        });
        if (features.length) apartment.features = features;
      }
      if (apartmentData.user) {
        const user = await queryRunner.manager.findOneBy(User, {
          id: apartmentData.user,
        });
        if (user) apartment.user = user;
      }

      // Remove relation arrays from apartmentData so they don't overwrite
      delete (apartmentData as any).features;
      delete (apartmentData as any).housing_conditions;

      // Update price_square if price or surface is updated
      if (apartmentData.price || apartmentData.surface) {
        const price = apartmentData.price || apartment.price;
        const surface = apartmentData.surface || apartment.surface;
        apartment.price_square = price / surface;
      }

      // Update remaining fields
      Object.assign(apartment, apartmentData);

      // Save the updated apartment
      const updated = await queryRunner.manager.save(apartment);

      // Commit the transaction
      await queryRunner.commitTransaction();

      console.log('Apartment updated successfully');
      return updated;
    } catch (err) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      console.error('Error in apartment update:', err);
      throw new InternalServerErrorException(err.message);
    } finally {
      // Always release the query runner
      await queryRunner.release();
    }
  }

  async uploadMedia(id: number, media?: Express.Multer.File) {
    try {
      let url: string | undefined = undefined;
      if (media) {
        // Use watermarked upload for apartment images
        url = (
          await this.awsS3Service.uploadFile(media, {
            propertyType: 'apartment',
            propertyId: id,
          })
        ).url;
      }
      const _media = this.mediasRepository.create({
        apartment: id as DeepPartial<Apartment>,
        url,
      });
      return await this.mediasRepository.save(_media);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number) {
    try {
      const apartment = await this.apartmentsRepository.findOne({
        where: { id },
      });

      if (!apartment) {
        throw new NotFoundException('Apartment not found');
      }

      await this.apartmentsRepository.remove(apartment);
      return { message: 'Apartment deleted successfully' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async removeMedia(id: number, media_id: string) {
    try {
      const media = await this.mediasRepository.findOne({
        where: { id: media_id, apartment: { id } },
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
      await this.apartmentsRepository
        .createQueryBuilder()
        .update(Apartment)
        .set({ views: () => 'views + 1' })
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.error('Failed to increment views:', err);
      // Don't throw error - views increment failure shouldn't break the app
    }
  }
}
