import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment, ApartmentStatus } from 'src/database/entities/apartment';
import { Commercial, CommercialStatus } from 'src/database/entities/commercial';
import { House, HouseStatus } from 'src/database/entities/house';
import { Terrain, TerrainStatus } from 'src/database/entities/terrain';
import {
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class OffertsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentRepository: Repository<Apartment>,
    @InjectRepository(House)
    private houseRepository: Repository<House>,
    @InjectRepository(Commercial)
    private commercialRepository: Repository<Commercial>,
    @InjectRepository(Terrain)
    private terrainRepository: Repository<Terrain>,
  ) {}

  async getHotOfferts(limit: number) {
    if (!limit) limit = 10;

    /**
     * must select from all repositories the offerts with status public and hot = true and the shiffel them rabdom and return an array of mix of the offerts
     */

    const apartments = await this.apartmentRepository.find({
      where: {
        status: ApartmentStatus.PUBLIC,
        hot: true,
      },
      relations: {
        location: true,
        media: true,
      },
    });

    const houses = await this.houseRepository.find({
      where: {
        status: HouseStatus.PUBLIC,
        hot: true,
      },
      relations: {
        location: true,
        media: true,
      },
    });

    const commercials = await this.commercialRepository.find({
      where: {
        status: CommercialStatus.PUBLIC,
        hot: true,
      },
      relations: {
        location: true,
        media: true,
      },
    });

    const terrains = await this.terrainRepository.find({
      where: {
        status: TerrainStatus.PUBLIC,
        hot: true,
      },
      relations: {
        location: true,
        media: true,
      },
    });

    const offerts = [
      ...apartments.map((_) => ({ ..._, type: 'apartments' })),
      ...houses.map((_) => ({ ..._, type: 'houses' })),
      ...commercials.map((_) => ({ ..._, type: 'commercials' })),
      ...terrains.map((_) => ({ ..._, type: 'terrains' })),
    ];

    return offerts.sort(() => Math.random() - 0.5).slice(0, limit);
  }

  async getApartmentsOfferts(
    limit: number,
    page: number,
    sort: string,
    filter: any,
  ) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    let order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort?.includes('price'))
      order = { price: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    if (sort?.includes('area'))
      order = { surface: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    const where: FindOptionsWhere<Apartment> = {
      status: ApartmentStatus.PUBLIC,
    };

    if (filter.offert && filter.offert.length > 0)
      where.offert = In(filter.offert as string[]);

    if (filter.location_category && filter.location_category.length > 0)
      where.location = {
        location_category: {
          id: In(filter.location_category),
        },
      };

    if (filter.location_subcategory && filter.location_subcategory.length > 0)
      where.location = {
        location_subcategory: {
          id: In(filter.location_subcategory),
        },
      };

    if (filter.rooms && filter.rooms.length > 0) where.rooms = In(filter.rooms);
    if (filter.rooms && filter.rooms.length > 0 && filter.rooms.includes(4))
      where.rooms = MoreThanOrEqual(4);

    if (filter.sanitaries && filter.sanitaries.length > 0)
      where.sanitaries = In(filter.sanitaries);
    if (
      filter.sanitaries &&
      filter.sanitaries.length > 0 &&
      filter.sanitaries.includes(3)
    )
      where.sanitaries = MoreThanOrEqual(3);

    if (filter.price_from && filter.price_from > 0)
      where.price = MoreThanOrEqual(filter.price_from);

    if (filter.price_to && filter.price_to > 0)
      where.price = LessThanOrEqual(filter.price_to);

    if (filter.price_square_from && filter.price_square_from > 0)
      where.price_square = MoreThanOrEqual(filter.price_square_from);

    if (filter.price_square_to && filter.price_square_to > 0)
      where.price_square = LessThanOrEqual(filter.price_square_to);

    if (filter.surface_from && filter.surface_from > 0)
      where.surface = MoreThanOrEqual(filter.surface_from);

    if (filter.surface_to && filter.surface_to > 0)
      where.surface = LessThanOrEqual(filter.surface_to);

    if (filter.floor_from && filter.floor_from > 0)
      where.floor = MoreThanOrEqual(filter.floor_from);

    if (filter.floor_to && filter.floor_to > 0)
      where.floor = LessThanOrEqual(filter.floor_to);

    if (filter.housing_stocks && filter.housing_stocks.length > 0)
      where.housing_stock = {
        id: In(filter.housing_stocks),
      };

    if (filter.housing_conditions && filter.housing_conditions.length > 0)
      where.housing_conditions = {
        id: In(filter.housing_conditions),
      };

    if (filter.features && filter.features.length > 0)
      where.features = {
        id: In(filter.features),
      };

    const [data, total] = await this.apartmentRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: {
        location: true,
        media: true,
      },
    });

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  async getHousesOfferts(
    limit: number,
    page: number,
    sort: string,
    filter: any,
  ) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    let order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort?.includes('price'))
      order = { price: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    if (sort?.includes('area'))
      order = { area: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    const where: FindOptionsWhere<House> = {
      status: HouseStatus.PUBLIC,
    };

    if (filter.offert && filter.offert.length > 0)
      where.offert = In(filter.offert as string[]);

    if (filter.location_category && filter.location_category.length > 0)
      where.location = {
        location_category: {
          id: In(filter.location_category),
        },
      };

    if (filter.location_subcategory && filter.location_subcategory.length > 0)
      where.location = {
        location_subcategory: {
          id: In(filter.location_subcategory),
        },
      };

    if (filter.floors && filter.floors.length > 0)
      where.floors = In(filter.floors);
    if (filter.floors && filter.floors.length > 0 && filter.floors.includes(3))
      where.floors = MoreThanOrEqual(3);

    if (filter.price_from && filter.price_from > 0)
      where.price = MoreThanOrEqual(filter.price_from);

    if (filter.price_to && filter.price_to > 0)
      where.price = LessThanOrEqual(filter.price_to);

    if (filter.price_square_from && filter.price_square_from > 0)
      where.price_square = MoreThanOrEqual(filter.price_square_from);

    if (filter.price_square_to && filter.price_square_to > 0)
      where.price_square = LessThanOrEqual(filter.price_square_to);

    if (filter.surface_from && filter.surface_from > 0)
      where.area = MoreThanOrEqual(filter.surface_from);

    if (filter.surface_to && filter.surface_to > 0)
      where.area = LessThanOrEqual(filter.surface_to);

    if (filter.floor_from && filter.floor_from > 0)
      where.floors = MoreThanOrEqual(filter.floor_from);

    if (filter.floor_to && filter.floor_to > 0)
      where.floors = LessThanOrEqual(filter.floor_to);

    if (filter.housing_stocks && filter.housing_stocks.length > 0)
      where.housing_stock = {
        id: In(filter.housing_stocks),
      };

    if (filter.housing_conditions && filter.housing_conditions.length > 0)
      where.housing_conditions = {
        id: In(filter.housing_conditions),
      };

    if (filter.features && filter.features.length > 0)
      where.features = {
        id: In(filter.features),
      };

    const [data, total] = await this.houseRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: {
        location: true,
        media: true,
      },
    });

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  async getCommercialsOfferts(
    limit: number,
    page: number,
    sort: string,
    filter: any,
  ) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    let order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort?.includes('price'))
      order = { price: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    if (sort?.includes('area'))
      order = { area: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    const where: FindOptionsWhere<Commercial> = {
      status: CommercialStatus.PUBLIC,
    };

    if (filter.offert && filter.offert.length > 0)
      where.offert = In(filter.offert as string[]);

    if (filter.location_category && filter.location_category.length > 0)
      where.location = {
        location_category: {
          id: In(filter.location_category),
        },
      };

    if (filter.location_subcategory && filter.location_subcategory.length > 0)
      where.location = {
        location_subcategory: {
          id: In(filter.location_subcategory),
        },
      };

    if (filter.floors && filter.floors.length > 0)
      where.floors = In(filter.floors);
    if (filter.floors && filter.floors.length > 0 && filter.floors.includes(3))
      where.floors = MoreThanOrEqual(3);

    if (filter.price_from && filter.price_from > 0)
      where.price = MoreThanOrEqual(filter.price_from);

    if (filter.price_to && filter.price_to > 0)
      where.price = LessThanOrEqual(filter.price_to);

    if (filter.price_square_from && filter.price_square_from > 0)
      where.price_square = MoreThanOrEqual(filter.price_square_from);

    if (filter.price_square_to && filter.price_square_to > 0)
      where.price_square = LessThanOrEqual(filter.price_square_to);

    if (filter.surface_from && filter.surface_from > 0)
      where.area = MoreThanOrEqual(filter.surface_from);

    if (filter.surface_to && filter.surface_to > 0)
      where.area = LessThanOrEqual(filter.surface_to);

    if (filter.floor_from && filter.floor_from > 0)
      where.floors = MoreThanOrEqual(filter.floor_from);

    if (filter.floor_to && filter.floor_to > 0)
      where.floors = LessThanOrEqual(filter.floor_to);

    if (filter.housing_conditions && filter.housing_conditions.length > 0)
      where.housing_conditions = {
        id: In(filter.housing_conditions),
      };

    if (filter.features && filter.features.length > 0)
      where.features = {
        id: In(filter.features),
      };

    if (filter.destinations && filter.destinations.length > 0)
      where.commercial_destinations = {
        id: In(filter.destinations),
      };

    if (filter.placeings && filter.placeings.length > 0)
      where.commercial_placings = {
        id: In(filter.placeings),
      };

    if (filter.first_line && filter.first_line === 'true')
      where.first_line = true;

    if (filter.first_line && filter.first_line === 'false')
      where.first_line = false;

    const [data, total] = await this.commercialRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: {
        location: true,
        media: true,
      },
    });

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  async getTerrainsOfferts(
    limit: number,
    page: number,
    sort: string,
    filter: any,
  ) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    let order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort?.includes('price'))
      order = { price: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    if (sort?.includes('area'))
      order = { area: sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC' };

    const where: FindOptionsWhere<Terrain> = {
      status: TerrainStatus.PUBLIC,
    };

    if (filter.offert && filter.offert.length > 0)
      where.offert = In(filter.offert as string[]);

    if (filter.location_category && filter.location_category.length > 0)
      where.location = {
        location_category: {
          id: In(filter.location_category),
        },
      };

    if (filter.location_subcategory && filter.location_subcategory.length > 0)
      where.location = {
        location_subcategory: {
          id: In(filter.location_subcategory),
        },
      };

    if (filter.price_from && filter.price_from > 0)
      where.price = MoreThanOrEqual(filter.price_from);

    if (filter.price_to && filter.price_to > 0)
      where.price = LessThanOrEqual(filter.price_to);

    if (filter.surface_from && filter.surface_from > 0)
      where.area = MoreThanOrEqual(filter.surface_from);

    if (filter.surface_to && filter.surface_to > 0)
      where.area = LessThanOrEqual(filter.surface_to);

    if (filter.usabilities && filter.usabilities.length > 0)
      where.usability = {
        id: In(filter.usabilities),
      };

    if (filter.features && filter.features.length > 0)
      where.features = {
        id: In(filter.features),
      };

    const [data, total] = await this.terrainRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { media: { created_at: 'ASC' }, ...order },
      relations: {
        location: true,
        media: true,
      },
    });

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  async getApartmentsHotOfferts(limit: number) {
    if (!limit) limit = 10;

    /**
     * shuffe the offerts and return the first limit
     */
    return (
      await this.apartmentRepository.find({
        where: {
          status: ApartmentStatus.PUBLIC,
          hot: true,
        },
        relations: {
          location: true,
          media: true,
        },
      })
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  async getHousesHotOfferts(limit: number) {
    if (!limit) limit = 10;

    return (
      await this.houseRepository.find({
        where: {
          status: HouseStatus.PUBLIC,
          hot: true,
        },
        relations: {
          location: true,
          media: true,
        },
      })
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  async getCommercialsHotOfferts(limit: number) {
    if (!limit) limit = 10;

    return (
      await this.commercialRepository.find({
        where: {
          status: CommercialStatus.PUBLIC,
          hot: true,
        },
        relations: {
          location: true,
          media: true,
        },
      })
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  async getTerrainsHotOfferts(limit: number) {
    if (!limit) limit = 10;

    return (
      await this.terrainRepository.find({
        where: {
          status: TerrainStatus.PUBLIC,
          hot: true,
        },
        relations: {
          location: true,
          media: true,
        },
      })
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }
}
