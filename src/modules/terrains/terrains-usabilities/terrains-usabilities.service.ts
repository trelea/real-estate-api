import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerrainUsability } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';

@Injectable()
export class TerrainsUsabilitiesService extends MultilingualService<TerrainUsability> {
  constructor(
    @InjectRepository(TerrainUsability)
    protected readonly terrainsUsabilitiesRepository: Repository<TerrainUsability>,
  ) {
    super(terrainsUsabilitiesRepository);
  }
}
