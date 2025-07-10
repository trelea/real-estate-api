import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsPlacingsController } from './commercials-placings.controller';

describe('CommercialsPlacingsController', () => {
  let controller: CommercialsPlacingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialsPlacingsController],
    }).compile();

    controller = module.get<CommercialsPlacingsController>(CommercialsPlacingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
