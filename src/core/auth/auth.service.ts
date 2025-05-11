import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users';
import { CryptoService } from 'src/crypto';
import { Request, Response } from 'express';
import { User } from 'src/database/entities';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis';
import { CACHE_NAMESPACE } from 'src/redis/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  // async signup(user: SignupDto, thumbnail?: Express.Multer.File) {
  //   const _user = await this.usersService.findUserBy({ email: user.email });
  //   if (_user) throw new ConflictException('Resources Already Exists');
  //   try {
  //     return await this.usersService.createUser(user, thumbnail);
  //   } catch (err) {
  //     throw new InternalServerErrorException(err.message);
  //   }
  // }

  async signin(req: Request, res: Response) {
    try {
      /**
       * generate tokens
       */
      const accessToken = this.signJwtToken(req.user?.id as string, 'ACCESS');
      const refreshToken = this.signJwtToken(req.user?.id as string, 'REFRESH');

      /**
       * Set-Cookie: Access Token
       */
      res.cookie(
        this.configService.getOrThrow<string>('JWT_ACCESS_COOKIE_NAME'),
        accessToken,
        {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'prod',
          maxAge:
            60 *
            1000 *
            parseInt(
              this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
            ),
        },
      );
      /**
       * Set-Cookie: Refresh Token
       */
      res.cookie(
        this.configService.getOrThrow<string>('JWT_REFRESH_COOKIE_NAME'),
        refreshToken,
        {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'prod',
          maxAge:
            60 *
            1000 *
            parseInt(
              this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
            ),
        },
      );

      /**
       * setup cache
       */
      await this.redisService.set({
        ns: CACHE_NAMESPACE.ATKNS,
        key: req.user?.id as string,
        val: { accessToken, user: req.user },
        ttl:
          60 *
          1000 *
          parseInt(
            this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
          ),
      });
      await this.redisService.set({
        ns: CACHE_NAMESPACE.RTKNS,
        key: req.user?.id as string,
        val: { refreshToken, user: req.user },
        ttl:
          60 *
          1000 *
          parseInt(
            this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION'),
          ),
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async signout(req: Request, res: Response) {
    await this.redisService.del({
      ns: CACHE_NAMESPACE.ATKNS,
      key: req.user?.id as string,
    });
    await this.redisService.del({
      ns: CACHE_NAMESPACE.RTKNS,
      key: req.user?.id as string,
    });
    res.clearCookie(
      this.configService.getOrThrow<string>('JWT_ACCESS_COOKIE_NAME'),
    );
    res.clearCookie(
      this.configService.getOrThrow<string>('JWT_REFRESH_COOKIE_NAME'),
    );
    return;
  }

  async refresh(req: Request, res: Response) {
    if (
      req.cookies[
        this.configService.getOrThrow<string>('JWT_ACCESS_COOKIE_NAME')
      ]
    ) {
      try {
        this.jwtService.verify(
          req.cookies[
            this.configService.getOrThrow<string>('JWT_ACCESS_COOKIE_NAME')
          ],
          {
            secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
          },
        );
        return;
      } catch (err) {
        throw new UnauthorizedException();
      }
    }

    /**
     * generate new access token
     */
    const accessToken = this.signJwtToken(req.user?.id as string, 'ACCESS');
    /**
     * Set-Cookie: Access Token
     */
    res.cookie(
      this.configService.getOrThrow<string>('JWT_ACCESS_COOKIE_NAME'),
      accessToken,
      {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'prod',
        maxAge:
          60 *
          1000 *
          parseInt(
            this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
          ),
      },
    );
    /**
     * setup cache
     */
    await this.redisService.set({
      ns: CACHE_NAMESPACE.ATKNS,
      key: req.user?.id as string,
      val: { accessToken, user: req.user },
      ttl:
        60 *
        1000 *
        parseInt(
          this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION'),
        ),
    });
    return;
  }

  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const _user = await this.usersService.findUserBy({ email });

    if (!_user || !(await this.cryptoService.verify(_user.password, password)))
      throw new UnauthorizedException('Invalid Credentials');

    const { password: _password, ...user } = _user;
    return user;
  }

  async status(req: Request): Promise<{ user: User } | null> {
    // await new Promise((res) => setTimeout(res, 1000));
    return await this.redisService.get<{ user: User }>({
      ns: CACHE_NAMESPACE.ATKNS,
      key: req.user?.id as string,
    });
  }

  /**
   * utils functions
   */
  signJwtToken<T = unknown>(data: T, type: 'REFRESH' | 'ACCESS') {
    return this.jwtService.sign(
      { data },
      {
        secret: this.configService.getOrThrow<string>(`JWT_${type}_SECRET`),
        expiresIn:
          60 *
          parseInt(
            this.configService.getOrThrow<string>(`JWT_${type}_EXPIRATION`),
          ),
      },
    );
  }
}
