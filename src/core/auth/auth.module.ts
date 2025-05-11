import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users';
import { CryptoService } from 'src/crypto';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from 'src/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync(throttlerConfig),
    UsersModule,
    JwtModule,
    RedisModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptoService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
