import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommercialFeature } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';

@Injectable()
export class CommercialsFeaturesService extends MultilingualService<CommercialFeature> {
  constructor(
    @InjectRepository(CommercialFeature)
    protected readonly commercialFeaturesRepository: Repository<CommercialFeature>,
  ) {
    super(commercialFeaturesRepository);
  }
}
