import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AboutUsService } from './about-us.service';
import { PatchAboutUsDto } from './dtos';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get()
  async index() {
    return await this.aboutUsService.index();
  }

  @Patch()
  @SetRoles([UserRole.ADMIN])
  @UseGuards(JwtAccessStrategyGuard, RolesGuard)
  async patch(@Body() aboutUsContent: PatchAboutUsDto) {
    return await this.aboutUsService.patch(aboutUsContent);
  }
}
