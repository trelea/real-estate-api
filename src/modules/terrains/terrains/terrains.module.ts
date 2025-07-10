import { TypeOrmModule } from '@nestjs/typeorm';
import { Terrain } from 'src/database/entities/terrain';
import { Location, Media, User } from 'src/database/entities';
import { Module } from '@nestjs/common';
import { TerrainsService } from './terrains.service';
import { TerrainsController } from './terrains.controller';
import { AwsS3Module } from 'src/modules/aws-s3/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Terrain, Location, Media, User]),
    AwsS3Module,
  ],
  controllers: [TerrainsController],
  providers: [TerrainsService],
})
export class TerrainsModule {}
