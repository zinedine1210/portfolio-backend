import { Module } from '@nestjs/common';
import { BlogPostTagsController } from './blog-post-tags.controller';
import { BlogPostTagsService } from './blog-post-tags.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ApiResponseMessage } from '../common/utils/message.response';
import { ProfileService } from '../profile/profile.service';

@Module({
  controllers: [BlogPostTagsController],
  providers: [
    BlogPostTagsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage,
    ProfileService
  ]
})
export class BlogPostTagsModule {} 