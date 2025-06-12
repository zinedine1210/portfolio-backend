import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ProfileSkillsService } from './profile-skills.service';
import { BulkDeleteProfileSkillDto, BulkDeleteProfileSkillSchema, CreateProfileSkillDto, CreateProfileSkillSchema, UpdateProfileSkillDto, UpdateProfileSkillSchema } from './dto/zod.schema';
import { User } from '../common/decorators/user/user.decorator';
import { UserResponse } from '../common/decorators/user/user.response';
import { ProfileSkill, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { RequestMethod } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';

@Controller('/api/profile-skills')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class ProfileSkillsController {
    constructor(
        private profileSkillsService: ProfileSkillsService,
        private profileService: ProfileService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateProfileSkillSchema))
    async create(
        @Body() body: CreateProfileSkillDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ProfileSkill> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.profileSkillsService.create({ 
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
    ): Promise<ApiResponseWithPagination<ProfileSkill[]>> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.profileSkillsService.getAll({
            query: body,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', result.total);
        if (result.total === 0) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 0);
        }
        return result;
    }

    @Get(':skillId')
    async getById(
        @Param('skillId') skillId: string,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ProfileSkill | null> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.profileSkillsService.getById({
            skillId,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Patch(':skillId')
    @UsePipes(new ZodValidationPipe(UpdateProfileSkillSchema))
    async update(
        @Param('skillId') skillId: string,
        @Body() body: UpdateProfileSkillDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ProfileSkill> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.profileSkillsService.update({
            skillId,
            profileId: profile.id,
            data: body
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.PATCH, 'SUCCESS');
        return result;
    }

    @Delete(':skillId')
    async delete(
        @Param('skillId') skillId: string,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ProfileSkill> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.profileSkillsService.delete({
            skillId,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteProfileSkillSchema))
    async deleteBulk(
        @Body() body: BulkDeleteProfileSkillDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<number> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.profileSkillsService.deleteBulk({
            data: body,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }
} 