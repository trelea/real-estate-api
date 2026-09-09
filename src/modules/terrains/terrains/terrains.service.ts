import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Terrain, TerrainStatus } from 'src/database/entities/terrain';
import { Location, Media, UserRole } from 'src/database/entities';
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

  /**
   * An agent may only act on the offerts assigned to them; admins act on all.
   * Throws 404 when the offert does not exist so callers cannot probe ids.
   */
  private async assertCanMutate(id: number, req?: Request) {
    const terrain = await this.terrainsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!terrain) throw new NotFoundException('Terrain not found');
    const isAdmin = req?.user?.role === UserRole.ADMIN;
    const isOwner = !!req?.user?.id && terrain.user?.id === req.user.id;
    if (!isAdmin && !isOwner)
      throw new ForbiddenException('You can only manage your own offerts');
    return terrain;
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
    const [data, total] = await this.terrainsRepository.findAndCount({
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

    /**
     * PRIVATE offerts are visible only to an admin or the assigned agent.
     * Anyone else gets the same 404 as a non-existent id.
     */
    const isAdmin = req?.user?.role === UserRole.ADMIN;
    const isOwner = !!req?.user?.id && terrain.user?.id === req.user.id;
    if (
      !includePrivate &&
      terrain.status !== TerrainStatus.PUBLIC &&
      !isAdmin &&
      !isOwner
    )
      throw new NotFoundException('Terrain not found');

    // Skip views increment for now to prevent performance issues during updates
    // TODO: Implement this with a separate incrementViews method

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

  async update(id: number, dto: UpdateTerrainDto, req?: Request) {
    await this.assertCanMutate(id, req);
    try {
      const terrain = await this.findOne(id, undefined, true);
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
        return updated;
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number, req?: Request) {
    await this.assertCanMutate(id, req);
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

  async uploadMedia(id: number, media?: Express.Multer.File, req?: Request) {
    await this.assertCanMutate(id, req);
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

  async removeMedia(id: number, media_id: string, req?: Request) {
    await this.assertCanMutate(id, req);
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

  async incrementViews(id: number): Promise<void> {
    try {
      // Use a simple query with timeout
      await this.terrainsRepository
        .createQueryBuilder()
        .update(Terrain)
        .set({ views: () => 'views + 1' })
        .where('id = :id', { id })
        .execute();
    } catch (err) {
      console.error('Failed to increment views:', err);
      // Don't throw error - views increment failure shouldn't break the app
    }
  }
}
