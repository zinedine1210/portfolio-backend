import { Module } from '@nestjs/common';
import { ProfileSkillsController } from './profile-skills.controller';
import { ProfileSkillsService } from './profile-skills.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ApiResponseMessage } from '../common/utils/message.response';
import { ProfileService } from '../profile/profile.service';

@Module({
  controllers: [ProfileSkillsController],
  providers: [
    ProfileSkillsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage,
    ProfileService
  ]
})
export class ProfileSkillsModule {} 