import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { BulkDeleteProjectDto, BulkDeleteProjectSchema, CreateProjectDto, CreateProjectSchema, UpdateProjectDto, UpdateProjectSchema } from './dto/zod.schema';
import { User } from '../common/decorators/user/user.decorator';
import { UserResponse } from '../common/decorators/user/user.response';
import { Project, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { RequestMethod } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';

@Controller('/api/projects')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class ProjectsController {
    constructor(
        private projectsService: ProjectsService,
        private profileService: ProfileService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateProjectSchema))
    async create(
        @Body() body: CreateProjectDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Project> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.projectsService.create({ 
            profileId: profile.id, 
            data: body 
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS');
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getAll(
        @Body() body: PaginationDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<Project[]>> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.projectsService.getAll({
            query: body,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', result.total);
        if (result.total === 0) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 0);
        }
        return result;
    }

    @Get(':id')
    async getById(
        @Param('id') id: string,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Project | null> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.projectsService.getById({
            id,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Get('slug/:slug')
    async getBySlug(
        @Param('slug') slug: string,
        @Req() req: any
    ): Promise<Project | null> {
        const result = await this.projectsService.getBySlug(slug);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(UpdateProjectSchema))
    async update(
        @Param('id') id: string,
        @Body() body: UpdateProjectDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Project> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.projectsService.update({
            id,
            profileId: profile.id,
            data: body
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.PATCH, 'SUCCESS');
        return result;
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Project> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.projectsService.delete({
            id,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteProjectSchema))
    async deleteBulk(
        @Body() body: BulkDeleteProjectDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<number> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.projectsService.deleteBulk({
            data: body,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }
}