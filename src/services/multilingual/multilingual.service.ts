import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MultilingualEntity } from 'src/database/entities';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import { CreateMultilingualDto, UpdateMultilingualDto } from './dtos';

@Injectable()
export class MultilingualService<TRepository extends MultilingualEntity> {
  constructor(protected readonly repository: Repository<TRepository>) {}

  async findAll(page?: number, limit?: number, search?: string) {
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    let where:
      | FindOptionsWhere<TRepository>
      | FindOptionsWhere<TRepository>[]
      | undefined = undefined;

    if (search)
      where = [
        { ro: Like(`%${search}%`) },
        { ru: Like(`%${search}%`) },
        { en: Like(`%${search}%`) },
      ] as FindOptionsWhere<TRepository>[];

    const skip = (page - 1) * limit;
    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      where,
      order: { created_at: 'DESC' } as FindOptionsOrder<TRepository>,
    });

    return {
      data,
      meta: { page, limit, total, last_page: Math.ceil(total / limit) },
    };
  }

  async findById(id: number) {
    try {
      const condition = await this.repository.findOne({
        where: { id } as FindOptionsWhere<TRepository>,
      });
      if (!condition) throw new NotFoundException();
      return condition;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async create(multilingual: CreateMultilingualDto) {
    try {
      return await this.repository.save(
        multilingual as DeepPartial<TRepository>,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(id: number, multilingual: UpdateMultilingualDto) {
    try {
      const entity = await this.repository.preload({
        id,
        ...multilingual,
      } as DeepPartial<TRepository>);
      if (!entity) throw new NotFoundException();
      return await this.repository.save(entity);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: number) {
    try {
      return await this.repository.remove(
        await this.repository.findBy({ id } as FindOptionsWhere<TRepository>),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
