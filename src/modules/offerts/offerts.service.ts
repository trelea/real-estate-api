import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment, ApartmentStatus } from 'src/database/entities/apartment';
import { Commercial, CommercialStatus } from 'src/database/entities/commercial';
import { House, HouseStatus } from 'src/database/entities/house';
import { Terrain, TerrainStatus } from 'src/database/entities/terrain';
import { Repository } from 'typeorm';

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

  async getApartmentsOfferts(limit: number, page: number, sort: string) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    const order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort.includes('price')) {
      order.price = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    if (sort.includes('area')) {
      order.area = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    return await this.apartmentRepository.find({
      where: {
        status: ApartmentStatus.PUBLIC,
      },
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: {
        location: true,
      },
    });
  }

  async getHousesOfferts(limit: number, page: number, sort: string) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    const order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort.includes('price')) {
      order.price = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    if (sort.includes('area')) {
      order.area = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    return await this.houseRepository.find({
      where: {
        status: HouseStatus.PUBLIC,
      },
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: {
        location: true,
        media: true,
      },
    });
  }

  async getCommercialsOfferts(limit: number, page: number, sort: string) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    const order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort.includes('price')) {
      order.price = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    if (sort.includes('area')) {
      order.area = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    return await this.commercialRepository.find({
      where: {
        status: CommercialStatus.PUBLIC,
      },
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: {
        location: true,
        media: true,
      },
    });
  }

  async getTerrainsOfferts(limit: number, page: number, sort: string) {
    if (!limit) limit = 10;
    if (!page) page = 1;

    const order: Record<string, 'ASC' | 'DESC'> = {
      created_at: 'DESC',
    };

    if (sort.includes('price')) {
      order.price = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    if (sort.includes('area')) {
      order.area = sort.split('_')[1] === 'asc' ? 'ASC' : 'DESC';
    }

    return await this.terrainRepository.find({
      where: {
        status: TerrainStatus.PUBLIC,
      },
      skip: (page - 1) * limit,
      take: limit,
      order,
      relations: {
        location: true,
        media: true,
      },
    });
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
