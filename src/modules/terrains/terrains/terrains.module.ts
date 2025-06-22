import { TypeOrmModule } from '@nestjs/typeorm';
import { Terrain } from 'src/database/entities/terrain';
import { Location, Media, User } from 'src/database/entities';
import { Module } from '@nestjs/common';
import { TerrainsService } from './terrains.service';
import { TerrainsController } from './terrains.controller';
import { AwsS3Service } from 'src/modules/aws-s3/aws-s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Terrain, Location, Media, User])],
  controllers: [TerrainsController],
  providers: [TerrainsService, AwsS3Service],
})
export class TerrainsModule {}
