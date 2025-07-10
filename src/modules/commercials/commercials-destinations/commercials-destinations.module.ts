import { Module } from '@nestjs/common';
import { CommercialsDestinationsController } from './commercials-destinations.controller';
import { CommercialsDestinationsService } from './commercials-destinations.service';
import { DatabaseModule } from 'src/database';
import { CommercialDestination } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([CommercialDestination])],
  controllers: [CommercialsDestinationsController],
  providers: [CommercialsDestinationsService],
})
export class CommercialsDestinationsModule {}
