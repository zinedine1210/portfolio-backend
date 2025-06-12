import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ProfileSkill } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { BulkDeleteProfileSkillDto, CreateProfileSkillDto, UpdateProfileSkillDto } from './dto/zod.schema';
import { PaginationDto } from '../common/types/pagination.dto';
import { ApiResponseWithPagination } from '../common/types/response.type';
import { buildQueryOptions } from '../common/utils/query-builder.util';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ProfileSkillsService {
    private readonly name: string = 'profile-skills';
    private dbTable = new PrismaService().profileSkill;

    constructor(
        private prisma: PrismaService,
        private logger: LoggerService,
        private profileService: ProfileService
    ) {
        this.dbTable = this.prisma.profileSkill;
    }

    async getAll(payload: { query: PaginationDto, profileId: string }): Promise<ApiResponseWithPagination<ProfileSkill[]>> {
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
                include: {
                    skill: true
                }
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

    async getById(payload: { skillId: string, profileId: string }): Promise<ProfileSkill | null> {
        const { skillId, profileId } = payload;
        const profileSkill = await this.dbTable.findUnique({
            where: {
                profileId_skillId: {
                    profileId,
                    skillId
                }
            },
            include: {
                skill: true
            }
        });
        this.logger.logInfo(`Fetching ${this.name} with Skill ID: ${skillId}`);
        return profileSkill;
    }

    async create(payload: { profileId: string, data: CreateProfileSkillDto }): Promise<ProfileSkill> {
        const { profileId, data } = payload;
        const profileSkill = await this.dbTable.create({
            data: {
                profileId,
                ...data
            },
            include: {
                skill: true
            }
        });
        this.logger.logInfo(`Creating a new ${this.name} for profile ID: ${profileId}`);
        return profileSkill;
    }

    async update(payload: { skillId: string, profileId: string, data: UpdateProfileSkillDto }): Promise<ProfileSkill> {
        const { skillId, profileId, data } = payload;
        const yoursData = await this.dbTable.findUnique({
            where: {
                profileId_skillId: {
                    profileId,
                    skillId
                }
            }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to update this record`);
        }
        const profileSkill = await this.dbTable.update({
            where: {
                profileId_skillId: {
                    profileId,
                    skillId
                }
            },
            data,
            include: {
                skill: true
            }
        });
        this.logger.logInfo(`Updating ${this.name} with Skill ID: ${skillId}`);
        return profileSkill;
    }

    async delete(payload: { skillId: string, profileId: string }): Promise<ProfileSkill> {
        const { skillId, profileId } = payload;
        const yoursData = await this.dbTable.findUnique({
            where: {
                profileId_skillId: {
                    profileId,
                    skillId
                }
            }
        });
        if (!yoursData) {
            throw new UnauthorizedException(`You are not authorized to delete this record`);
        }
        const profileSkill = await this.dbTable.delete({
            where: {
                profileId_skillId: {
                    profileId,
                    skillId
                }
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with Skill ID: ${skillId}`);
        return profileSkill;
    }

    async deleteBulk(payload: { data: BulkDeleteProfileSkillDto, profileId: string }): Promise<number> {
        const { data, profileId } = payload;
        const results = await this.dbTable.deleteMany({
            where: {
                skillId: { in: data.ids },
                profileId
            }
        });
        this.logger.logInfo(`Deleting ${this.name} with Skill IDs: ${data.ids}`);
        return results.count || 0;
    }
} 