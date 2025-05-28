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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ParseIntPipeOptional,
  ThumbnailValidationPipe,
} from 'src/shared/pipes';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { Public, SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { BlogsService } from './blogs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsStatusInterceptor } from 'src/shared/interceptors/blogs-status.interceptor';

@Controller('blogs')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}
  /**
   * find all
   */
  @Public()
  @Get()
  @UseInterceptors(BlogsStatusInterceptor)
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.blogService.findAll(page, limit, search);
  }

  /**
   * create
   */
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() blog: CreateBlogDto,
    @UploadedFile(ThumbnailValidationPipe) thumbnail?: Express.Multer.File,
  ) {
    return await this.blogService.create(blog, thumbnail);
  }

  /**
   * find by id
   */
  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.blogService.findById(id);
  }

  /**
   * update
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() blog: UpdateBlogDto,
    @UploadedFile(ThumbnailValidationPipe) thumbnail?: Express.Multer.File,
  ) {
    return await this.blogService.update(id, blog, thumbnail);
  }

  /**
   * delete
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.blogService.delete(id);
  }

  /**
   * remove thumb
   */
  @Delete(':id/rm-thumb')
  async removeThumb(@Param('id') id: string) {
    return await this.blogService.removeThumb(id);
  }
}
