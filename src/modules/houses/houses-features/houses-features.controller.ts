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
import { HousesFeaturesService } from './houses-features.service';

@Controller('houses/features')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class HousesFeaturesController {
  constructor(private readonly housesFeaturesService: HousesFeaturesService) {}

  /**
   * Get all house features
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.housesFeaturesService.findAll(page, limit, search);
  }

  /**
   * Get house feature by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.housesFeaturesService.findById(id);
  }

  /**
   * Create new house feature
   */
  @Post()
  async create(@Body() feature: CreateMultilingualDto) {
    return await this.housesFeaturesService.create(feature);
  }

  /**
   * Update house feature
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() feature: UpdateMultilingualDto,
  ) {
    return await this.housesFeaturesService.update(id, feature);
  }

  /**
   * Delete house feature
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.housesFeaturesService.delete(id);
  }
}
