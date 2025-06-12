import { Injectable, UnauthorizedException } from '@nestjs/common';
import { File } from '@prisma/client';
import { LoggerService } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BulkDeleteDto, CreateFileDto, UpdateFileDto } from './dto/zod.schema';
import { PaginationDto } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';
import { buildQueryOptions } from 'src/common/utils/query-builder.util';

@Injectable()
export class FilesService {
    private readonly name: string = 'files';
    private dbTable = new PrismaService().file;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.file;
    }

    async getAll(payload: { query: PaginationDto, profileId: string }): Promise<ApiResponseWithPagination<File[]>> {
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

    async getById(payload: { id: string, profileId: string }): Promise<File | null> {
        const { id, profileId } = payload;
        const file = await this.dbTable.findFirst({
            where: { id, profileId }
        });
        this.logger.logInfo(`Fetching ${this.name} with ID: ${id}`);
        return file;
    }

    async create(data: CreateFileDto): Promise<File> {
        const file = await this.dbTable.create({
            data
        });
        this.logger.logInfo(`Creating a new ${this.name}`);
        return file;
    }

    async update(payload: { id: string, profileId: string, data: UpdateFileDto }): Promise<File> {
        const { id, profileId, data } = payload;
        const yoursData = await this.dbTable.findFirst({
            where: { id, profileId }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to update this record`);
        }
        const file = await this.dbTable.update({
            where: { id },
            data
        });
        this.logger.logInfo(`Updating ${this.name} with ID: ${id}`);
        return file;
    }

    async deleteById(payload: { id: string, profileId: string }): Promise<File> {
        const { id, profileId } = payload;
        const yoursData = await this.dbTable.findFirst({
            where: { id, profileId }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to delete this record`);
        }
        const file = await this.dbTable.delete({
            where: { id }
        });
        this.logger.logInfo(`Deleting ${this.name} with ID: ${id}`);
        return file;
    }

    async deleteBulk(payload: { data: BulkDeleteDto, profileId: string }): Promise<number> {
        const { data, profileId } = payload;
        const files = await this.dbTable.deleteMany({
            where: {
                id: { in: data.ids },
                profileId
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with IDs: ${data.ids}`);
        return files.count || 0;
    }
} 