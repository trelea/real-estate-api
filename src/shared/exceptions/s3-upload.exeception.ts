import { HttpException, HttpStatus } from '@nestjs/common';

export class S3UploadException extends HttpException {
  constructor(
    readonly message: string = 'Failed To Upload File To S3',
    readonly error?: unknown,
  ) {
    super({ message, error }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
