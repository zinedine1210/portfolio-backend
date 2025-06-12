import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ApiResponseMessage } from 'src/common/utils/message.response';

@Module({
  controllers: [ContactsController],
  providers: [
    ContactsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage
  ]
})
export class ContactsModule {} 