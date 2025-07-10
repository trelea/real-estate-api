import { Test, TestingModule } from '@nestjs/testing';
import { HousesFeaturesController } from './houses-features.controller';

describe('HousesFeaturesController', () => {
  let controller: HousesFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousesFeaturesController],
    }).compile();

    controller = module.get<HousesFeaturesController>(HousesFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
