import { Module } from '@nestjs/common';
import { CommercialsFeaturesController } from './commercials-features.controller';
import { CommercialsFeaturesService } from './commercials-features.service';
import { DatabaseModule } from 'src/database';
import { CommercialFeature } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([CommercialFeature])],
  controllers: [CommercialsFeaturesController],
  providers: [CommercialsFeaturesService],
})
export class CommercialsFeaturesModule {}
