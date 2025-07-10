import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy-policy.service';
import { PatchPrivacyPolicyDto } from './dtos';
import { JwtAccessStrategyGuard } from 'src/core/auth/guards';
import { RolesGuard } from 'src/shared/guards';
import { SetRoles } from 'src/shared/decorators';
import { UserRole } from 'src/database/entities';

@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @Get()
  async index() {
    return await this.privacyPolicyService.index();
  }

  @Patch()
  @SetRoles([UserRole.ADMIN])
  @UseGuards(JwtAccessStrategyGuard, RolesGuard)
  async patch(@Body() privacyPolicyContent: PatchPrivacyPolicyDto) {
    return await this.privacyPolicyService.patch(privacyPolicyContent);
  }
}
