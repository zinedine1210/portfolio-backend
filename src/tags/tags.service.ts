import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkDeleteTagDto, CreateTagDto, UpdateTagDto } from './dto/zod.schema';
import { PaginationDto } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { buildQueryOptions } from '../common/utils/query-builder.util';

@Injectable()
export class TagsService {
    private readonly name: string = 'tags';
    private dbTable = new PrismaService().tag;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.tag;
    }

    async getAll(payload: { query: PaginationDto }): Promise<ApiResponseWithPagination<Tag[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);

        const [data, total] = await Promise.all([
            this.dbTable.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: filters,
                include: {
                    blogPosts: true
                }
            }),
            this.dbTable.count({
                where: filters
            }),
        ]);

        this.logger.logInfo(`Fetching all ${this.name}, total: ${total}`);
        return {
            ...meta,
            total,
            data,
        };
    }

    async getById(id: string): Promise<Tag | null> {
        const tag = await this.dbTable.findUnique({
            where: { id },
            include: {
                blogPosts: true
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with ID: ${id}`);
        return tag;
    }

    async create(data: CreateTagDto): Promise<Tag> {
        const tag = await this.dbTable.create({
            data,
            include: {
                blogPosts: true
            }
        });
        this.logger.logInfo(`Creating a new ${this.name}`);
        return tag;
    }

    async update(id: string, data: UpdateTagDto): Promise<Tag> {
        const tag = await this.dbTable.update({
            where: { id },
            data,
            include: {
                blogPosts: true
            }
        });
        this.logger.logInfo(`Updating ${this.name} with ID: ${id}`);
        return tag;
    }

    async delete(id: string): Promise<Tag> {
        const tag = await this.dbTable.delete({
            where: { id }
        });
        this.logger.logInfo(`Deleting ${this.name} with ID: ${id}`);
        return tag;
    }

    async deleteBulk(data: BulkDeleteTagDto): Promise<number> {
        const results = await this.dbTable.deleteMany({
            where: {
                id: { in: data.ids }
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with IDs: ${data.ids}`);
        return results.count || 0;
    }
} 