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
import { CommercialsDestinationsService } from './commercials-destinations.service';

@Controller('commercials/destinations')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class CommercialsDestinationsController {
  constructor(
    private readonly commercialsDestinationsService: CommercialsDestinationsService,
  ) {}

  /**
   * Get all commercial destinations
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.commercialsDestinationsService.findAll(
      page,
      limit,
      search,
    );
  }

  /**
   * Get commercial destination by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.commercialsDestinationsService.findById(id);
  }

  /**
   * Create new commercial destination
   */
  @Post()
  async create(@Body() destination: CreateMultilingualDto) {
    return await this.commercialsDestinationsService.create(destination);
  }

  /**
   * Update commercial destination
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() destination: UpdateMultilingualDto,
  ) {
    return await this.commercialsDestinationsService.update(id, destination);
  }

  /**
   * Delete commercial destination
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commercialsDestinationsService.delete(id);
  }
}
