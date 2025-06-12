import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { TagsService } from './tags.service';
import { BulkDeleteTagDto, BulkDeleteTagSchema, CreateTagDto, CreateTagSchema, UpdateTagDto, UpdateTagSchema } from './dto/zod.schema';
import { User } from '../common/decorators/user/user.decorator';
import { UserResponse } from '../common/decorators/user/user.response';
import { Tag, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { RequestMethod } from '@nestjs/common';

@Controller('/api/tags')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class TagsController {
    constructor(
        private tagsService: TagsService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateTagSchema))
    async create(
        @Body() body: CreateTagDto,
        @Req() req: any
    ): Promise<Tag> {
        const result = await this.tagsService.create(body);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS');
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getAll(
        @Body() body: PaginationDto,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<Tag[]>> {
        const result = await this.tagsService.getAll({ query: body });
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
    ): Promise<Tag | null> {
        const result = await this.tagsService.getById(id);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(UpdateTagSchema))
    async update(
        @Param('id') id: string,
        @Body() body: UpdateTagDto,
        @Req() req: any
    ): Promise<Tag> {
        const result = await this.tagsService.update(id, body);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.PATCH, 'SUCCESS');
        return result;
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Req() req: any
    ): Promise<Tag> {
        const result = await this.tagsService.delete(id);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteTagSchema))
    async deleteBulk(
        @Body() body: BulkDeleteTagDto,
        @Req() req: any
    ): Promise<number> {
        const result = await this.tagsService.deleteBulk(body);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }
} 