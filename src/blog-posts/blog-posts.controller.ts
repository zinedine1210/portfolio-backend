import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { BulkDeleteBlogPostDto, BulkDeleteBlogPostSchema, CreateBlogPostDto, CreateBlogPostSchema, UpdateBlogPostDto, UpdateBlogPostSchema } from './dto/zod.schema';
import { User } from '../common/decorators/user/user.decorator';
import { UserResponse } from '../common/decorators/user/user.response';
import { BlogPost, Role } from '@prisma/client';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { ApiResponseMessage } from '../common/utils/message.response';
import { PaginationDto, PaginationSchema } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { RequestMethod } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';

@Controller('/api/blog-posts')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class BlogPostsController {
    constructor(
        private blogPostsService: BlogPostsService,
        private profileService: ProfileService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateBlogPostSchema))
    async create(
        @Body() body: CreateBlogPostDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<BlogPost> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.blogPostsService.create({ 
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
    ): Promise<ApiResponseWithPagination<BlogPost[]>> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.blogPostsService.getAll({
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
    ): Promise<BlogPost | null> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.blogPostsService.getById({
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
    ): Promise<BlogPost | null> {
        const result = await this.blogPostsService.getBySlug(slug);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'SUCCESS');
        if (!result) {
            req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.GET, 'ERROR');
        }
        return result;
    }

    @Patch(':id')
    @UsePipes(new ZodValidationPipe(UpdateBlogPostSchema))
    async update(
        @Param('id') id: string,
        @Body() body: UpdateBlogPostDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<BlogPost> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.blogPostsService.update({
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
    ): Promise<BlogPost> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.blogPostsService.delete({
            id,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }

    @Delete('/delete/bulk')
    @UsePipes(new ZodValidationPipe(BulkDeleteBlogPostSchema))
    async deleteBulk(
        @Body() body: BulkDeleteBlogPostDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<number> {
        const profile = await this.profileService.getByUserId(user.id);
        const result = await this.blogPostsService.deleteBulk({
            data: body,
            profileId: profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return result;
    }
} 