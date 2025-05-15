import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateBlogDto } from 'src/modules/blogs/dtos';

@Injectable()
export class DeserializeBlogsDataPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && metadata?.type === 'body') {
      // Check if 'title' and 'desc' exist and are strings, and deserialize them
      if (value.title) {
        value.title = JSON.parse(value.title); // Deserialize JSON string to an object
      }
      if (value.desc) {
        value.desc = JSON.parse(value.desc); // Deserialize JSON string to an object
      }

      // Transform the data into the correct class (CreateBlogDto)
      return plainToClass(CreateBlogDto, value);
    }
    return value;
  }
}
