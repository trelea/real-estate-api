import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_ROUTE } from 'src/shared/decorators';

@Injectable()
export class JwtAccessStrategyGuard extends AuthGuard('jwt-access') {
  constructor(private reflector: Reflector) {
    super();
  }

  private isPublic(context: ExecutionContext): boolean {
    return !!this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.isPublic(context)) {
      return (await super.canActivate(context)) as boolean;
    }

    /**
     * Public routes stay open to anonymous callers, but we still run the
     * strategy so an authenticated caller is identified on the request.
     * Handlers can then widen what they return for signed-in users
     * (e.g. letting admins read PRIVATE offerts) without exposing
     * anything to the public.
     */
    try {
      await super.canActivate(context);
    } catch {
      // no / invalid credentials on a public route: continue as anonymous
    }
    return true;
  }

  handleRequest<TUser>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    // never reject a public route just because credentials were absent
    if (this.isPublic(context)) return (user || null) as TUser;
    return super.handleRequest(err, user, info, context, status);
  }
}
