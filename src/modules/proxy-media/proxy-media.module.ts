import { Module } from '@nestjs/common';
import { ProxyMediaController } from './proxy-media.controller';

@Module({
  controllers: [ProxyMediaController]
})
export class ProxyMediaModule {}
