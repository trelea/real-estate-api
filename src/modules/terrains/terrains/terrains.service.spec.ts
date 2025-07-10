import { Test, TestingModule } from '@nestjs/testing';
import { TerrainsService } from './terrains.service';

describe('TerrainsService', () => {
  let service: TerrainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerrainsService],
    }).compile();

    service = module.get<TerrainsService>(TerrainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
