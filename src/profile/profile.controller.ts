import { Body, Controller, Get, Post, Req, UsePipes, UseGuards, Delete, RequestMethod, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { BulkDeleteProfileDto, BulkDeleteProfileSchema, CreateProfileDto, CreateProfileSchema, UpdateProfileDto, UpdateProfileSchema } from './dto/zod.schema';
import { User } from '../common/decorators/user/user.decorator';
import { UserResponse } from '../common/decorators/user/user.response';
import { Profile, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';

@Controller('/api/profile')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateProfileSchema))
    async postProfile(
        @Body() body: CreateProfileDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Profile> {
        const result = await this.profileService.create({ userId: user.id, data: body });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS')
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getProfiles(
        @Body() body: PaginationDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<Profile[]>> {
        const result = await this.profileService.getAll(
            { userId: user.id, query: body }
        );
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', result.total);
        if (result.total === 0) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 0);
        }
        return result;
    }

    @Get(':id')
    async getProfileById(
        @Req() req: Request | any,
        @Param('id') id: string,
        @User() user: UserResponse
    ): Promise<Profile | null> {
        const result = await this.profileService.getById({
            id,
            userId: user.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 1);;
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(UpdateProfileSchema))
    async updateProfile(
        @Param('id') id: string,
        @User() user: UserResponse,
        @Body() body: UpdateProfileDto,
        @Req() req: any
    ): Promise<Profile | null> {
        const updated = await this.profileService.update({
            data: body,
            id: id,
            userId: user.id,
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.PATCH, 'SUCCESS');
        return updated;
    }

    @Delete(':id')
    async deleteProfile(
        @Param('id') id: string,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Profile | null> {
        const deleted = await this.profileService.deleteById({
            id: id,
            userId: user.id,
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');;
        return deleted;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteProfileSchema))
    async deleteBulk(
        @User() user: UserResponse,
        @Req() req: any,
        @Body() body: BulkDeleteProfileDto
    ): Promise<number>{
        const deletedBulk = await this.profileService.deleteBulk({
            data: body,
            userId: user.id,
        })
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return deletedBulk;
    }
} 