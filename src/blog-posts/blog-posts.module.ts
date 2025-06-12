import { Module } from '@nestjs/common';
import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { ApiResponseMessage } from '../common/utils/message.response';
import { ProfileService } from '../profile/profile.service';

@Module({
  controllers: [BlogPostsController],
  providers: [
    BlogPostsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage,
    ProfileService
  ],
  exports: [BlogPostsService]
})
export class BlogPostsModule {} 