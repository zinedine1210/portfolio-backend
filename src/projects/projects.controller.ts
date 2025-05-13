import { Body, Controller, Get, ParseIntPipe, Post, Req, UsePipes, Param, UseGuards, Patch } from '@nestjs/common';
import { CreateProjectDto, CreateProjectSchema, UpdateProjectDto, UpdateProjectSchema } from './dto/zod.schema';
import { ProjectsService } from './projects.service';
import { User } from 'src/common/decorators/user/user.decorator';
import { UserResponse } from 'src/common/decorators/user/user.response';
import { Project, Role } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { PaginationDto, PaginationSchema } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';

@Controller('/api/projects')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class ProjectsController {
    constructor(
        private projectService: ProjectsService
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateProjectSchema))
    async postProject(
        @Body() body: CreateProjectDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Project> {
        const result = await this.projectService.createProject({ userId: user.id, data: body });
        req.customMessage = 'Project created successfully';
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getProjects(
        @Body() body: PaginationDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<Project[]>> {
        const result = await this.projectService.getAllProjects(
            { userId: user.id, query: body }
        );
        req.customMessage = `Found ${result.total} records`;
        if (result.total === 0) {
            req.customMessage = '0 records found';
        }
        return result;
    }

    @Get(':id')
    async getProjectById(
        @Req() req: Request | any,
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserResponse
    ): Promise<Project | null> {
        const result = await this.projectService.getProjectById({
            id,
            userId: user.id
        });
        req.customMessage = 'Found 1 record';
        if (!result) {
            req.customMessage = '0 records found';
            return null;
        }
        return result;
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(UpdateProjectSchema))
    async updateProject(
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserResponse,
        @Body() body: UpdateProjectDto,
        @Req() req: any
    ): Promise<Project | null> {
        const updated = await this.projectService.updateProject({
            data: body,
            id: id,
            userId: user.id,
        });
        req.customMessage = 'Project updated successfully';
        return updated;
    }

}
