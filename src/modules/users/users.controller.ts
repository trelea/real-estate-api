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
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { UserRole } from 'src/database/entities';
import { SetRoles } from 'src/shared/decorators';
import { RolesGuard } from 'src/shared/guards';
import {
  ParseIntPipeOptional,
  ThumbnailValidationPipe,
} from 'src/shared/pipes';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('users')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * create agent or admin
   */
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() user: CreateUserDto,
    @UploadedFile(ThumbnailValidationPipe) thumbnail?: Express.Multer.File,
  ) {
    return await this.usersService.create(user, thumbnail);
  }

  /**
   * find all
   */
  @Get()
  @SetRoles([UserRole.USER, UserRole.ADMIN])
  async findAll(
    @Query('page', ParseIntPipeOptional) page?: number,
    @Query('limit', ParseIntPipeOptional) limit?: number,
  ) {
    return await this.usersService.findAll(page, limit);
  }

  /**
   * find by id
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  /**
   * delete by id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  /**
   * update
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() user?: UpdateUserDto,
    @UploadedFile(ThumbnailValidationPipe) thumbnail?: Express.Multer.File,
  ) {
    return this.usersService.update(id, user, thumbnail);
  }
}
