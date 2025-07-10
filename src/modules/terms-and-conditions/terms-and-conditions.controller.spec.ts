import { Test, TestingModule } from '@nestjs/testing';
import { TermsAndConditionsController } from './terms-and-conditions.controller';

describe('TermsAndConditionsController', () => {
  let controller: TermsAndConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TermsAndConditionsController],
    }).compile();

    controller = module.get<TermsAndConditionsController>(TermsAndConditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
