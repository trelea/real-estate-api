import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsController } from './commercials.controller';

describe('CommercialsController', () => {
  let controller: CommercialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommercialsController],
    }).compile();

    controller = module.get<CommercialsController>(CommercialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
