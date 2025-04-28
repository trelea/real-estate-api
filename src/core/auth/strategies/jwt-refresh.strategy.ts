import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/core/users';
import { User } from 'src/database/entities';
import { RedisService } from 'src/redis';
import { CACHE_NAMESPACE } from 'src/redis/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req.cookies[
            configService.getOrThrow<string>('JWT_REFRESH_COOKIE_NAME')
          ],
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ data: key }: { data: string }) {
    const cached_user = await this.redisService.get<{ user: User }>({
      ns: CACHE_NAMESPACE.RTKNS,
      key,
    });
    /**
     * bonus check
     */
    const user = await this.usersService.findUserBy({ id: key });

    if (!user || !cached_user) throw new UnauthorizedException();
    return user;
  }
}
