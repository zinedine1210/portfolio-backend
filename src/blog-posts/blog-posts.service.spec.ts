import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsService } from './blog-posts.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';

describe('BlogPostsService', () => {
  let service: BlogPostsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogPostsService,
        PrismaService,
        LoggerService
      ],
    }).compile();

    service = module.get<BlogPostsService>(BlogPostsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });
}); 