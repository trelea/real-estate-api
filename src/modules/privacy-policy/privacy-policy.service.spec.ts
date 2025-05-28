import { Test, TestingModule } from '@nestjs/testing';
import { PrivacyPolicyService } from './privacy-policy.service';

describe('PrivacyPolicyService', () => {
  let service: PrivacyPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivacyPolicyService],
    }).compile();

    service = module.get<PrivacyPolicyService>(PrivacyPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
