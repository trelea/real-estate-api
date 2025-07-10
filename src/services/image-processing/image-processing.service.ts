import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);
  private watermarkPath: string;

  constructor() {
    // Path to your watermark PNG file
    this.watermarkPath = path.join(
      process.cwd(),
      'src',
      'assets',
      'watermark.png',
    );

    // Check if watermark exists at startup
    if (!fs.existsSync(this.watermarkPath)) {
      this.logger.error(`Watermark file not found at: ${this.watermarkPath}`);
    } else {
      this.logger.log(`Watermark file found at: ${this.watermarkPath}`);
    }
  }

  async addWatermark(
    imageBuffer: Buffer,
    options?: {
      position?:
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
        | 'bottom-center'
        | 'center';
      scale?: number;
    },
  ): Promise<Buffer> {
    try {
      const {
        position = 'bottom-center', // Changed default from 'bottom-right' to 'bottom-center'
        scale = 0.35, // 35% of image width
      } = options || {};

      this.logger.log(
        `Adding watermark with position: ${position}, scale: ${scale}`,
      );

      // Check if watermark file exists
      if (!fs.existsSync(this.watermarkPath)) {
        this.logger.error(`Watermark file not found at: ${this.watermarkPath}`);
        throw new Error(`Watermark file not found at: ${this.watermarkPath}`);
      }

      // Get original image metadata
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      this.logger.log(
        `Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`,
      );

      if (!metadata.width || !metadata.height) {
        throw new Error('Could not get image dimensions');
      }

      // Calculate watermark size based on image dimensions
      const watermarkWidth = Math.trunc(metadata.width * scale);
      this.logger.log(
        `Watermark width will be: ${watermarkWidth}px (${scale * 100}% of image width)`,
      );

      // Load and resize watermark
      const processedWatermark = await sharp(this.watermarkPath)
        .resize({
          width: watermarkWidth,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .png({ quality: 100 })
        .toBuffer();

      // Get watermark metadata after resizing
      const watermarkMetadata = await sharp(processedWatermark).metadata();
      this.logger.log(
        `Processed watermark: ${watermarkMetadata.width}x${watermarkMetadata.height}`,
      );

      if (!watermarkMetadata.width || !watermarkMetadata.height) {
        throw new Error('Could not get watermark dimensions');
      }

      // Calculate position offset
      const { left, top } = this.calculateWatermarkPosition(
        metadata.width,
        metadata.height,
        watermarkMetadata.width,
        watermarkMetadata.height,
        position,
      );

      this.logger.log(`Watermark position: left=${left}, top=${top}`);

      // Apply watermark with high quality settings
      const watermarkedImage = await image
        .composite([
          {
            input: processedWatermark,
            left,
            top,
            blend: 'over',
          },
        ])
        .jpeg({
          quality: 95, // High quality
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();

      this.logger.log(
        `Watermarked image created successfully. Size: ${watermarkedImage.length} bytes`,
      );
      return watermarkedImage;
    } catch (error) {
      this.logger.error('Failed to add watermark:', error);
      throw new InternalServerErrorException(
        `Failed to add watermark: ${error.message}`,
      );
    }
  }

  async addWatermarkWithOpacity(
    imageBuffer: Buffer,
    options?: {
      position?:
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
        | 'bottom-center'
        | 'center';
      opacity?: number;
      scale?: number;
    },
  ): Promise<Buffer> {
    try {
      const {
        position = 'bottom-center',
        opacity = 0.8,
        scale = 0.35, // Increased from 0.15 to 0.35
      } = options || {};

      if (!fs.existsSync(this.watermarkPath)) {
        throw new Error(`Watermark file not found at: ${this.watermarkPath}`);
      }

      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error('Could not get image dimensions');
      }

      const watermarkWidth = Math.trunc(metadata.width * scale);

      // Load, resize and apply opacity to watermark in one step
      const watermarkWithOpacity = await sharp(this.watermarkPath)
        .resize({
          width: watermarkWidth,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .png()
        .toBuffer();

      // Get the actual dimensions of the resized watermark
      const watermarkMeta = await sharp(watermarkWithOpacity).metadata();

      if (!watermarkMeta.width || !watermarkMeta.height) {
        throw new Error('Could not get resized watermark dimensions');
      }

      // Create a semi-transparent version of the watermark
      const transparentWatermark = await sharp({
        create: {
          width: watermarkMeta.width,
          height: watermarkMeta.height,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: watermarkWithOpacity,
            blend: 'over',
          },
        ])
        .png()
        .modulate({
          brightness: 1,
          saturation: 1,
          hue: 0,
        })
        .composite([
          {
            input: {
              create: {
                width: watermarkMeta.width,
                height: watermarkMeta.height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: opacity },
              },
            },
            blend: 'dest-in',
          },
        ])
        .png()
        .toBuffer();

      const { left, top } = this.calculateWatermarkPosition(
        metadata.width,
        metadata.height,
        watermarkMeta.width,
        watermarkMeta.height,
        position,
      );

      const watermarkedImage = await image
        .composite([
          {
            input: transparentWatermark,
            left,
            top,
            blend: 'over',
          },
        ])
        .jpeg({ quality: 95 })
        .toBuffer();

      return watermarkedImage;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to add watermark with opacity: ${error.message}`,
      );
    }
  }

  async addWatermarkSimple(
    imageBuffer: Buffer,
    options?: {
      position?:
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
        | 'bottom-center'
        | 'center';
      scale?: number;
    },
  ): Promise<Buffer> {
    try {
      const { position = 'bottom-center', scale = 0.35 } = options || {}; // Increased scale

      if (!fs.existsSync(this.watermarkPath)) {
        throw new Error(`Watermark file not found at: ${this.watermarkPath}`);
      }

      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error('Could not get image dimensions');
      }

      const watermarkWidth = Math.trunc(metadata.width * scale);

      // Simple approach: just resize the watermark and composite it
      const resizedWatermark = await sharp(this.watermarkPath)
        .resize(watermarkWidth, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .png()
        .toBuffer();

      const watermarkMeta = await sharp(resizedWatermark).metadata();

      if (!watermarkMeta.width || !watermarkMeta.height) {
        throw new Error('Could not get watermark dimensions');
      }

      const { left, top } = this.calculateWatermarkPosition(
        metadata.width,
        metadata.height,
        watermarkMeta.width,
        watermarkMeta.height,
        position,
      );

      const result = await image
        .composite([
          {
            input: resizedWatermark,
            left,
            top,
            blend: 'over',
          },
        ])
        .jpeg({ quality: 95 })
        .toBuffer();

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to add simple watermark: ${error.message}`,
      );
    }
  }

  private calculateWatermarkPosition(
    imageWidth: number,
    imageHeight: number,
    watermarkWidth: number,
    watermarkHeight: number,
    position: string,
  ): { left: number; top: number } {
    const margin = 40; // Margin from edges
    let left: number, top: number;

    switch (position) {
      case 'top-left':
        left = margin;
        top = margin;
        break;
      case 'top-right':
        left = imageWidth - watermarkWidth - margin;
        top = margin;
        break;
      case 'bottom-left':
        left = margin;
        top = imageHeight - watermarkHeight - margin;
        break;
      case 'bottom-right':
        left = imageWidth - watermarkWidth - margin;
        top = imageHeight - watermarkHeight - margin;
        break;
      case 'bottom-center':
        // NEW: Horizontally centered, at the bottom
        left = Math.trunc((imageWidth - watermarkWidth) / 2);
        top = imageHeight - watermarkHeight - margin;
        break;
      case 'center':
        // Complete center of image
        left = Math.trunc((imageWidth - watermarkWidth) / 2);
        top = Math.trunc((imageHeight - watermarkHeight) / 2);
        break;
      default:
        // Default to bottom-center
        left = Math.trunc((imageWidth - watermarkWidth) / 2);
        top = imageHeight - watermarkHeight - margin;
    }

    return {
      left: Math.trunc(Math.max(0, left)),
      top: Math.trunc(Math.max(0, top)),
    };
  }

  async resizeImage(
    imageBuffer: Buffer,
    width?: number,
    height?: number,
    maintainAspectRatio: boolean = true,
  ): Promise<Buffer> {
    try {
      let resizeOptions: sharp.ResizeOptions = {};

      if (maintainAspectRatio) {
        resizeOptions = {
          width: width ? Math.trunc(width) : undefined,
          height: height ? Math.trunc(height) : undefined,
          fit: 'inside',
          withoutEnlargement: true,
        };
      } else {
        resizeOptions = {
          width: width ? Math.trunc(width) : undefined,
          height: height ? Math.trunc(height) : undefined,
        };
      }

      return await sharp(imageBuffer)
        .resize(resizeOptions)
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to resize image: ${error.message}`,
      );
    }
  }
}
