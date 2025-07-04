import { TypeOrmModule } from '@nestjs/typeorm';
import { Commercial } from 'src/database/entities/commercial';
import { Location, Media, User } from 'src/database/entities';
import { Module } from '@nestjs/common';
import { CommercialsService } from './commercials.service';
import { CommercialsController } from './commercials.controller';
import { AwsS3Module } from 'src/modules/aws-s3/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commercial, Location, Media, User]),
    AwsS3Module,
  ],
  controllers: [CommercialsController],
  providers: [CommercialsService],
})
export class CommercialsModule {}
