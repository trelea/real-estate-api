import { Test, TestingModule } from '@nestjs/testing';
import { OffertsService } from './offerts.service';

describe('OffertsService', () => {
  let service: OffertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffertsService],
    }).compile();

    service = module.get<OffertsService>(OffertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
