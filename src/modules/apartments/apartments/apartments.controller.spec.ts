import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentsController } from './apartments.controller';

describe('ApartmentsController', () => {
  let controller: ApartmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApartmentsController],
    }).compile();

    controller = module.get<ApartmentsController>(ApartmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
