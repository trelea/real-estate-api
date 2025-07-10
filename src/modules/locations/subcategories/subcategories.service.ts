import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationSubcategory } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';
import { DeepPartial, Repository } from 'typeorm';
import {
  CreateLocationSubCategoryDto,
  UpdateLocationSubCategoryDto,
} from './dtos';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class SubcategoriesService extends MultilingualService<LocationSubcategory> {
  constructor(
    @InjectRepository(LocationSubcategory)
    private readonly locationSubcategoriesRepository: Repository<LocationSubcategory>,
    private readonly locationCategoriesService: CategoriesService,
  ) {
    super(locationSubcategoriesRepository);
  }

  /**
   * create subcategory location
   */
  async create(
    subcategory: CreateLocationSubCategoryDto,
  ): Promise<DeepPartial<LocationSubcategory> & LocationSubcategory> {
    const category = await this.locationCategoriesService.findById(
      subcategory.category,
    );
    if (!category) throw new NotFoundException();

    try {
      return await this.locationSubcategoriesRepository.save(
        subcategory as DeepPartial<LocationSubcategory>,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * update subcategory location
   */
  async update(
    id: number,
    subcategory: UpdateLocationSubCategoryDto,
  ): Promise<LocationSubcategory> {
    try {
      const entity = await this.locationSubcategoriesRepository.preload({
        id,
        ...subcategory,
      } as DeepPartial<LocationSubcategory>);
      if (!entity) throw new NotFoundException();
      return await this.locationSubcategoriesRepository.save(entity);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
