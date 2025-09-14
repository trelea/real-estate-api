import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('proxy-media')
export class ProxyMediaController {
  @Get('')
  async fetchImage(@Query('url') url: string, @Res() res: Response) {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      res.set({
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      });

      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).send('Failed to fetch image');
    }
  }
}
