import { Test, TestingModule } from '@nestjs/testing';
import { UsersCarouselService } from './users-carousel.service';

describe('UsersCarouselService', () => {
  let service: UsersCarouselService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersCarouselService],
    }).compile();

    service = module.get<UsersCarouselService>(UsersCarouselService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
