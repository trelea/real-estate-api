import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HousingStock } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';
import { Repository } from 'typeorm';

@Injectable()
export class HousingStocksService extends MultilingualService<HousingStock> {
  constructor(
    @InjectRepository(HousingStock)
    protected readonly housingStocksRepository: Repository<HousingStock>,
  ) {
    super(housingStocksRepository);
  }
}
