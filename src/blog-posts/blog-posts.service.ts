import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BlogPost } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkDeleteBlogPostDto, CreateBlogPostDto, UpdateBlogPostDto } from './dto/zod.schema';
import { PaginationDto } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { buildQueryOptions } from '../common/utils/query-builder.util';

@Injectable()
export class BlogPostsService {
    private readonly name: string = 'blog-posts';
    private dbTable = new PrismaService().blogPost;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.blogPost;
    }

    async getAll(payload: { query: PaginationDto, profileId: string }): Promise<ApiResponseWithPagination<BlogPost[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);

        const [data, total] = await Promise.all([
            this.dbTable.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: {
                    ...filters,
                    profileId: payload.profileId
                },
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            }),
            this.dbTable.count({
                where: {
                    ...filters,
                    profileId: payload.profileId
                }
            }),
        ]);

        this.logger.logInfo(`Fetching all ${this.name} for profile ID: ${payload.profileId}, total: ${total}`);
        return {
            ...meta,
            total,
            data,
        };
    }

    async getById(payload: { id: string, profileId: string }): Promise<BlogPost | null> {
        const { id, profileId } = payload;
        const blogPost = await this.dbTable.findUnique({
            where: { 
                id,
                profileId
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with ID: ${id}`);
        return blogPost;
    }

    async getBySlug(slug: string): Promise<BlogPost | null> {
        const blogPost = await this.dbTable.findUnique({
            where: { slug },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with slug: ${slug}`);
        return blogPost;
    }

    async create(payload: { profileId: string, data: CreateBlogPostDto }): Promise<BlogPost> {
        const { profileId, data: { tags, ...restData } } = payload;
        const blogPost = await this.dbTable.create({
            data: {
                ...restData,
                profileId,
                tags: tags ? {
                    create: tags.map(tagId => ({
                        tagId
                    }))
                } : undefined
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
        this.logger.logInfo(`Creating a new ${this.name} for profile ID: ${profileId}`);
        return blogPost;
    }

    async update(payload: { id: string, profileId: string, data: UpdateBlogPostDto }): Promise<BlogPost> {
        const { id, profileId, data } = payload;
        const yoursData = await this.dbTable.findUnique({
            where: { 
                id,
                profileId
            }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to update this record`);
        }
        const blogPost = await this.dbTable.update({
            where: { id },
            data,
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
        this.logger.logInfo(`Updating ${this.name} with ID: ${id}`);
        return blogPost;
    }

    async delete(payload: { id: string, profileId: string }): Promise<BlogPost> {
        const { id, profileId } = payload;
        const yoursData = await this.dbTable.findUnique({
            where: { 
                id,
                profileId
            }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to delete this record`);
        }
        const blogPost = await this.dbTable.delete({
            where: { id }
        });
        this.logger.logInfo(`Deleting ${this.name} with ID: ${id}`);
        return blogPost;
    }

    async deleteBulk(payload: { data: BulkDeleteBlogPostDto, profileId: string }): Promise<number> {
        const { data, profileId } = payload;
        const results = await this.dbTable.deleteMany({
            where: {
                id: { in: data.ids },
                profileId
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with IDs: ${data.ids}`);
        return results.count || 0;
    }
} 