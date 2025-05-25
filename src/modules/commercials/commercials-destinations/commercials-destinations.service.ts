import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommercialDestination } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';
import { Repository } from 'typeorm';

@Injectable()
export class CommercialsDestinationsService extends MultilingualService<CommercialDestination> {
  constructor(
    @InjectRepository(CommercialDestination)
    protected readonly commercialDestinationsRepository: Repository<CommercialDestination>,
  ) {
    super(commercialDestinationsRepository);
  }
}
