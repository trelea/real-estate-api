import { Test, TestingModule } from '@nestjs/testing';
import { GaragesFeaturesController } from './garages-features.controller';

describe('GaragesFeaturesController', () => {
  let controller: GaragesFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GaragesFeaturesController],
    }).compile();

    controller = module.get<GaragesFeaturesController>(GaragesFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
