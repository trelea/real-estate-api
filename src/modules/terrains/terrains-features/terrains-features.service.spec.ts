import { Test, TestingModule } from '@nestjs/testing';
import { TerrainsFeaturesService } from './terrains-features.service';

describe('TerrainsFeaturesService', () => {
  let service: TerrainsFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerrainsFeaturesService],
    }).compile();

    service = module.get<TerrainsFeaturesService>(TerrainsFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
