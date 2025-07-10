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
import { ApartmentsFeaturesService } from './apartments-features.service';
import { ParseIntPipeOptional } from 'src/shared/pipes';
import {
  CreateMultilingualDto,
  UpdateMultilingualDto,
} from 'src/services/multilingual/dtos';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('apartments/features')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class ApartmentsFeaturesController {
  constructor(
    private readonly apartmentsFeaturesService: ApartmentsFeaturesService,
  ) {}

  /**
   * Get all apartment features
   */
  @Get()
  @Public()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.apartmentsFeaturesService.findAll(page, limit, search);
  }

  /**
   * Get apartment feature by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.apartmentsFeaturesService.findById(id);
  }

  /**
   * Create new apartment feature
   */
  @Post()
  async create(@Body() feature: CreateMultilingualDto) {
    return await this.apartmentsFeaturesService.create(feature);
  }

  /**
   * Update apartment feature
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() feature: UpdateMultilingualDto,
  ) {
    return await this.apartmentsFeaturesService.update(id, feature);
  }

  /**
   * Delete apartment feature
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.apartmentsFeaturesService.delete(id);
  }
}
