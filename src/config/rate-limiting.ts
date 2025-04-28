import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';

export const throttlerConfig: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    throttlers: [
      {
        ttl:
          60 *
          1000 *
          parseInt(configService.getOrThrow<string>('THROTTLE_TTL')),
        limit: parseInt(configService.getOrThrow<string>('THROTTLE_LIMIT')),
      },
    ],
  }),
  inject: [ConfigService],
};
