import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/database/entities';
import { RedisService } from 'src/redis';
import { CACHE_NAMESPACE } from 'src/redis/config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req.cookies[
            configService.getOrThrow<string>('JWT_ACCESS_COOKIE_NAME')
          ],
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ data: key }: { data: string }) {
    const user = await this.redisService.get<{ user: User }>({
      ns: CACHE_NAMESPACE.ATKNS,
      key,
    });

    if (!user) throw new UnauthorizedException();

    return user.user;
  }
}
