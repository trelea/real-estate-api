import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
// import { SignupDto } from './dtos';
import { AuthService } from './auth.service';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { ThumbnailValidationPipe } from 'src/shared/pipes';
import { Request, Response } from 'express';
import {
  JwtAccessStrategyGuard,
  JwtRefreshStrategyGuard,
  LocalStrategyGuard,
} from './guards';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
// import { SetRoles } from 'src/shared/decorators';
// import { UserRole } from 'src/database/entities';
// import { RolesGuard } from 'src/shared/guards';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // @SetRoles([UserRole.ADMIN])
  // @UseGuards(RolesGuard, JwtAccessStrategyGuard)
  // @UseInterceptors(FileInterceptor('thumbnail'))
  // async signup(
  //   @Body() user: SignupDto,
  //   @UploadedFile(ThumbnailValidationPipe) thumbnail?: Express.Multer.File,
  // ) {
  //   return await this.authService.signup(user, thumbnail);
  // }

  @Post('signin')
  @UseGuards(LocalStrategyGuard)
  async signin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.signin(req, res);
  }

  @Post('signout')
  @UseGuards(JwtAccessStrategyGuard)
  async signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signout(req, res);
  }

  @SkipThrottle()
  @Post('refresh')
  @UseGuards(JwtRefreshStrategyGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }

  @SkipThrottle()
  @Get('status')
  @UseGuards(JwtAccessStrategyGuard)
  async status(@Req() req: Request) {
    return (await this.authService.status(req))?.user;
  }

  /**
   * Testing roles guard
   */
  // @Get('admin')
  // @SetRoles([UserRole.USER])
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAccessStrategyGuard)
  // async admin() {
  //   return 'admin';
  // }

  // @Get('user')
  // @SetRoles([UserRole.ADMIN])
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAccessStrategyGuard)
  // async user() {
  //   return 'user';
  // }
}
