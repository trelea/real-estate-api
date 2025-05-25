import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';

@Module({
  providers: [HousesService],
  controllers: [HousesController]
})
export class HousesModule {}
