import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApartmentFeature } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';
import { Repository } from 'typeorm';

@Injectable()
export class ApartmentsFeaturesService extends MultilingualService<ApartmentFeature> {
  constructor(
    @InjectRepository(ApartmentFeature)
    protected readonly apartmentFeaturesRepository: Repository<ApartmentFeature>,
  ) {
    super(apartmentFeaturesRepository);
  }
}
