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
} from '@nestjs/common';
import { TerrainsService } from './terrains.service';
import { CreateTerrainDto } from './dtos/create-terrain.dto';
import { UpdateTerrainDto } from './dtos/update-terrain.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThumbnailValidationPipe } from 'src/shared/pipes/thumbnail.pipe';
import { Public } from 'src/shared/decorators';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';

@Controller('terrains')
@UseGuards(JwtAccessStrategyGuard)
export class TerrainsController {
  constructor(private readonly terrainsService: TerrainsService) {}

  @Get('admin')
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return await this.terrainsService.findAll(page, limit);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.terrainsService.findOne(id);
  }

  @Post()
  async create(@Body() terrain: CreateTerrainDto) {
    return await this.terrainsService.create(terrain);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() terrain: UpdateTerrainDto,
  ) {
    return await this.terrainsService.update(id, terrain);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.terrainsService.delete(id);
  }

  @Patch(':id/upload-media')
  @UseInterceptors(FileInterceptor('media'))
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ThumbnailValidationPipe) media?: Express.Multer.File,
  ) {
    return await this.terrainsService.uploadMedia(id, media);
  }

  @Patch(':id/remove-media/:media_id')
  async removeMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('media_id') media_id: string,
  ) {
    return await this.terrainsService.removeMedia(id, media_id);
  }
}
