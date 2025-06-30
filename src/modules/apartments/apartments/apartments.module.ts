import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Apartment,
  ApartmentFeature,
  HousingCondition,
  HousingStock,
  Location,
  LocationCategory,
  LocationSubcategory,
  Media,
  User,
} from 'src/database/entities';
import { AwsS3Module } from 'src/modules/aws-s3/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apartment,
      Location,
      Media,
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
