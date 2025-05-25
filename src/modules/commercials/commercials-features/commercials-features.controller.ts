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
import { CommercialsFeaturesService } from './commercials-features.service';

@Controller('commercials/features')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class CommercialsFeaturesController {
  constructor(
    private readonly commercialsFeaturesService: CommercialsFeaturesService,
  ) {}

  /**
   * Get all commercial features
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.commercialsFeaturesService.findAll(page, limit, search);
  }

  /**
   * Get commercial feature by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.commercialsFeaturesService.findById(id);
  }

  /**
   * Create new commercial feature
   */
  @Post()
  async create(@Body() feature: CreateMultilingualDto) {
    return await this.commercialsFeaturesService.create(feature);
  }

  /**
   * Update commercial feature
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() feature: UpdateMultilingualDto,
  ) {
    return await this.commercialsFeaturesService.update(id, feature);
  }

  /**
   * Delete commercial feature
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commercialsFeaturesService.delete(id);
  }
}
