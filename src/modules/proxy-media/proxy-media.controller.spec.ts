import { Test, TestingModule } from '@nestjs/testing';
import { ProxyMediaController } from './proxy-media.controller';

describe('ProxyMediaController', () => {
  let controller: ProxyMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProxyMediaController],
    }).compile();

    controller = module.get<ProxyMediaController>(ProxyMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
