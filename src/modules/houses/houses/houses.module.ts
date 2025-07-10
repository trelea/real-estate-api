import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';
import { DatabaseModule } from 'src/database';
import {
  House,
  Media,
  Location,
  LocationCategory,
  LocationSubcategory,
  HousingStock,
  HousingCondition,
  HouseFeature,
  User,
} from 'src/database/entities';
import { AwsS3Module } from 'src/modules/aws-s3/aws-s3.module';

@Module({
  imports: [
    DatabaseModule.forFeature([
      House,
      Media,
      Location,
      LocationCategory,
      LocationSubcategory,
      HousingStock,
      HousingCondition,
      HouseFeature,
      User,
    ]),
    AwsS3Module,
  ],
  providers: [HousesService],
  controllers: [HousesController],
})
export class HousesModule {}
