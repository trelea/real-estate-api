import { Test, TestingModule } from '@nestjs/testing';
import { TerrainsUsabilitiesService } from './terrains-usabilities.service';

describe('TerrainsUsabilitiesService', () => {
  let service: TerrainsUsabilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerrainsUsabilitiesService],
    }).compile();

    service = module.get<TerrainsUsabilitiesService>(TerrainsUsabilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
