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
import { ParseIntPipe } from '@nestjs/common';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';
import { ParseIntPipeOptional } from 'src/shared/pipes';
import {
  CreateMultilingualDto,
  UpdateMultilingualDto,
} from 'src/services/multilingual/dtos';
import { CommercialsPlacingsService } from './commercials-placings.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('commercials/placings')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class CommercialsPlacingsController {
  constructor(
    private readonly commercialsPlacingsService: CommercialsPlacingsService,
  ) {}

  /**
   * Get all commercial placings
   */
  @Get()
  @Public()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.commercialsPlacingsService.findAll(page, limit, search);
  }

  /**
   * Get commercial placing by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.commercialsPlacingsService.findById(id);
  }

  /**
   * Create new commercial placing
   */
  @Post()
  async create(@Body() placing: CreateMultilingualDto) {
    return await this.commercialsPlacingsService.create(placing);
  }

  /**
   * Update commercial placing
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() placing: UpdateMultilingualDto,
  ) {
    return await this.commercialsPlacingsService.update(id, placing);
  }

  /**
   * Delete commercial placing
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commercialsPlacingsService.delete(id);
  }
}
