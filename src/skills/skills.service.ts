import { ConflictException, Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkDeleteSkillDto, CreateSkillDto, UpdateSkillDto } from './dto/zod.schema';
import { PaginationDto } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { buildQueryOptions } from '../common/utils/query-builder.util';

@Injectable()
export class SkillsService {
    private readonly name: string = 'skills';
    private dbTable = new PrismaService().skill;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.skill;
    }

    async getAll(payload: { query: PaginationDto }): Promise<ApiResponseWithPagination<Skill[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);

        const [data, total] = await Promise.all([
            this.dbTable.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: filters,
                include: {
                    profiles: true,
                    projects: true
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

    async getById(id: string): Promise<Skill | null> {
        const skill = await this.dbTable.findUnique({
            where: { id },
            include: {
                profiles: true,
                projects: true
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with ID: ${id}`);
        return skill;
    }

    async create(data: CreateSkillDto): Promise<any> {
        const existing = await this.dbTable.findUnique({
            where: {
                name: data.name
            }
        })
        if(existing) throw new ConflictException({message: 'Already in table, please try another name', error: null });
        const skill = await this.dbTable.create({
            data
        });
        this.logger.logInfo(`Creating a new ${this.name}`);
        return skill;
    }

    async update(id: string, data: UpdateSkillDto): Promise<Skill> {
        const skill = await this.dbTable.update({
            where: { id },
            data,
            include: {
                profiles: true,
                projects: true
            }
        });
        this.logger.logInfo(`Updating ${this.name} with ID: ${id}`);
        return skill;
    }

    async delete(id: string): Promise<Skill> {
        const skill = await this.dbTable.delete({
            where: { id }
        });
        this.logger.logInfo(`Deleting ${this.name} with ID: ${id}`);
        return skill;
    }

    async deleteBulk(data: BulkDeleteSkillDto): Promise<number> {
        const results = await this.dbTable.deleteMany({
            where: {
                id: { in: data.ids }
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with IDs: ${data.ids}`);
        return results.count || 0;
    }
}
