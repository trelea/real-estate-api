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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { UserRole } from 'src/database/entities';
import { Public, SetRoles } from 'src/shared/decorators';
import { RolesGuard } from 'src/shared/guards';
import { ServicesService } from './services.service';
import {
  ParseIntPipeOptional,
  ThumbnailValidationPipe,
} from 'src/shared/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateServiceDto,
  PatchServiceLandingDto,
  UpdateServiceDto,
} from './dtos';
import { ServicesStatusInterceptor } from 'src/shared/interceptors';

@Controller('services')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  /**
   * find all
   */
  @Public()
  @Get()
  @UseInterceptors(ServicesStatusInterceptor)
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.servicesService.findAll(page, limit, search);
  }

  @Public()
  @Get('landing')
  async findAllOnLanding() {
    return await this.servicesService.findAllOnLanding();
  }

  @Patch('landing/:position')
  async patchServiceLanding(
    @Param('position', ParseIntPipe) position: number,
    @Body() service: PatchServiceLandingDto,
  ) {
    return await this.servicesService.patchServiceLanding(position, service);
  }

  @Delete('landing/:id')
  async removeFromLanding(@Param('id', ParseIntPipe) id: number) {
    return await this.servicesService.removeFromLanding(id);
  }

  /**
   * create
   */
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() service: CreateServiceDto,
    @UploadedFile(ThumbnailValidationPipe) thumbnail?: Express.Multer.File,
  ) {
    return await this.servicesService.create(service, thumbnail);
  }

  /**
   * find by id
   */
  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.servicesService.findById(id);
  }

  /**
   * update
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() service: UpdateServiceDto,
    @UploadedFile(ThumbnailValidationPipe) thumbnail?: Express.Multer.File,
  ) {
    return await this.servicesService.update(id, service, thumbnail);
  }

  /**
   * delete
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.servicesService.delete(id);
  }

  /**
   * remove thumb
   */
  @Delete(':id/rm-thumb')
  async removeThumb(@Param('id') id: string) {
    return await this.servicesService.removeThumb(id);
  }
}
