import { Test, TestingModule } from '@nestjs/testing';
import { HousesFeaturesService } from './houses-features.service';

describe('HousesFeaturesService', () => {
  let service: HousesFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousesFeaturesService],
    }).compile();

    service = module.get<HousesFeaturesService>(HousesFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
