import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ThumbnailValidationPipe implements PipeTransform {
  transform(thumbnail: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!thumbnail) return;
    if (thumbnail.size > 50 * 1024)
      throw new BadRequestException('Max File Size 50KB');

    if (
      !['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(
        thumbnail.mimetype,
      )
    )
      throw new BadRequestException('Invalid File Type');

    return thumbnail;
  }
}
