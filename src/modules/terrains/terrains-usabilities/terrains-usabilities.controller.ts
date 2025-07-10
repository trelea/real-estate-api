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
import { TerrainsUsabilitiesService } from './terrains-usabilities.service';
import { Public } from 'src/shared/decorators';

@Controller('terrains/usabilities')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class TerrainsUsabilitiesController {
  constructor(
    private readonly terrainsUsabilitiesService: TerrainsUsabilitiesService,
  ) {}

  /**
   * Get all terrain usabilities
   */
  @Get()
  @Public()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.terrainsUsabilitiesService.findAll(page, limit, search);
  }

  /**
   * Get terrain usability by ID
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.terrainsUsabilitiesService.findById(id);
  }

  /**
   * Create new terrain usability
   */
  @Post()
  async create(@Body() usability: CreateMultilingualDto) {
    return await this.terrainsUsabilitiesService.create(usability);
  }

  /**
   * Update terrain usability
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() usability: UpdateMultilingualDto,
  ) {
    return await this.terrainsUsabilitiesService.update(id, usability);
  }

  /**
   * Delete terrain usability
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.terrainsUsabilitiesService.delete(id);
  }
}
