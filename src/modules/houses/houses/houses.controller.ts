import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dtos/create-house.dto';
import { UpdateHouseDto } from './dtos/update-house.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThumbnailValidationPipe } from 'src/shared/pipes';
import { Public } from 'src/shared/decorators';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { Request } from 'express';

@Controller('houses')
@UseGuards(JwtAccessStrategyGuard)
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get('admin')
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.housesService.findAll(page, limit);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.housesService.findOne(id, req);
  }

  @Post()
  async create(@Body() house: CreateHouseDto) {
    return await this.housesService.create(house);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() house: UpdateHouseDto,
  ) {
    return await this.housesService.update(id, house);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.housesService.delete(id);
  }

  @Patch(':id/upload-media')
  @UseInterceptors(FileInterceptor('media'))
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ThumbnailValidationPipe) media?: Express.Multer.File,
  ) {
    return await this.housesService.uploadMedia(id, media);
  }

  @Patch(':id/remove-media/:media_id')
  async removeMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('media_id') media_id: string,
  ) {
    return await this.housesService.removeMedia(id, media_id);
  }
}
