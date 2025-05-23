import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HousingCondition } from 'src/database/entities';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateHousingConditionDto, UpdateHousingConditionDto } from './dtos';

@Injectable()
export class HousingConditionsService {
  constructor(
    @InjectRepository(HousingCondition)
    private readonly housingConditionsRepository: Repository<HousingCondition>,
  ) {}

  /**
   * get housing conditions
   */
  async findAll(page?: number, limit?: number, search?: string) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    let where:
      | FindOptionsWhere<HousingCondition>
      | FindOptionsWhere<HousingCondition>[]
      | undefined = undefined;

    if (search)
      where = [
        { ro: Like(`%${search}%`) },
        { ru: Like(`%${search}%`) },
        { en: Like(`%${search}%`) },
      ];

    const skip = (page - 1) * limit;
    const [data, total] = await this.housingConditionsRepository.findAndCount({
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
   * get condition by id
   */
  async findById(id: number) {
    try {
      const condition = await this.housingConditionsRepository.findOne({
        where: { id },
      });
      if (!condition) throw new NotFoundException();
      return condition;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  /**
   * create condition
   */
  async create(condition: CreateHousingConditionDto) {
    try {
      return await this.housingConditionsRepository.save(condition);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * update condition
   */
  async update(id: number, condition: UpdateHousingConditionDto) {
    try {
      return await this.housingConditionsRepository.update({ id }, condition);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * delete contion
   */
  async delete(id: number) {
    try {
      return await this.housingConditionsRepository.remove(
        await this.housingConditionsRepository.findBy({ id }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
