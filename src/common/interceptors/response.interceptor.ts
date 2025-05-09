import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { map } from 'rxjs/operators';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          const ctx = context.switchToHttp();
          const response = ctx.getResponse();
          const request = ctx.getRequest();
  
          return {
            success: true,
            statusCode: 200,
            timestamp: new Date(),
            message: request?.customMessage || 'Request successful',
            data,
          };
        }),
      );
    }
  }
  