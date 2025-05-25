import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsFeaturesService } from './commercials-features.service';

describe('CommercialsFeaturesService', () => {
  let service: CommercialsFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialsFeaturesService],
    }).compile();

    service = module.get<CommercialsFeaturesService>(CommercialsFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
