import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('proxy-media')
export class ProxyMediaController {
  constructor(private readonly configService: ConfigService) {}
  @Get('')
  async fetchImage(
    @Query('url') url: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      // Define your allowed origins
      const allowedOrigins = this.configService
        .getOrThrow<string>('ORIGINS')
        .split(',');

      // Get the request origin
      const requestOrigin =
        req.headers.origin ||
        req.headers.referer?.split('/').slice(0, 3).join('/');

      // Check if origin is allowed
      const origin = allowedOrigins.includes(requestOrigin as string)
        ? requestOrigin
        : allowedOrigins[0];

      res.set({
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        Vary: 'Origin', // Important for caching
        'Cache-Control': 'public, max-age=3600',
      });

      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).send('Failed to fetch image');
    }
  }
}
