import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BlogPostTag } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkDeleteBlogPostTagDto, CreateBlogPostTagDto } from './dto/zod.schema';
import { PaginationDto } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { buildQueryOptions } from '../common/utils/query-builder.util';

@Injectable()
export class BlogPostTagsService {
    private readonly name: string = 'blog-post-tags';
    private dbTable = new PrismaService().blogPostTag;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.blogPostTag;
    }

    async getAll(payload: { query: PaginationDto, postId: string }): Promise<ApiResponseWithPagination<BlogPostTag[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);

        const [data, total] = await Promise.all([
            this.dbTable.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: {
                    ...filters,
                    postId: payload.postId
                },
                include: {
                    tag: true
                }
            }),
            this.dbTable.count({
                where: {
                    ...filters,
                    postId: payload.postId
                }
            }),
        ]);

        this.logger.logInfo(`Fetching all ${this.name} for post ID: ${payload.postId}, total: ${total}`);
        return {
            ...meta,
            total,
            data,
        };
    }

    async getById(payload: { tagId: string, postId: string }): Promise<BlogPostTag | null> {
        const { tagId, postId } = payload;
        const blogPostTag = await this.dbTable.findUnique({
            where: {
                postId_tagId: {
                    postId,
                    tagId
                }
            },
            include: {
                tag: true
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with Tag ID: ${tagId}`);
        return blogPostTag;
    }

    async create(payload: { postId: string, data: CreateBlogPostTagDto }): Promise<BlogPostTag> {
        const { postId, data } = payload;
        const blogPostTag = await this.dbTable.create({
            data: {
                postId,
                ...data
            },
            include: {
                tag: true
            }
        });
        this.logger.logInfo(`Creating a new ${this.name} for post ID: ${postId}`);
        return blogPostTag;
    }

    async delete(payload: { tagId: string, postId: string }): Promise<BlogPostTag> {
        const { tagId, postId } = payload;
        const blogPostTag = await this.dbTable.delete({
            where: {
                postId_tagId: {
                    postId,
                    tagId
                }
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with Tag ID: ${tagId}`);
        return blogPostTag;
    }

    async deleteBulk(payload: { data: BulkDeleteBlogPostTagDto, postId: string }): Promise<number> {
        const { data, postId } = payload;
        const results = await this.dbTable.deleteMany({
            where: {
                tagId: { in: data.ids },
                postId
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with Tag IDs: ${data.ids}`);
        return results.count || 0;
    }
} 