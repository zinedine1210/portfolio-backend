import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProjectSkill } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkDeleteProjectSkillDto, CreateProjectSkillDto } from './dto/zod.schema';
import { PaginationDto } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { buildQueryOptions } from '../common/utils/query-builder.util';

@Injectable()
export class ProjectSkillsService {
    private readonly name: string = 'project-skills';
    private dbTable = new PrismaService().projectSkill;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.projectSkill;
    }

    async getAll(payload: { query: PaginationDto, projectId: string }): Promise<ApiResponseWithPagination<ProjectSkill[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);

        const [data, total] = await Promise.all([
            this.dbTable.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: {
                    ...filters,
                    projectId: payload.projectId
                },
                include: {
                    skill: true
                }
            }),
            this.dbTable.count({
                where: {
                    ...filters,
                    projectId: payload.projectId
                }
            }),
        ]);

        this.logger.logInfo(`Fetching all ${this.name} for project ID: ${payload.projectId}, total: ${total}`);
        return {
            ...meta,
            total,
            data,
        };
    }

    async getById(payload: { skillId: string, projectId: string }): Promise<ProjectSkill | null> {
        const { skillId, projectId } = payload;
        const projectSkill = await this.dbTable.findUnique({
            where: {
                projectId_skillId: {
                    projectId,
                    skillId
                }
            },
            include: {
                skill: true
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with Skill ID: ${skillId}`);
        return projectSkill;
    }

    async create(payload: { projectId: string, data: CreateProjectSkillDto }): Promise<ProjectSkill> {
        const { projectId, data } = payload;
        const projectSkill = await this.dbTable.create({
            data: {
                projectId,
                ...data
            },
            include: {
                skill: true
            }
        });
        this.logger.logInfo(`Creating a new ${this.name} for project ID: ${projectId}`);
        return projectSkill;
    }

    async delete(payload: { skillId: string, projectId: string }): Promise<ProjectSkill> {
        const { skillId, projectId } = payload;
        const projectSkill = await this.dbTable.delete({
            where: {
                projectId_skillId: {
                    projectId,
                    skillId
                }
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with Skill ID: ${skillId}`);
        return projectSkill;
    }

    async deleteBulk(payload: { data: BulkDeleteProjectSkillDto, projectId: string }): Promise<number> {
        const { data, projectId } = payload;
        const results = await this.dbTable.deleteMany({
            where: {
                skillId: { in: data.ids },
                projectId
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with Skill IDs: ${data.ids}`);
        return results.count || 0;
    }
} 