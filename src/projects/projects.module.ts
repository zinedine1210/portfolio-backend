import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ApiResponseMessage } from '../common/utils/message.response';
import { ProfileService } from '../profile/profile.service';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage,
    ProfileService
  ],
  exports: [ProjectsService]
})
export class ProjectsModule {}
