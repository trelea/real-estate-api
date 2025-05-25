import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsService } from './commercials.service';

describe('CommercialsService', () => {
  let service: CommercialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialsService],
    }).compile();

    service = module.get<CommercialsService>(CommercialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
