import { Module } from '@nestjs/common';
import { GaragesFeaturesController } from './garages-features.controller';
import { GaragesFeaturesService } from './garages-features.service';
import { DatabaseModule } from 'src/database';
import { GarageFeature } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([GarageFeature])],
  controllers: [GaragesFeaturesController],
  providers: [GaragesFeaturesService],
})
export class GaragesFeaturesModule {}
