import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentsFeaturesService } from './apartments-features.service';

describe('ApartmentsFeaturesService', () => {
  let service: ApartmentsFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApartmentsFeaturesService],
    }).compile();

    service = module.get<ApartmentsFeaturesService>(ApartmentsFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
