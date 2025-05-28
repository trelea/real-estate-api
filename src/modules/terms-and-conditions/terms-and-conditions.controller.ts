import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { PatchTermsAndConditionsDto } from './dtos';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';

@Controller('terms-and-conditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {}
  @Get()
  async index() {
    return await this.termsAndConditionsService.index();
  }

  @Patch()
  @SetRoles([UserRole.ADMIN])
  @UseGuards(JwtAccessStrategyGuard, RolesGuard)
  async patch(@Body() termsAndConditionsContent: PatchTermsAndConditionsDto) {
    return await this.termsAndConditionsService.patch(
      termsAndConditionsContent,
    );
  }
}
