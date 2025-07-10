import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { S3UploadException } from 'src/shared/exceptions';
import { AwsS3UploadFileResponseType } from './types';
import { ImageProcessingService } from 'src/services/image-processing';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly imageProcessingService: ImageProcessingService,
  ) {
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

  async uploadFileWithWatermark(
    file: Express.Multer.File,
    metadata?: unknown,
    watermarkOptions?: {
      position?:
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
        | 'bottom-center'
        | 'center';
      scale?: number;
    },
  ): Promise<AwsS3UploadFileResponseType> {
    try {
      this.logger.log(
        `Starting watermark upload for file: ${file.originalname}`,
      );
      this.logger.log(`File mimetype: ${file.mimetype}`);
      this.logger.log(`File size: ${file.size} bytes`);

      // Check if the file is an image
      const isImage = file.mimetype.startsWith('image/');
      this.logger.log(`Is image file: ${isImage}`);

      let processedBuffer: Buffer;
      let contentType: string;

      if (isImage) {
        this.logger.log('Applying watermark to image...');

        // Use bottom-center as default position with bigger watermark
        const options = {
          position: watermarkOptions?.position || 'bottom-center', // Changed from 'bottom-right' to 'bottom-center'
          scale: watermarkOptions?.scale || 0.35, // 35% of image width
          ...watermarkOptions,
        };

        this.logger.log(`Watermark options: ${JSON.stringify(options)}`);

        try {
          // Apply watermark to image
          processedBuffer = await this.imageProcessingService.addWatermark(
            file.buffer,
            options,
          );

          this.logger.log(
            `Watermark applied successfully. Processed buffer size: ${processedBuffer.length} bytes`,
          );
          contentType = 'image/jpeg'; // Watermarked images are converted to JPEG
        } catch (watermarkError) {
          this.logger.error('Failed to apply watermark:', watermarkError);
          // If watermark fails, upload original file
          processedBuffer = file.buffer;
          contentType = file.mimetype;
        }
      } else {
        this.logger.log('Non-image file, uploading without watermark');
        // For non-image files, use original buffer
        processedBuffer = file.buffer;
        contentType = file.mimetype;
      }

      const Key: string = `${randomUUID()}-${Date.now()}-${file.originalname}`;
      this.logger.log(`Uploading to S3 with key: ${Key}`);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Body: processedBuffer,
        Key,
        ContentType: contentType,
        ACL: 'public-read',
        Metadata: {
          data: JSON.stringify(metadata),
          watermarked: isImage ? 'true' : 'false',
          originalSize: file.size.toString(),
          processedSize: processedBuffer.length.toString(),
        },
      });

      const result = await this.s3.send(command);
      const url = `https://${this.bucket}.s3.${this.configService.getOrThrow<string>('AWS_S3_REGION')}.amazonaws.com/${Key}`;

      this.logger.log(`File uploaded successfully to: ${url}`);

      return {
        object: result,
        url,
      };
    } catch (err) {
      this.logger.error('Error in uploadFileWithWatermark:', err);
      throw new S3UploadException();
    }
  }

  async deleteFile() {}
}
