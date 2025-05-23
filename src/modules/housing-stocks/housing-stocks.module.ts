import { Module } from '@nestjs/common';
import { HousingStocksService } from './housing-stocks.service';
import { HousingStocksController } from './housing-stocks.controller';
import { DatabaseModule } from 'src/database';
import { HousingStock } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([HousingStock])],
  providers: [HousingStocksService],
  controllers: [HousingStocksController],
})
export class HousingStocksModule {}
