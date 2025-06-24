import { Module } from '@nestjs/common';
import { OffertsController } from './offerts.controller';
import { OffertsService } from './offerts.service';
import { DatabaseModule } from 'src/database';
import { Apartment } from 'src/database/entities/apartment';
import { House } from 'src/database/entities/house';
import { Commercial } from 'src/database/entities/commercial';
import { Terrain } from 'src/database/entities/terrain';

@Module({
  imports: [DatabaseModule.forFeature([Apartment, House, Commercial, Terrain])],
  controllers: [OffertsController],
  providers: [OffertsService],
})
export class OffertsModule {}
