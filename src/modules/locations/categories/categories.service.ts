import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationCategory, LocationSubcategory } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class CategoriesService extends MultilingualService<LocationCategory> {
  constructor(
    @InjectRepository(LocationCategory)
    protected readonly locationCategoryRepository: Repository<LocationCategory>,

    @InjectRepository(LocationSubcategory)
    protected readonly locationSubcategoryRepository: Repository<LocationSubcategory>,
  ) {
    super(locationCategoryRepository);
  }

  async findByIdWithSubcategories(
    id: number,
    page?: number,
    limit?: number,
    search?: string,
  ) {
    const category = await this.findById(id);
    if (!category) throw new NotFoundException();

    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 20;

    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<LocationSubcategory>[] | undefined;

    if (search) {
      where = [
        { category: { id }, ro: Like(`%${search}%`) },
        { category: { id }, ru: Like(`%${search}%`) },
        { category: { id }, en: Like(`%${search}%`) },
      ];
    } else {
      where = [{ category: { id } }];
    }

    const [data, total] = await this.locationSubcategoryRepository.findAndCount(
      {
        skip,
        take: limit,
        where,
        order: { created_at: 'DESC' },
      },
    );

    return {
      data,
      category,
      meta: {
        page,
        limit,
        total,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async _findAll() {
    return await this.locationCategoryRepository.find({
      order: { created_at: 'DESC' },
      relations: {
        subcategories: true,
      },
    });
  }
}
