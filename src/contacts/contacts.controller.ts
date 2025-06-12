import { Body, Controller, Get, Post, Req, UsePipes, Param, UseGuards, Patch, Delete, RequestMethod, UnauthorizedException } from '@nestjs/common';
import { BulkDeleteDto, BulkDeleteSchema, CreateContactDto, CreateContactSchema, UpdateContactDto, UpdateContactSchema } from './dto/zod.schema';
import { ContactsService } from './contacts.service';
import { Contact, Role } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { PaginationDto, PaginationSchema } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { ApiResponseMessage } from 'src/common/utils/message.response';
import { User } from 'src/common/decorators/user/user.decorator';
import { UserResponse } from 'src/common/decorators/user/user.response';

@Controller('/api/contacts')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class ContactsController {
    constructor(
        private contactService: ContactsService,
        private readonly apiResponseMessage: ApiResponseMessage
    ) { }

    @Post('create')
    @UsePipes(new ZodValidationPipe(CreateContactSchema))
    async createContact(
        @Body() body: CreateContactDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Contact> {
        const result = await this.contactService.create(body);
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.POST, 'SUCCESS');
        return result;
    }

    @Post()
    @UsePipes(new ZodValidationPipe(PaginationSchema))
    async getContacts(
        @Body() body: PaginationDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<ApiResponseWithPagination<Contact[]>> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const result = await this.contactService.getAll({
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
    async getContactById(
        @Req() req: Request | any,
        @Param('id') id: string,
        @User() user: UserResponse
    ): Promise<Contact | null> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const result = await this.contactService.getById({
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
    @UsePipes(new ZodValidationPipe(UpdateContactSchema))
    async updateContact(
        @Param('id') id: string,
        @Body() body: UpdateContactDto,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Contact | null> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const updated = await this.contactService.update({
            id,
            profileId: user.profile.id,
            data: body
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.PATCH, 'SUCCESS');
        return updated;
    }

    @Delete(':id')
    async deleteContact(
        @Param('id') id: string,
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<Contact | null> {
        if (!user.profile?.id) {
            throw new UnauthorizedException('User profile not found');
        }
        const deleted = await this.contactService.deleteById({
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
        const deletedBulk = await this.contactService.deleteBulk({
            data: body,
            profileId: user.profile.id
        });
        req.customMessage = this.apiResponseMessage.getMessage(RequestMethod.DELETE, 'SUCCESS');
        return deletedBulk;
    }
} 