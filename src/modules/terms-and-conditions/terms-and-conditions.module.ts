import { Module } from '@nestjs/common';
import { TermsAndConditionsController } from './terms-and-conditions.controller';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { DatabaseModule } from 'src/database';
import { TermsAnsConditions } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([TermsAnsConditions])],
  controllers: [TermsAndConditionsController],
  providers: [TermsAndConditionsService],
})
export class TermsAndConditionsModule {}
