import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ApiResponseMessage } from '../common/utils/message.response';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    PrismaService,
    LoggerService,
    ApiResponseMessage
  ],
  exports: [ProfileService],
})
export class ProfileModule {} 