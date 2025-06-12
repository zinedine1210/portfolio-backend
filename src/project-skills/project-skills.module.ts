import { Module } from '@nestjs/common';
import { ProjectSkillsController } from './project-skills.controller';
import { ProjectSkillsService } from './project-skills.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ApiResponseMessage } from '../common/utils/message.response';
import { ProfileService } from '../profile/profile.service';

@Module({
  controllers: [ProjectSkillsController],
  providers: [
    ProjectSkillsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage,
    ProfileService
  ]
})
export class ProjectSkillsModule {} 