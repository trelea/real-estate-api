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
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public, SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { ParseIntPipeOptional } from 'src/shared/pipes';
import {
  CreateMultilingualDto,
  UpdateMultilingualDto,
} from 'src/services/multilingual/dtos';

@Controller('locations/categories')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly locationCategoriesService: CategoriesService) {}

  /**
   * all
   */
  @Get('all')
  @Public()
  async findAllCategories() {
    return await this.locationCategoriesService._findAll();
  }

  /**
   * get location category
   */
  @Get()
  @Public()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.locationCategoriesService.findAll(page, limit, search);
  }

  /**
   * get location category by id
   */
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.locationCategoriesService.findByIdWithSubcategories(
      id,
      page,
      limit,
      search,
    );
  }

  /**
   * create location category
   */
  @Post()
  async create(@Body() locationCategory: CreateMultilingualDto) {
    return await this.locationCategoriesService.create(locationCategory);
  }

  /**
   * update location category
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() locationCategory: UpdateMultilingualDto,
  ) {
    return await this.locationCategoriesService.update(id, locationCategory);
  }

  /**
   * delete category
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.locationCategoriesService.delete(id);
  }
}
