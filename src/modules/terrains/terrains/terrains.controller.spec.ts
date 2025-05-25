import { Test, TestingModule } from '@nestjs/testing';
import { TerrainsController } from './terrains.controller';

describe('TerrainsController', () => {
  let controller: TerrainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerrainsController],
    }).compile();

    controller = module.get<TerrainsController>(TerrainsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
