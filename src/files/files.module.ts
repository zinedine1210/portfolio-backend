import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ApiResponseMessage } from 'src/common/utils/message.response';

@Module({
  controllers: [FilesController],
  providers: [
    FilesService,
    PrismaService,
    LoggerService,
    ApiResponseMessage
  ]
})
export class FilesModule {} 