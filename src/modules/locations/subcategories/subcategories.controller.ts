import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { Public } from 'src/shared/decorators';
import { ParseIntPipeOptional } from 'src/shared/pipes';
import {
  CreateLocationSubCategoryDto,
  UpdateLocationSubCategoryDto,
} from './dtos';

@Controller('locations/subcategories')
export class SubcategoriesController {
  constructor(
    private readonly locationSubcategoriesService: SubcategoriesService,
  ) {}

  /**
   * get location subcategory
   */
  @Get()
  @Public()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.locationSubcategoriesService.findAll(page, limit, search);
  }

  /**
   * get location subcategory by id
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.locationSubcategoriesService.findById(id);
  }

  /**
   * create location subcategory
   */
  @Post()
  async create(@Body() locationSubCategory: CreateLocationSubCategoryDto) {
    return await this.locationSubcategoriesService.create(locationSubCategory);
  }

  /**
   * update location subcategory
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() locationSubCategory: UpdateLocationSubCategoryDto,
  ) {
    return await this.locationSubcategoriesService.update(
      id,
      locationSubCategory,
    );
  }

  /**
   * delete subcategory
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.locationSubcategoriesService.delete(id);
  }
}
