import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { BulkDeleteSkillDto, BulkDeleteSkillSchema, CreateSkillDto, CreateSkillSchema, UpdateSkillDto, UpdateSkillSchema } from './dto/zod.schema';
import { Skill, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { RequestMethod } from '@nestjs/common';
import { User } from 'src/common/decorators/user/user.decorator';
import { UserResponse } from 'src/common/decorators/user/user.response';
import { ProfileService } from 'src/profile/profile.service';

@Controller('/api/skills')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class SkillsController {
    constructor(
        private skillsService: SkillsService,
        private profileService: ProfileService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateSkillSchema))
    async create(
        @Body() body: CreateSkillDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Skill> {
        const result = await this.skillsService.create(body);
        console.log(result);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS');
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getAll(
        @Body() body: PaginationDto,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<Skill[]>> {
        const result = await this.skillsService.getAll({ query: body });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', result.total);
        if (result.total === 0) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 0);
        }
        return result;
    }

    @Get(':id')
    async getById(
        @Param('id') id: string,
        @Req() req: any
    ): Promise<Skill | null> {
        const result = await this.skillsService.getById(id);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(UpdateSkillSchema))
    async update(
        @Param('id') id: string,
        @Body() body: UpdateSkillDto,
        @Req() req: any
    ): Promise<Skill> {
        const result = await this.skillsService.update(id, body);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.PATCH, 'SUCCESS');
        return result;
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Req() req: any
    ): Promise<Skill> {
        const result = await this.skillsService.delete(id);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteSkillSchema))
    async deleteBulk(
        @Body() body: BulkDeleteSkillDto,
        @Req() req: any
    ): Promise<number> {
        const result = await this.skillsService.deleteBulk(body);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }
}
