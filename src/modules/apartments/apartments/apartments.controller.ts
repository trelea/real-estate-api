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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateApartmentDto } from './dtos/create-apartment.dto';
import { ApartmentsService } from './apartments.service';
import { ThumbnailValidationPipe } from 'src/shared/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateApartmentDto } from './dtos/update-apartment.dto';
import { Public } from 'src/shared/decorators';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { Request } from 'express';

@Controller('apartments')
@UseGuards(JwtAccessStrategyGuard)
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get('admin')
  async findAll(
    @Req() req: Request,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.apartmentsService.findAll(page, limit, req);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.apartmentsService.findOne(id, req);
  }

  @Post()
  async create(@Body() apartment: CreateApartmentDto) {
    return await this.apartmentsService.create(apartment);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() apartment: UpdateApartmentDto,
    @Req() req: Request,
  ) {
    return await this.apartmentsService.update(id, apartment, req);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.apartmentsService.delete(id, req);
  }

  @Patch(':id/upload-media')
  @UseInterceptors(FileInterceptor('media'))
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @UploadedFile(ThumbnailValidationPipe) media?: Express.Multer.File,
  ) {
    return await this.apartmentsService.uploadMedia(id, media, req);
  }

  @Patch(':id/remove-media/:media_id')
  async removeMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('media_id') media_id: string,
    @Req() req: Request,
  ) {
    return await this.apartmentsService.removeMedia(id, media_id, req);
  }
}
