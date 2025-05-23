import { Test, TestingModule } from '@nestjs/testing';
import { HousingStocksController } from './housing-stocks.controller';

describe('HousingStocksController', () => {
  let controller: HousingStocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousingStocksController],
    }).compile();

    controller = module.get<HousingStocksController>(HousingStocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
