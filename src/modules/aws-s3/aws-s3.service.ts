import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { S3UploadException } from 'src/shared/exceptions';
import { AwsS3UploadFileResponseType } from './types';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_S3_ACCESS'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_S3_SECRET'),
      },
    });
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET');
  }

  async uploadFile(
    file: Express.Multer.File,
    metadata?: unknown,
  ): Promise<AwsS3UploadFileResponseType> {
    const Key: string = `${randomUUID()}-${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Body: file.buffer,
      Key,
      ContentType: file.mimetype,
      ACL: 'public-read',
      Metadata: { data: JSON.stringify(metadata) },
    });
    try {
      return {
        object: await this.s3.send(command),
        url: `https://${this.bucket}.s3.${this.configService.getOrThrow<string>('AWS_S3_REGION')}.amazonaws.com/${Key}`,
      };
    } catch (err) {
      throw new S3UploadException();
    }
  }

  async deleteFile() {}
}
