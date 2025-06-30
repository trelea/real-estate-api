import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commercial } from 'src/database/entities/commercial';
import { Location, User, Media } from 'src/database/entities';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { CreateCommercialDto } from './dtos/create-commercial.dto';
import { UpdateCommercialDto } from './dtos/update-commercial.dto';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { Request } from 'express';

@Injectable()
export class CommercialsService {
  constructor(
    @InjectRepository(Commercial)
    private readonly commercialsRepository: Repository<Commercial>,
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(Media)
    private readonly mediasRepository: Repository<Media>,
    private readonly entityManager: EntityManager,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async findAll(page?: number, limit?: number) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;
    const skip = (page - 1) * limit;
    const [data, total] = await this.commercialsRepository.findAndCount({
      relations: { location: true, user: { profile: true }, media: true },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });
    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number, req?: Request) {
    try {
      const commercial = await this.commercialsRepository.findOne({
        where: { id },
        relations: {
          location: { location_category: true, location_subcategory: true },
          user: { profile: true },
          media: true,
          housing_conditions: true,
          commercial_destinations: true,
          commercial_placings: true,
          features: true,
        },
      });
      if (!commercial) throw new NotFoundException('Commercial not found');

      if (!req?.user) {
        await this.commercialsRepository.query(
          'UPDATE commercial SET views = views + 1 WHERE id = $1',
          [id],
        );
      }
      return commercial;
    } catch (err) {
      console.error('Error in findOne:', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async create(dto: CreateCommercialDto) {
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
          housing_conditions,
          commercial_destinations,
          commercial_placings,
          features,
          ...rest
        } = dto;
        const location = this.locationsRepository.create({
          lat,
          lng,
          street_en,
          street_ro,
          street_ru,
          location_category: { id: location_category } as any,
          location_subcategory: { id: location_subcategory } as any,
        });
        const commercial = this.commercialsRepository.create({
          ...rest,
          location: await manager.save(location),
          user: { id: rest.user } as any,
          housing_conditions: housing_conditions?.map((id) => ({ id })) as any,
          commercial_destinations: commercial_destinations?.map((id) => ({
            id,
          })) as any,
          commercial_placings: commercial_placings?.map((id) => ({
            id,
          })) as any,
          features: features?.map((id) => ({ id })) as any,
        });
        return await manager.save(commercial);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: number, dto: UpdateCommercialDto) {
    try {
      const commercial = await this.findOne(id);
      return await this.entityManager.transaction(async (manager) => {
        // Update location if provided
        if (
          dto.location_category ||
          dto.location_subcategory ||
          dto.lat ||
          dto.lng ||
          dto.street_en ||
          dto.street_ro ||
          dto.street_ru
        ) {
          const location = commercial.location;
          if (dto.location_category)
            location.location_category = { id: dto.location_category } as any;
          if (dto.location_subcategory)
            location.location_subcategory = {
              id: dto.location_subcategory,
            } as any;
          if (dto.lat) location.lat = dto.lat;
          if (dto.lng) location.lng = dto.lng;
          if (dto.street_en) location.street_en = dto.street_en;
          if (dto.street_ro) location.street_ro = dto.street_ro;
          if (dto.street_ru) location.street_ru = dto.street_ru;
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
          housing_conditions,
          commercial_destinations,
          commercial_placings,
          features,
          ...rest
        } = dto;
        // Update relations
        if (housing_conditions)
          commercial.housing_conditions = housing_conditions.map((id) => ({
            id,
          })) as any;
        if (commercial_destinations)
          commercial.commercial_destinations = commercial_destinations.map(
            (id) => ({ id }),
          ) as any;
        if (commercial_placings)
          commercial.commercial_placings = commercial_placings.map((id) => ({
            id,
          })) as any;
        if (features)
          commercial.features = features.map((id) => ({ id })) as any;
        if (rest.user) commercial.user = { id: rest.user } as any;
        // Remove relation arrays from rest so they don't overwrite
        delete (rest as any).housing_conditions;
        delete (rest as any).commercial_destinations;
        delete (rest as any).commercial_placings;
        delete (rest as any).features;
        // Assign remaining fields
        Object.assign(commercial, rest);
        // Return updated entity
        const updated = await manager.save(commercial);
        return this.findOne(updated.id);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number) {
    try {
      const commercial = await this.commercialsRepository.findOne({
        where: { id },
      });
      if (!commercial) {
        throw new NotFoundException('Commercial not found');
      }
      await this.commercialsRepository.remove(commercial);
      return { message: 'Commercial deleted successfully' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadMedia(id: number, media?: Express.Multer.File) {
    try {
      let url: string | undefined = undefined;
      if (media) url = (await this.awsS3Service.uploadFile(media)).url;
      const _media = this.mediasRepository.create({
        commercial: id as DeepPartial<Commercial>,
        url,
      });
      return await this.mediasRepository.save(_media);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async removeMedia(id: number, media_id: string) {
    try {
      const media = await this.mediasRepository.findOne({
        where: { id: media_id, commercial: { id } },
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
