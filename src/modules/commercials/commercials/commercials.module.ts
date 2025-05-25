import { Module } from '@nestjs/common';
import { CommercialsController } from './commercials.controller';
import { CommercialsService } from './commercials.service';

@Module({
  controllers: [CommercialsController],
  providers: [CommercialsService]
})
export class CommercialsModule {}
