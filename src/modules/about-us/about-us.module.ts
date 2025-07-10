import { Module } from '@nestjs/common';
import { AboutUsController } from './about-us.controller';
import { AboutUsService } from './about-us.service';
import { DatabaseModule } from 'src/database';
import { AboutUs } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([AboutUs])],
  controllers: [AboutUsController],
  providers: [AboutUsService],
})
export class AboutUsModule {}
