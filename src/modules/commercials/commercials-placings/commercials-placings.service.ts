import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommercialPlacing } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';

@Injectable()
export class CommercialsPlacingsService extends MultilingualService<CommercialPlacing> {
  constructor(
    @InjectRepository(CommercialPlacing)
    protected readonly commercialPlacingsRepository: Repository<CommercialPlacing>,
  ) {
    super(commercialPlacingsRepository);
  }
}
