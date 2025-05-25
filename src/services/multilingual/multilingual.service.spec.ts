import { Test, TestingModule } from '@nestjs/testing';
import { MultilingualService } from './multilingual.service';

describe('MultilingualService', () => {
  let service: MultilingualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultilingualService],
    }).compile();

    service = module.get<MultilingualService>(MultilingualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
