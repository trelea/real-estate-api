import { Module } from '@nestjs/common';
import { CommercialsPlacingsController } from './commercials-placings.controller';
import { CommercialsPlacingsService } from './commercials-placings.service';
import { DatabaseModule } from 'src/database';
import { CommercialPlacing } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([CommercialPlacing])],
  controllers: [CommercialsPlacingsController],
  providers: [CommercialsPlacingsService],
})
export class CommercialsPlacingsModule {}
