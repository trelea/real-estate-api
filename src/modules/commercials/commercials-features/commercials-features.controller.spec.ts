import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsFeaturesController } from './commercials-features.controller';

describe('CommercialsFeaturesController', () => {
  let controller: CommercialsFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialsFeaturesController],
    }).compile();

    controller = module.get<CommercialsFeaturesController>(CommercialsFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
