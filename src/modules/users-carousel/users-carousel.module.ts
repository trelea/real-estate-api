import { Module } from '@nestjs/common';
import { UsersCarouselController } from './users-carousel.controller';
import { UsersCarouselService } from './users-carousel.service';
import { DatabaseModule } from 'src/database';
import { UserCarousel } from 'src/database/entities';
import { UsersModule } from 'src/core/users';

@Module({
  imports: [DatabaseModule.forFeature([UserCarousel]), UsersModule],
  controllers: [UsersCarouselController],
  providers: [UsersCarouselService],
})
export class UsersCarouselModule {}
