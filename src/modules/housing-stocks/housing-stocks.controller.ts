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
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { UserRole } from 'src/database/entities';
import { SetRoles } from 'src/shared/decorators';
import { RolesGuard } from 'src/shared/guards';
import { HousingStocksService } from './housing-stocks.service';
import { ParseIntPipeOptional } from 'src/shared/pipes';
import {
  CreateMultilingualDto,
  UpdateMultilingualDto,
} from 'src/services/multilingual/dtos';

@Controller('housing-stocks')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class HousingStocksController {
  constructor(private readonly housingStocksService: HousingStocksService) {}

  /**
   * get housing stocks
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.housingStocksService.findAll(page, limit, search);
  }

  /**
   * get stock by id
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.housingStocksService.findById(id);
  }

  /**
   * create stock
   */
  @Post()
  async create(@Body() condition: CreateMultilingualDto) {
    return await this.housingStocksService.create(condition);
  }

  /**
   * update stock
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() condition: UpdateMultilingualDto,
  ) {
    return await this.housingStocksService.update(id, condition);
  }

  /**
   * delete stocks
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.housingStocksService.delete(id);
  }
}
