import { Test, TestingModule } from '@nestjs/testing';
import { GaragesController } from './garages.controller';

describe('GaragesController', () => {
  let controller: GaragesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GaragesController],
    }).compile();

    controller = module.get<GaragesController>(GaragesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
