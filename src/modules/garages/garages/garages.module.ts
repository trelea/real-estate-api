import { TypeOrmModule } from '@nestjs/typeorm';
import { Garage } from 'src/database/entities/garage';
import { Location, Media, User } from 'src/database/entities';
import { Module } from '@nestjs/common';
import { GaragesService } from './garages.service';
import { GaragesController } from './garages.controller';
import { AwsS3Module } from 'src/modules/aws-s3/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Garage, Location, Media, User]),
    AwsS3Module,
  ],
  controllers: [GaragesController],
  providers: [GaragesService],
})
export class GaragesModule {}
