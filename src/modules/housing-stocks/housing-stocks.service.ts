import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HousingStock } from 'src/database/entities';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateHousingStockDto, UpdateHousingStockDto } from './dtos';

@Injectable()
export class HousingStocksService {
  constructor(
    @InjectRepository(HousingStock)
    private readonly housingStocksRepository: Repository<HousingStock>,
  ) {}

  /**
   * get housing stocks
   */
  async findAll(page?: number, limit?: number, search?: string) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    let where:
      | FindOptionsWhere<HousingStock>
      | FindOptionsWhere<HousingStock>[]
      | undefined = undefined;

    if (search)
      where = [
        { ro: Like(`%${search}%`) },
        { ru: Like(`%${search}%`) },
        { en: Like(`%${search}%`) },
      ];

    const skip = (page - 1) * limit;
    const [data, total] = await this.housingStocksRepository.findAndCount({
      skip,
      where,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  /**
   * get stock by id
   */
  async findById(id: number) {
    try {
      const condition = await this.housingStocksRepository.findOne({
        where: { id },
      });
      if (!condition) throw new NotFoundException();
      return condition;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  /**
   * create stock
   */
  async create(condition: CreateHousingStockDto) {
    try {
      return await this.housingStocksRepository.save(condition);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * update condition
   */
  async update(id: number, condition: UpdateHousingStockDto) {
    try {
      return await this.housingStocksRepository.update({ id }, condition);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * delete contion
   */
  async delete(id: number) {
    try {
      return await this.housingStocksRepository.remove(
        await this.housingStocksRepository.findBy({ id }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
