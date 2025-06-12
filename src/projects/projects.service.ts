import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Project } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkDeleteProjectDto, CreateProjectDto, UpdateProjectDto } from './dto/zod.schema';
import { PaginationDto } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { buildQueryOptions } from '../common/utils/query-builder.util';

@Injectable()
export class ProjectsService {
    private readonly name: string = 'projects';
    private dbTable = new PrismaService().project;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.project;
    }

    async getAll(payload: { query: PaginationDto, profileId: string }): Promise<ApiResponseWithPagination<Project[]>> {
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
                    skills: {
                        include: {
                            skill: true
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

    async getById(payload: { id: string, profileId: string }): Promise<Project | null> {
        const { id, profileId } = payload;
        const project = await this.dbTable.findUnique({
            where: { 
                id,
                profileId
            },
            include: {
                skills: {
                    include: {
                        skill: true
                    }
                }
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with ID: ${id}`);
        return project;
    }

    async getBySlug(slug: string): Promise<Project | null> {
        const project = await this.dbTable.findUnique({
            where: { slug },
            include: {
                skills: {
                    include: {
                        skill: true
                    }
                }
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with slug: ${slug}`);
        return project;
    }

    async create(payload: { profileId: string, data: CreateProjectDto }): Promise<Project> {
        const { profileId, data } = payload;
        const project = await this.dbTable.create({
            data: {
                ...data,
                profileId
            },
            include: {
                skills: {
                    include: {
                        skill: true
                    }
                }
            }
        });
        this.logger.logInfo(`Creating a new ${this.name} for profile ID: ${profileId}`);
        return project;
    }

    async update(payload: { id: string, profileId: string, data: UpdateProjectDto }): Promise<Project> {
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
        const project = await this.dbTable.update({
            where: { id },
            data,
            include: {
                skills: {
                    include: {
                        skill: true
                    }
                }
            }
        });
        this.logger.logInfo(`Updating ${this.name} with ID: ${id}`);
        return project;
    }

    async delete(payload: { id: string, profileId: string }): Promise<Project> {
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
        const project = await this.dbTable.delete({
            where: { id }
        });
        this.logger.logInfo(`Deleting ${this.name} with ID: ${id}`);
        return project;
    }

    async deleteBulk(payload: { data: BulkDeleteProjectDto, profileId: string }): Promise<number> {
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
