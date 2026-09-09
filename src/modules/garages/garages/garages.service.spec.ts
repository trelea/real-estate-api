import { Test, TestingModule } from '@nestjs/testing';
import { GaragesService } from './garages.service';

describe('GaragesService', () => {
  let service: GaragesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GaragesService],
    }).compile();

    service = module.get<GaragesService>(GaragesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
