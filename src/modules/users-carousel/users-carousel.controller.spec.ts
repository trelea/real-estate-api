import { Test, TestingModule } from '@nestjs/testing';
import { UsersCarouselController } from './users-carousel.controller';

describe('UsersCarouselController', () => {
  let controller: UsersCarouselController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersCarouselController],
    }).compile();

    controller = module.get<UsersCarouselController>(UsersCarouselController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
