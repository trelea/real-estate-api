import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Location,
  LocationCategory,
  LocationSubcategory,
} from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class CategoriesService extends MultilingualService<LocationCategory> {
  constructor(
    @InjectRepository(LocationCategory)
    protected readonly locationCategoryRepository: Repository<LocationCategory>,

    @InjectRepository(LocationSubcategory)
    protected readonly locationSubcategoryRepository: Repository<LocationSubcategory>,

    @InjectRepository(Location)
    protected readonly locationRepository: Repository<Location>,
  ) {
    super(locationCategoryRepository);
  }

  /**
   * Deleting a category used to silently orphan its data: both
   * location_subcategory.categoryId and location.locationCategoryId are
   * ON DELETE SET NULL, so the subcategories disappeared from the admin
   * (it lists them per category) and the offerts rendered without a city.
   * Refuse the delete while anything still points at the category.
   */
  async delete(id: number) {
    await this.findById(id);

    const [subcategories, locations] = await Promise.all([
      this.locationSubcategoryRepository.countBy({ category: { id } }),
      this.locationRepository.countBy({ location_category: { id } }),
    ]);

    if (subcategories || locations)
      throw new ConflictException(
        `Category is still in use by ${subcategories} subcategory(ies) and ${locations} offert location(s). Move or delete them first.`,
      );

    return await super.delete(id);
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
