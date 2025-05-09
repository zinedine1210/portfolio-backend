import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class GlobalHttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
      let success: boolean = true;
      
      if (exception instanceof HttpException) {
        success = false
        status = exception.getStatus();
        const res = exception.getResponse();
        message = typeof res === 'string' ? res : (res as any).message;
      }
  
      response.status(status).json({
        statusCode: status,
        success,
        message,
        data: null,
      });
    }
  }
  