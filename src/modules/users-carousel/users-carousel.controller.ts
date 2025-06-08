import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersCarouselService } from './users-carousel.service';
import { CreateUserCarouselDto, UpdateUserCarouselDto } from './dtos';
import { Public, SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';

@Controller('users-carousel')
@SetRoles([UserRole.ADMIN])
@UseGuards(JwtAccessStrategyGuard, RolesGuard)
export class UsersCarouselController {
  constructor(private readonly usersCarouselService: UsersCarouselService) {}

  @Get()
  @Public()
  async findAll() {
    return await this.usersCarouselService.findAll();
  }

  @Post()
  async create(@Body() entry: CreateUserCarouselDto) {
    return this.usersCarouselService.create(entry);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() entry: UpdateUserCarouselDto) {
    return await this.usersCarouselService.update(id, entry);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersCarouselService.remove(id);
  }
}
