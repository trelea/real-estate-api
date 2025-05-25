import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseFeature } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';

@Injectable()
export class HousesFeaturesService extends MultilingualService<HouseFeature> {
  constructor(
    @InjectRepository(HouseFeature)
    protected readonly housesFeaturesRepository: Repository<HouseFeature>,
  ) {
    super(housesFeaturesRepository);
  }
}
