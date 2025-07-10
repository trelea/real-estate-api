import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { DatabaseModule } from 'src/database';
import { Service, ServiceContent, ServiceLanding } from 'src/database/entities';

@Module({
  imports: [
    AwsS3Module,
    DatabaseModule.forFeature([Service, ServiceContent, ServiceLanding]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
