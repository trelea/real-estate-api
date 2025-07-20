import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Terrain } from 'src/database/entities/terrain';
import { Location, Media } from 'src/database/entities';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { CreateTerrainDto } from './dtos/create-terrain.dto';
import { UpdateTerrainDto } from './dtos/update-terrain.dto';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { Request } from 'express';

@Injectable()
export class TerrainsService {
  constructor(
    @InjectRepository(Terrain)
    private readonly terrainsRepository: Repository<Terrain>,
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
    const [data, total] = await this.terrainsRepository.findAndCount({
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
    const terrain = await this.terrainsRepository.findOne({
      where: { id },
      relations: {
        location: { location_category: true, location_subcategory: true },
        user: { profile: true },
        media: true,
        usability: true,
        features: true,
      },
    });
    if (!terrain) throw new NotFoundException('Terrain not found');

    if (!req?.user) {
      terrain.views++;
      await this.terrainsRepository.save(terrain);
    }

    return terrain;
  }

  async create(dto: CreateTerrainDto) {
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
          usability: usabilityIds,
          features: featureIds,
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
        const terrain = this.terrainsRepository.create({
          ...rest,
          location: await manager.save(location),
          user: { id: rest.user } as any,
          usability: usabilityIds?.map((id) => ({ id })) as any,
          features: featureIds?.map((id) => ({ id })) as any,
        });
        return await manager.save(terrain);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: number, dto: UpdateTerrainDto) {
    try {
      const terrain = await this.findOne(id);
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
          const location = terrain.location;
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
          usability,
          features,
          ...rest
        } = dto;
        // Update relations
        if (usability)
          terrain.usability = usability.map((id) => ({ id })) as any;
        if (features) terrain.features = features.map((id) => ({ id })) as any;
        if (rest.user) terrain.user = { id: rest.user } as any;
        // Remove relation arrays from rest so they don't overwrite
        delete (rest as any).usability;
        delete (rest as any).features;
        // Assign remaining fields
        Object.assign(terrain, rest);
        // Return updated entity
        const updated = await manager.save(terrain);
        return await this.findOne(updated.id);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number) {
    try {
      const terrain = await this.terrainsRepository.findOne({ where: { id } });
      if (!terrain) {
        throw new NotFoundException('Terrain not found');
      }
      await this.terrainsRepository.remove(terrain);
      return { message: 'Terrain deleted successfully' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadMedia(id: number, media?: Express.Multer.File) {
    try {
      let url: string | undefined = undefined;
      if (media) {
        // Use watermarked upload for terrain images
        url = (
          await this.awsS3Service.uploadFile(media, {
            propertyType: 'terrain',
            propertyId: id,
          })
        ).url;
      }
      const _media = this.mediasRepository.create({
        terrain: id as DeepPartial<Terrain>,
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
        where: { id: media_id, terrain: { id } },
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
