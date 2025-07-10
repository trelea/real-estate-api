import { Test, TestingModule } from '@nestjs/testing';
import { AboutUsController } from './about-us.controller';

describe('AboutUsController', () => {
  let controller: AboutUsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutUsController],
    }).compile();

    controller = module.get<AboutUsController>(AboutUsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
