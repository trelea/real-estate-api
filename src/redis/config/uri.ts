import { ConfigService } from '@nestjs/config';

export default (config: ConfigService) =>
  `redis://${config.getOrThrow<string>('REDIS_USER')}:${config.getOrThrow<string>('REDIS_PASS')}@${config.getOrThrow<string>('REDIS_HOST')}:${config.getOrThrow<string>('REDIS_PORT')}`;
