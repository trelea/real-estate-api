import { Test, TestingModule } from '@nestjs/testing';
import { PrivacyPolicyController } from './privacy-policy.controller';

describe('PrivacyPolicyController', () => {
  let controller: PrivacyPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivacyPolicyController],
    }).compile();

    controller = module.get<PrivacyPolicyController>(PrivacyPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
