import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { BulkDeleteProfileDto, CreateProfileDto, UpdateProfileDto } from './dto/zod.schema';
import { Profile } from '@prisma/client';
import { PaginationDto } from 'src/common/types/pagination.dto';
import { ApiResponseWithPagination } from 'src/common/types/response.type';
import { buildQueryOptions } from 'src/common/utils/query-builder.util';

@Injectable()
export class ProfileService {
  private readonly name: string = 'profile';
    private dbTable = new PrismaService().profile;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) {
        this.dbTable = this.prisma.profile;
    }

    async getAll(payload: { query: PaginationDto, userId: string }): Promise<ApiResponseWithPagination<Profile[]>> {
        const { pagination, orderBy, filters, meta } = buildQueryOptions(payload.query);
        const [data, total] = await Promise.all([
            this.dbTable.findMany({
                skip: pagination.skip,
                take: pagination.take,
                orderBy: orderBy,
                where: filters,
                include: {
                    skills: {
                        include: {
                            skill: true
                        }
                    },
                    contacts: true,
                    // projects: {
                    //     include: {
                    //         skills: {
                    //             include: {
                    //                 skill: true
                    //             }
                    //         }
                    //     }
                    // },
                    // blogPosts: {
                    //     include: {
                    //         tags: {
                    //             include: {
                    //                 tag: true
                    //             }
                    //         }
                    //     }
                    // },
                    // files: true
                }
            }),
            this.dbTable.count({ where: filters }),
        ]);
        console.log(data);

        this.logger.logInfo(`Fetching all ${this.name} for user Id: ${payload.userId} and total ${total}`);
        return {
            ...meta,
            total,
            data,
        };
    }

    async getByUserId(userId: string): Promise<Profile> {
        const result = await this.dbTable.findUnique({
            where: { userId },
            include: {
                skills: {
                    include: {
                        skill: true
                    }
                },
                contacts: true,
                projects: {
                    include: {
                        skills: {
                            include: {
                                skill: true
                            }
                        }
                    }
                },
                blogPosts: {
                    include: {
                        tags: {
                            include: {
                                tag: true
                            }
                        }
                    }
                },
                files: true
            }
        })
        if (!result) {
            throw new UnauthorizedException(`You are not authorized to get this record`);
        }
        return result;
    }

    async getById(payload: { id: string, userId: string }): Promise<Profile | null> {
        const { id, userId } = payload;
        const result = await this.dbTable.findUnique({
            where: { id, userId },
            include: {
                skills: {
                    include: {
                        skill: true
                    }
                },
                contacts: true,
                projects: {
                    include: {
                        skills: {
                            include: {
                                skill: true
                            }
                        }
                    }
                },
                blogPosts: {
                    include: {
                        tags: {
                            include: {
                                tag: true
                            }
                        }
                    }
                },
                files: true
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with ID: ${id}`);
        return result;
    }

    async create(payload: { userId: string, data: CreateProfileDto }): Promise<Profile> {
        const { userId, data } = payload;
        const result = await this.dbTable.create({
            data: {
                userId,
                ...data
            }
        });
        this.logger.logInfo(`Creating a new ${this.name} for user Id: ${userId}`);
        return result;
    }

    async update(payload: { userId: string, id: string, data: UpdateProfileDto }): Promise<Profile> {
        const { id, data, userId } = payload;
        const yoursData = await this.dbTable.findUnique({
            where: { id, userId }
        })
        if(!yoursData) {
            throw new UnauthorizedException(`You are not authorized to update this record`);
        }
        const result = await this.dbTable.update({
            where: { id, userId },
            data
        });
        this.logger.logInfo(`Updating ${this.name} with ID: ${id}`);
        return result;
    }

    async deleteById(payload: { id: string, userId: string }): Promise<Profile> {
        const { id, userId } = payload;
        const yoursData = await this.dbTable.findUnique({
            where: { id, userId }
        })
        if(!yoursData) {
            throw new UnauthorizedException(`You are not authorized to delete this record`);
        }
        const result = await this.dbTable.delete({
            where: { id, userId }
        });
        this.logger.logInfo(`Deleting ${this.name} with ID: ${id}`);
        return result;
    }

    async deleteBulk(payload: { data: BulkDeleteProfileDto, userId: string }): Promise<number> {
        const { data, userId } = payload;
        const results = await this.dbTable.deleteMany({
            where: {
                id: { in: data.ids },
                userId
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with IDs: ${data.ids}`);
        return results.count || 0;
    }
}