import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Garage, GarageStatus } from 'src/database/entities/garage';
import { Location, Media, UserRole } from 'src/database/entities';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { CreateGarageDto } from './dtos/create-garage.dto';
import { UpdateGarageDto } from './dtos/update-garage.dto';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';
import { Request } from 'express';

@Injectable()
export class GaragesService {
  constructor(
    @InjectRepository(Garage)
    private readonly garagesRepository: Repository<Garage>,
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
    @InjectRepository(Media)
    private readonly mediasRepository: Repository<Media>,
    private readonly entityManager: EntityManager,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  /**
   * An agent may only act on the offerts assigned to them; admins act on all.
   * Throws 404 when the offert does not exist so callers cannot probe ids.
   */
  private async assertCanMutate(id: number, req?: Request) {
    const garage = await this.garagesRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!garage) throw new NotFoundException('Garage not found');
    const isAdmin = req?.user?.role === UserRole.ADMIN;
    const isOwner = !!req?.user?.id && garage.user?.id === req.user.id;
    if (!isAdmin && !isOwner)
      throw new ForbiddenException('You can only manage your own offerts');
    return garage;
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
    const [data, total] = await this.garagesRepository.findAndCount({
      where: scoped,
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

  async findOne(id: number, req?: Request, includePrivate = false) {
    const garage = await this.garagesRepository.findOne({
      where: { id },
      relations: {
        location: { location_category: true, location_subcategory: true },
        user: { profile: true },
        media: true,
        features: true,
      },
    });
    if (!garage) throw new NotFoundException('Garage not found');

    /**
     * PRIVATE offerts are visible only to an admin or the assigned agent.
     * Anyone else gets the same 404 as a non-existent id.
     */
    const isAdmin = req?.user?.role === UserRole.ADMIN;
    const isOwner = !!req?.user?.id && garage.user?.id === req.user.id;
    if (
      !includePrivate &&
      garage.status !== GarageStatus.PUBLIC &&
      !isAdmin &&
      !isOwner
    )
      throw new NotFoundException('Garage not found');

    // Skip views increment for now to prevent performance issues during updates
    // TODO: Implement this with a separate incrementViews method

    return garage;
  }

  async create(dto: CreateGarageDto) {
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
        const garage = this.garagesRepository.create({
          ...rest,
          location: await manager.save(location),
          user: { id: rest.user } as any,
          features: featureIds?.map((id) => ({ id })) as any,
        });
        return await manager.save(garage);
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: number, dto: UpdateGarageDto, req?: Request) {
    await this.assertCanMutate(id, req);
    try {
      const garage = await this.findOne(id, undefined, true);
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
          const location = garage.location;
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
          features,
          ...rest
        } = dto;
        // Update relations
        if (features) garage.features = features.map((id) => ({ id })) as any;
        if (rest.user) garage.user = { id: rest.user } as any;
        // Remove relation arrays from rest so they don't overwrite
        delete (rest as any).features;
        // Assign remaining fields
        Object.assign(garage, rest);
        // Return updated entity
        const updated = await manager.save(garage);
        return updated;
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number, req?: Request) {
    await this.assertCanMutate(id, req);
    try {
      const garage = await this.garagesRepository.findOne({ where: { id } });
      if (!garage) {
        throw new NotFoundException('Garage not found');
      }
      await this.garagesRepository.remove(garage);
      return { message: 'Garage deleted successfully' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async uploadMedia(id: number, media?: Express.Multer.File, req?: Request) {
    await this.assertCanMutate(id, req);
    try {
      let url: string | undefined = undefined;
      if (media) {
        // Use watermarked upload for garage images
        url = (
          await this.awsS3Service.uploadFile(media, {
            propertyType: 'garage',
            propertyId: id,
          })
        ).url;
      }
      const _media = this.mediasRepository.create({
        garage: id as DeepPartial<Garage>,
        url,
      });
      return await this.mediasRepository.save(_media);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async removeMedia(id: number, media_id: string, req?: Request) {
    await this.assertCanMutate(id, req);
    try {
      const media = await this.mediasRepository.findOne({
        where: { id: media_id, garage: { id } },
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
      await this.garagesRepository
        .createQueryBuilder()
        .update(Garage)
        .set({ views: () => 'views + 1' })
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.error('Failed to increment views:', err);
      // Don't throw error - views increment failure shouldn't break the app
    }
  }
}
