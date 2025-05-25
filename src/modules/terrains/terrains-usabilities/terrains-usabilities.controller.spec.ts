import { Test, TestingModule } from '@nestjs/testing';
import { TerrainsUsabilitiesController } from './terrains-usabilities.controller';

describe('TerrainsUsabilitiesController', () => {
  let controller: TerrainsUsabilitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerrainsUsabilitiesController],
    }).compile();

    controller = module.get<TerrainsUsabilitiesController>(TerrainsUsabilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
