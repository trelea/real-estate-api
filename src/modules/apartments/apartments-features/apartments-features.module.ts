import { Module } from '@nestjs/common';
import { ApartmentsFeaturesController } from './apartments-features.controller';
import { ApartmentsFeaturesService } from './apartments-features.service';
import { DatabaseModule } from 'src/database';
import { ApartmentFeature } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([ApartmentFeature])],
  controllers: [ApartmentsFeaturesController],
  providers: [ApartmentsFeaturesService],
})
export class ApartmentsFeaturesModule {}
