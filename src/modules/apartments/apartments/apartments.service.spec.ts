import { Test, TestingModule } from '@nestjs/testing';
import { ApartmentsService } from './apartments.service';

describe('ApartmentsService', () => {
  let service: ApartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApartmentsService],
    }).compile();

    service = module.get<ApartmentsService>(ApartmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
