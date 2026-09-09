import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GarageFeature } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';

@Injectable()
export class GaragesFeaturesService extends MultilingualService<GarageFeature> {
  constructor(
    @InjectRepository(GarageFeature)
    protected readonly garagesFeaturesRepository: Repository<GarageFeature>,
  ) {
    super(garagesFeaturesRepository);
  }
}
