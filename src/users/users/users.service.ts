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
        this.logger.log(`Search user with email: ${email}`);
        return this.prisma.user.findUnique({
            where: {
                email,
            }
        })
    }
}
