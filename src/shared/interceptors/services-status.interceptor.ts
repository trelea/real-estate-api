import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

type ResponseType = {
  data: {
    status: string;
  }[];
};

@Injectable()
export class ServicesStatusInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ResponseType>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const { cookies } = context.switchToHttp().getRequest() as Request;

    return next
      .handle()
      .pipe(
        map((res) =>
          cookies[
            this.configService?.getOrThrow<string>('JWT_ACCESS_COOKIE_NAME')
          ]
            ? res
            : {
                data: res.data.filter((service) => service.status === 'PUBLIC'),
              },
        ),
      );
  }
}
