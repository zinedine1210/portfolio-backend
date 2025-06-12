import { Body, Controller, Get, Post, Req, UsePipes, Param, UseGuards, Patch, Delete, RequestMethod, UnauthorizedException } from '@nestjs/common';
import { BulkDeleteDto, BulkDeleteSchema, CreateFileDto, CreateFileSchema, UpdateFileDto, UpdateFileSchema } from './dto/zod.schema';
import { FilesService } from './files.service';
import { File, Role } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { PaginationDto, PaginationSchema } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { ApiResponseMessage } from 'src/common/utils/message.response';
import { User } from 'src/common/decorators/user/user.decorator';
import { UserResponse } from 'src/common/decorators/user/user.response';

@Controller('/api/files')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class FilesController {
    constructor(
        private fileService: FilesService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateFileSchema))
    async createFile(
        @Body() body: CreateFileDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<File> {
        const result = await this.fileService.create(body);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS');
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getFiles(
        @Body() body: PaginationDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<File[]>> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const result = await this.fileService.getAll({
            query: body,
            profileId: user.profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', result.total);
        if (result.total === 0) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 0);
        }
        return result;
    }

    @Get(':id')
    async getFileById(
        @Req() req: Request | any,
        @Param('id') id: string,
        @User() user: UserResponse
    ): Promise<File | null> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const result = await this.fileService.getById({
            id,
            profileId: user.profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(UpdateFileSchema))
    async updateFile(
        @Param('id') id: string,
        @Body() body: UpdateFileDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<File | null> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const updated = await this.fileService.update({
            id,
            profileId: user.profile.id,
            data: body
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.PATCH, 'SUCCESS');
        return updated;
    }

    @Delete(':id')
    async deleteFile(
        @Param('id') id: string,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<File | null> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const deleted = await this.fileService.deleteById({
            id,
            profileId: user.profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return deleted;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteSchema))
    async deleteBulk(
        @User() user: UserResponse,
        @Req() req: any,
        @Body() body: BulkDeleteDto
    ): Promise<number> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const deletedBulk = await this.fileService.deleteBulk({
            data: body,
            profileId: user.profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return deletedBulk;
    }
} 