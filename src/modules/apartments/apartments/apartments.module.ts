import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { DatabaseModule } from 'src/database';
import { Apartment, Media } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([Apartment, Media])],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
})
export class ApartmentsModule {}
