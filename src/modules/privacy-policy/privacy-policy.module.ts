import { Module } from '@nestjs/common';
import { PrivacyPolicyController } from './privacy-policy.controller';
import { PrivacyPolicyService } from './privacy-policy.service';
import { DatabaseModule } from 'src/database';
import { PrivacyPolicy } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([PrivacyPolicy])],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService],
})
export class PrivacyPolicyModule {}
