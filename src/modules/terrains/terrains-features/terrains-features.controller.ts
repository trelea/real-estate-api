import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';
import { ParseIntPipeOptional } from 'src/shared/pipes';
import {
  CreateMultilingualDto,
  UpdateMultilingualDto,
} from 'src/services/multilingual/dtos';
import { TerrainsFeaturesService } from './terrains-features.service';

@Controller('terrains/features')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class TerrainsFeaturesController {
  constructor(
    private readonly terrainsFeaturesService: TerrainsFeaturesService,
  ) {}

  /**
   * Get all terrain features
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.terrainsFeaturesService.findAll(page, limit, search);
  }

  /**
   * Get terrain feature by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.terrainsFeaturesService.findById(id);
  }

  /**
   * Create new terrain feature
   */
  @Post()
  async create(@Body() feature: CreateMultilingualDto) {
    return await this.terrainsFeaturesService.create(feature);
  }

  /**
   * Update terrain feature
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() feature: UpdateMultilingualDto,
  ) {
    return await this.terrainsFeaturesService.update(id, feature);
  }

  /**
   * Delete terrain feature
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.terrainsFeaturesService.delete(id);
  }
}
