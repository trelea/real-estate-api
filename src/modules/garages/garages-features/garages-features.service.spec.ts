import { Test, TestingModule } from '@nestjs/testing';
import { GaragesFeaturesService } from './garages-features.service';

describe('GaragesFeaturesService', () => {
  let service: GaragesFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GaragesFeaturesService],
    }).compile();

    service = module.get<GaragesFeaturesService>(GaragesFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
