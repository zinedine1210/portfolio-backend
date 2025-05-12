// src/logger.service.ts
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        // Transport untuk menulis ke konsol
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),  // Warnakan log di konsol
            winston.format.simple()     // Format log yang sederhana
          ),
        }),
        // Transport untuk menulis ke file
        new winston.transports.File({
          filename: 'application.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ],
    });
  }

  logInfo(message: any) {
    this.logger.info(message);
  }

  logError(message: any) {
    this.logger.error(message);
  }
  logWarning(message: any) {
    this.logger.warn(message);
  }
  logDebug(message: any) {
    this.logger.debug(message);
  }
  logSilly(message: any) {
    this.logger.silly(message);
  }
}
