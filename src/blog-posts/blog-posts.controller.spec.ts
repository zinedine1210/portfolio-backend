import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ApiResponseMessage } from 'src/common/utils/message.response';

describe('BlogPostsController', () => {
  let controller: BlogPostsController;
  let service: BlogPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostsController],
      providers: [
        BlogPostsService,
        PrismaService,
        LoggerService,
        ApiResponseMessage
      ],
    }).compile();

    controller = module.get<BlogPostsController>(BlogPostsController);
    service = module.get<BlogPostsService>(BlogPostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
}); 