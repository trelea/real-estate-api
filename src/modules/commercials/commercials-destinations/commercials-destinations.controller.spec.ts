import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsDestinationsController } from './commercials-destinations.controller';

describe('CommercialsDestinationsController', () => {
  let controller: CommercialsDestinationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialsDestinationsController],
    }).compile();

    controller = module.get<CommercialsDestinationsController>(CommercialsDestinationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
