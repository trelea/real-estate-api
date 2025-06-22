import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { DatabaseModule } from 'src/database';
import {
  Apartment,
  Location,
  Media,
  LocationCategory,
  LocationSubcategory,
  HousingStock,
  HousingCondition,
  ApartmentFeature,
  User,
} from 'src/database/entities';
import { AwsS3Module } from 'src/modules/aws-s3/aws-s3.module';

@Module({
  imports: [
    DatabaseModule.forFeature([
      Apartment,
      Media,
      Location,
      LocationCategory,
      LocationSubcategory,
      HousingStock,
      HousingCondition,
      ApartmentFeature,
      User,
    ]),
    AwsS3Module,
  ],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
})
export class ApartmentsModule {}
