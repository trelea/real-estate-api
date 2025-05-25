import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TerrainFeature } from 'src/database/entities';
import { MultilingualService } from 'src/services/multilingual';

@Injectable()
export class TerrainsFeaturesService extends MultilingualService<TerrainFeature> {
  constructor(
    @InjectRepository(TerrainFeature)
    protected readonly terrainsFeaturesRepository: Repository<TerrainFeature>,
  ) {
    super(terrainsFeaturesRepository);
  }
}
