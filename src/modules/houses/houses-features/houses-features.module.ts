import { Module } from '@nestjs/common';
import { HousesFeaturesController } from './houses-features.controller';
import { HousesFeaturesService } from './houses-features.service';
import { DatabaseModule } from 'src/database';
import { HouseFeature } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([HouseFeature])],
  controllers: [HousesFeaturesController],
  providers: [HousesFeaturesService],
})
export class HousesFeaturesModule {}
