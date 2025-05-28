import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ThumbnailValidationPipe implements PipeTransform {
  constructor(private readonly size: number = 1024 * 1024 * 5) {}

  transform(thumbnail: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!thumbnail) return;
    if (thumbnail.size > this.size)
      throw new BadRequestException('Max File Size 1MB');

    if (
      !['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(
        thumbnail.mimetype,
      )
    )
      throw new BadRequestException('Invalid File Type');

    return thumbnail;
  }
}
