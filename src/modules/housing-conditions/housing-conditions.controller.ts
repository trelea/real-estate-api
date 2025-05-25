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
import { HousingConditionsService } from './housing-conditions.service';
import { ParseIntPipeOptional } from 'src/shared/pipes';
import { SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import {
  CreateMultilingualDto,
  UpdateMultilingualDto,
} from 'src/services/multilingual/dtos';

@Controller('housing-conditions')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class HousingConditionsController {
  constructor(
    private readonly housingConditionsService: HousingConditionsService,
  ) {}

  /**
   * get housing conditions
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.housingConditionsService.findAll(page, limit, search);
  }

  /**
   * get condition by id
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.housingConditionsService.findById(id);
  }

  /**
   * create condition
   */
  @Post()
  async create(@Body() condition: CreateMultilingualDto) {
    return await this.housingConditionsService.create(condition);
  }

  /**
   * update condition
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() condition: UpdateMultilingualDto,
  ) {
    return await this.housingConditionsService.update(id, condition);
  }

  /**
   * delete contion
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.housingConditionsService.delete(id);
  }
}
