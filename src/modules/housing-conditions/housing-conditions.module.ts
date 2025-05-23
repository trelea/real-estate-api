import { Module } from '@nestjs/common';
import { HousingConditionsService } from './housing-conditions.service';
import { HousingConditionsController } from './housing-conditions.controller';
import { DatabaseModule } from 'src/database';
import { HousingCondition } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([HousingCondition])],
  providers: [HousingConditionsService],
  controllers: [HousingConditionsController],
})
export class HousingConditionsModule {}
