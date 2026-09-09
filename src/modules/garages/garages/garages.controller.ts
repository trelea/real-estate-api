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
import { GaragesService } from './garages.service';
import { CreateGarageDto } from './dtos/create-garage.dto';
import { UpdateGarageDto } from './dtos/update-garage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThumbnailValidationPipe } from 'src/shared/pipes/thumbnail.pipe';
import { Public } from 'src/shared/decorators';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { Request } from 'express';

@Controller('garages')
@UseGuards(JwtAccessStrategyGuard)
export class GaragesController {
  constructor(private readonly garagesService: GaragesService) {}

  @Get('admin')
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.garagesService.findAll(page, limit);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.garagesService.findOne(id, req);
  }

  @Post()
  async create(@Body() garage: CreateGarageDto) {
    return await this.garagesService.create(garage);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() garage: UpdateGarageDto,
  ) {
    return await this.garagesService.update(id, garage);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.garagesService.delete(id);
  }

  @Patch(':id/upload-media')
  @UseInterceptors(FileInterceptor('media'))
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ThumbnailValidationPipe) media?: Express.Multer.File,
  ) {
    return await this.garagesService.uploadMedia(id, media);
  }

  @Patch(':id/remove-media/:media_id')
  async removeMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('media_id') media_id: string,
  ) {
    return await this.garagesService.removeMedia(id, media_id);
  }
}
