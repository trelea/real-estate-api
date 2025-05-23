import { Test, TestingModule } from '@nestjs/testing';
import { HousingConditionsService } from './housing-conditions.service';

describe('HousingConditionsService', () => {
  let service: HousingConditionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousingConditionsService],
    }).compile();

    service = module.get<HousingConditionsService>(HousingConditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
