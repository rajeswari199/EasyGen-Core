import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { SUCCESS } from '@messages/successMessages';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<any, Response<any>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    return next.handle().pipe(
      map((response) => {
        const {
          data = {},
          message = SUCCESS.RESPONSE,
          statusCode = 200,
        } = response;
        return { data, message, statusCode };
      }),
    );
  }
}
