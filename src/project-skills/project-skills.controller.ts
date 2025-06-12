import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ProjectSkillsService } from './project-skills.service';
import { BulkDeleteProjectSkillDto, BulkDeleteProjectSkillSchema, CreateProjectSkillDto, CreateProjectSkillSchema } from './dto/zod.schema';
import { User } from '../common/decorators/user/user.decorator';
import { UserResponse } from '../common/decorators/user/user.response';
import { ProjectSkill, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { RequestMethod } from '@nestjs/common';

@Controller('/api/projects/:projectId/skills')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class ProjectSkillsController {
    constructor(
        private projectSkillsService: ProjectSkillsService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateProjectSkillSchema))
    async create(
        @Param('projectId') projectId: string,
        @Body() body: CreateProjectSkillDto,
        @Req() req: any
    ): Promise<ProjectSkill> {
        const result = await this.projectSkillsService.create({ 
            projectId, 
            data: body 
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS');
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getAll(
        @Param('projectId') projectId: string,
        @Body() body: PaginationDto,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<ProjectSkill[]>> {
        const result = await this.projectSkillsService.getAll({
            query: body,
            projectId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', result.total);
        if (result.total === 0) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 0);
        }
        return result;
    }

    @Get(':skillId')
    async getById(
        @Param('projectId') projectId: string,
        @Param('skillId') skillId: string,
        @Req() req: any
    ): Promise<ProjectSkill | null> {
        const result = await this.projectSkillsService.getById({
            skillId,
            projectId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Delete(':skillId')
    async delete(
        @Param('projectId') projectId: string,
        @Param('skillId') skillId: string,
        @Req() req: any
    ): Promise<ProjectSkill> {
        const result = await this.projectSkillsService.delete({
            skillId,
            projectId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteProjectSkillSchema))
    async deleteBulk(
        @Param('projectId') projectId: string,
        @Body() body: BulkDeleteProjectSkillDto,
        @Req() req: any
    ): Promise<number> {
        const result = await this.projectSkillsService.deleteBulk({
            data: body,
            projectId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }
} 