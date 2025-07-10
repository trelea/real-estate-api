import { Test, TestingModule } from '@nestjs/testing';
import { HousingStocksService } from './housing-stocks.service';

describe('HousingStocksService', () => {
  let service: HousingStocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousingStocksService],
    }).compile();

    service = module.get<HousingStocksService>(HousingStocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
