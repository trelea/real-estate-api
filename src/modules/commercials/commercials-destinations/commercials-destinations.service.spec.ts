import { Test, TestingModule } from '@nestjs/testing';
import { CommercialsDestinationsService } from './commercials-destinations.service';

describe('CommercialsDestinationsService', () => {
  let service: CommercialsDestinationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommercialsDestinationsService],
    }).compile();

    service = module.get<CommercialsDestinationsService>(CommercialsDestinationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
