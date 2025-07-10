import { Test, TestingModule } from '@nestjs/testing';
import { TermsAndConditionsService } from './terms-and-conditions.service';

describe('TermsAndConditionsService', () => {
  let service: TermsAndConditionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TermsAndConditionsService],
    }).compile();

    service = module.get<TermsAndConditionsService>(TermsAndConditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
