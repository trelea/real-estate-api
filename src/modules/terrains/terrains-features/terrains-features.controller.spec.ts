import { Test, TestingModule } from '@nestjs/testing';
import { TerrainsFeaturesController } from './terrains-features.controller';

describe('TerrainsFeaturesController', () => {
  let controller: TerrainsFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerrainsFeaturesController],
    }).compile();

    controller = module.get<TerrainsFeaturesController>(TerrainsFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
