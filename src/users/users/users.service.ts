import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ){}

    async findUserByEmail(email: string) {
        // this.logger.logInfo(`Search user with email: ${email}`);
        return this.prisma.user.findUnique({
            where: {
                email,
            }
        })
    }

    async findUserById(id: number) {
        // this.logger.logInfo(`Search user with id: ${id}`);
        return this.prisma.user.findUnique({
            where: {
                id,
            }
        })
    }
}
