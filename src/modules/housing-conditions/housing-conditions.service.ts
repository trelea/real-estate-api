import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HousingCondition } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';
import { Repository } from 'typeorm';

@Injectable()
export class HousingConditionsService extends MultilingualService<HousingCondition> {
  constructor(
    @InjectRepository(HousingCondition)
    protected readonly housingConditionsRepository: Repository<HousingCondition>,
  ) {
    super(housingConditionsRepository);
  }
}
