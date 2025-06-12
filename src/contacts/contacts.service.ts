import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Contact } from '@prisma/client';
import { LoggerService } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BulkDeleteDto, CreateContactDto, UpdateContactDto } from './dto/zod.schema';
import { PaginationDto } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';
import { buildQueryOptions } from 'src/common/utils/query-builder.util';

@Injectable()
export class ContactsService {
    private readonly name: string = 'contacts';
    private dbTable = new PrismaService().contact;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.contact;
    }

    async getAll(payload: { query: PaginationDto, profileId: string }): Promise<ApiResponseWithPagination<Contact[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);

        const [data, total] = await Promise.all([
            this.dbTable.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: {
                    ...filters,
                    profileId: payload.profileId
                },
            }),
            this.dbTable.count({
                where: {
                    ...filters,
                    profileId: payload.profileId
                }
            }),
        ]);

        this.logger.logInfo(`Fetching all ${this.name} for profile ID: ${payload.profileId}, total: ${total}`);
        return {
            ...meta,
            total,
            data,
        };
    }

    async getById(payload: { id: string, profileId: string }): Promise<Contact | null> {
        const { id, profileId } = payload;
        const contact = await this.dbTable.findFirst({
            where: { id, profileId }
        });
        this.logger.logInfo(`Fetching ${this.name} with ID: ${id}`);
        return contact;
    }

    async create(data: CreateContactDto): Promise<Contact> {
        const contact = await this.dbTable.create({
            data
        });
        this.logger.logInfo(`Creating a new ${this.name}`);
        return contact;
    }

    async update(payload: { id: string, profileId: string, data: UpdateContactDto }): Promise<Contact> {
        const { id, profileId, data } = payload;
        const yoursData = await this.dbTable.findFirst({
            where: { id, profileId }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to update this record`);
        }
        const contact = await this.dbTable.update({
            where: { id },
            data
        });
        this.logger.logInfo(`Updating ${this.name} with ID: ${id}`);
        return contact;
    }

    async deleteById(payload: { id: string, profileId: string }): Promise<Contact> {
        const { id, profileId } = payload;
        const yoursData = await this.dbTable.findFirst({
            where: { id, profileId }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to delete this record`);
        }
        const contact = await this.dbTable.delete({
            where: { id }
        });
        this.logger.logInfo(`Deleting ${this.name} with ID: ${id}`);
        return contact;
    }

    async deleteBulk(payload: { data: BulkDeleteDto, profileId: string }): Promise<number> {
        const { data, profileId } = payload;
        const contacts = await this.dbTable.deleteMany({
            where: {
                id: { in: data.ids },
                profileId
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with IDs: ${data.ids}`);
        return contacts.count || 0;
    }
} 