import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Project } from '@prisma/client';
import { LoggerService } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/zod.schema';
import { PaginationDto } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';
import { buildQueryOptions } from 'src/common/utils/query-builder.util';

@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) { }

    async getAllProjects(payload: { query: PaginationDto, userId: number }): Promise<ApiResponseWithPagination<Project[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);

        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: filters,
            }),
            this.prisma.project.count({ where: filters }),
        ]);

        this.logger.logInfo(`Fetching all projects for user Id: ${payload.userId} and total ${total}`);
        return {
            ...meta,
            total,
            data,
        };
    }


    async getProjectById(payload: { id: number, userId: number }): Promise<Project | null> {
        const { id, userId } = payload;
        this.logger.logInfo(`Fetching project with ID: ${id}`);
        const project = await this.prisma.project.findUnique({
            where: { id, userId }
        });
        return project;
    }

    async createProject(payload: { userId: number, data: CreateProjectDto }): Promise<Project> {
        const { userId, data } = payload;
        const project = await this.prisma.project.create({
            data: {
                ...data,
                userId
            }
        });
        this.logger.logInfo('Creating a new project for user Id: ' + userId);
        return project;
    }

    async updateProject(payload: { userId: number, id: number, data: UpdateProjectDto }): Promise<Project> {
        const { id, data, userId } = payload;
        const yoursData = await this.prisma.project.findUnique({
            where: { id, userId }
        })
        if(!yoursData) {
            throw new UnauthorizedException('Project is not yours');
        }
        this.logger.logInfo(`Updating project with ID: ${id}`);
        const project = await this.prisma.project.update({
            where: { id, userId },
            data
        });
        return project;
    }

    async deleteProject(payload: { id: number, userId: number }): Promise<Project> {
        const { id, userId } = payload;
        const yoursData = await this.prisma.project.findUnique({
            where: { id, userId }
        })
        if(!yoursData) {
            throw new UnauthorizedException('Project is not yours');
        }
        this.logger.logInfo(`Deleting project with ID: ${id}`);
        const project = await this.prisma.project.delete({
            where: { id, userId }
        });
        return project;
    }

}
