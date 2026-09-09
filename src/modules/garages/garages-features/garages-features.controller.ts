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
import { GaragesFeaturesService } from './garages-features.service';
import { Public } from 'src/shared/decorators';

@Controller('garages/features')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class GaragesFeaturesController {
  constructor(
    private readonly garagesFeaturesService: GaragesFeaturesService,
  ) {}

  /**
   * Get all garage features
   */
  @Get()
  @Public()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.garagesFeaturesService.findAll(page, limit, search);
  }

  /**
   * Get garage feature by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.garagesFeaturesService.findById(id);
  }

  /**
   * Create new garage feature
   */
  @Post()
  async create(@Body() feature: CreateMultilingualDto) {
    return await this.garagesFeaturesService.create(feature);
  }

  /**
   * Update garage feature
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() feature: UpdateMultilingualDto,
  ) {
    return await this.garagesFeaturesService.update(id, feature);
  }

  /**
   * Delete garage feature
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.garagesFeaturesService.delete(id);
  }
}
