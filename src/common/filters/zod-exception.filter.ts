import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
  
@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const formattedErrors = exception.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'Validation failed',
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      data: formattedErrors,
    });
  }
}
  