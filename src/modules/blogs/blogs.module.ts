import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { AwsS3Module } from '../aws-s3/aws-s3.module';
import { DatabaseModule } from 'src/database';
import { Blog, BlogContent } from 'src/database/entities';

@Module({
  imports: [AwsS3Module, DatabaseModule.forFeature([Blog, BlogContent])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
