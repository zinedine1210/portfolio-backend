// src/logger/logger.module.ts
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports, createLogger, format } from 'winston';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    WinstonModule.forRoot({
      instance: createLogger({
        level: 'info', // Tentukan level log (info, debug, error, etc.)
        format: format.combine(
          format.timestamp(),
          format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}] : ${message}`;
          })
        ),
        transports: [
          new transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          }),
          new transports.File({ filename: 'application.log' })
        ],
      }),
    }),
  ],
  providers: [LoggerService],
  exports: [WinstonModule],
})
export class LoggerModule {}
