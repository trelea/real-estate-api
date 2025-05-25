import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentsFeaturesController } from './apartments-features.controller';

describe('ApartmentsFeaturesController', () => {
  let controller: ApartmentsFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApartmentsFeaturesController],
    }).compile();

    controller = module.get<ApartmentsFeaturesController>(ApartmentsFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
