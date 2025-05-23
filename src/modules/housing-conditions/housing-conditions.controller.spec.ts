import { Test, TestingModule } from '@nestjs/testing';
import { HousingConditionsController } from './housing-conditions.controller';

describe('HousingConditionsController', () => {
  let controller: HousingConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousingConditionsController],
    }).compile();

    controller = module.get<HousingConditionsController>(HousingConditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
