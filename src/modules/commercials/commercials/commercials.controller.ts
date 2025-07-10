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
import { CommercialsService } from './commercials.service';
import { CreateCommercialDto } from './dtos/create-commercial.dto';
import { UpdateCommercialDto } from './dtos/update-commercial.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThumbnailValidationPipe } from 'src/shared/pipes/thumbnail.pipe';
import { Public } from 'src/shared/decorators';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { Request } from 'express';

@Controller('commercials')
@UseGuards(JwtAccessStrategyGuard)
export class CommercialsController {
  constructor(private readonly commercialsService: CommercialsService) {}

  @Get('admin')
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.commercialsService.findAll(page, limit);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.commercialsService.findOne(id, req);
  }

  @Post()
  async create(@Body() commercial: CreateCommercialDto) {
    return await this.commercialsService.create(commercial);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() commercial: UpdateCommercialDto,
  ) {
    console.log(commercial);
    return await this.commercialsService.update(id, commercial);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commercialsService.delete(id);
  }

  @Patch(':id/upload-media')
  @UseInterceptors(FileInterceptor('media'))
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ThumbnailValidationPipe) media?: Express.Multer.File,
  ) {
    return await this.commercialsService.uploadMedia(id, media);
  }

  @Patch(':id/remove-media/:media_id')
  async removeMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('media_id') media_id: string,
  ) {
    return await this.commercialsService.removeMedia(id, media_id);
  }
}
