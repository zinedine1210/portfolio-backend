import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { BlogPostTagsService } from './blog-post-tags.service';
import { BulkDeleteBlogPostTagDto, BulkDeleteBlogPostTagSchema, CreateBlogPostTagDto, CreateBlogPostTagSchema } from './dto/zod.schema';
import { User } from '../common/decorators/user/user.decorator';
import { UserResponse } from '../common/decorators/user/user.response';
import { BlogPostTag, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { RequestMethod } from '@nestjs/common';

@Controller('/api/blog-posts/:postId/tags')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class BlogPostTagsController {
    constructor(
        private blogPostTagsService: BlogPostTagsService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateBlogPostTagSchema))
    async create(
        @Param('postId') postId: string,
        @Body() body: CreateBlogPostTagDto,
        @Req() req: any
    ): Promise<BlogPostTag> {
        const result = await this.blogPostTagsService.create({ 
            postId, 
            data: body 
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS');
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getAll(
        @Param('postId') postId: string,
        @Body() body: PaginationDto,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<BlogPostTag[]>> {
        const result = await this.blogPostTagsService.getAll({
            query: body,
            postId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', result.total);
        if (result.total === 0) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS', 0);
        }
        return result;
    }

    @Get(':tagId')
    async getById(
        @Param('postId') postId: string,
        @Param('tagId') tagId: string,
        @Req() req: any
    ): Promise<BlogPostTag | null> {
        const result = await this.blogPostTagsService.getById({
            tagId,
            postId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Delete(':tagId')
    async delete(
        @Param('postId') postId: string,
        @Param('tagId') tagId: string,
        @Req() req: any
    ): Promise<BlogPostTag> {
        const result = await this.blogPostTagsService.delete({
            tagId,
            postId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteBlogPostTagSchema))
    async deleteBulk(
        @Param('postId') postId: string,
        @Body() body: BulkDeleteBlogPostTagDto,
        @Req() req: any
    ): Promise<number> {
        const result = await this.blogPostTagsService.deleteBulk({
            data: body,
            postId
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }
} 