import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ApiResponseMessage } from '../common/utils/message.response';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  controllers: [SkillsController],
  providers: [
    SkillsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage,
    ProfileService
  ],
  exports: [SkillsService]
})
export class SkillsModule {}
