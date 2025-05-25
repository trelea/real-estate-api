import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsPlacingsService } from './commercials-placings.service';

describe('CommercialsPlacingsService', () => {
  let service: CommercialsPlacingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialsPlacingsService],
    }).compile();

    service = module.get<CommercialsPlacingsService>(CommercialsPlacingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
