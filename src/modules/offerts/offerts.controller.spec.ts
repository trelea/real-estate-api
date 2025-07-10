import { Test, TestingModule } from '@nestjs/testing';
import { OffertsController } from './offerts.controller';

describe('OffertsController', () => {
  let controller: OffertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffertsController],
    }).compile();

    controller = module.get<OffertsController>(OffertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
