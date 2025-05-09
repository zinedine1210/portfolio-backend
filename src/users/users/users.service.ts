import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    ){}

    async findUserByEmail(email: string) {
        this.logger.info(`Search user with email: ${email}`);
        return this.prisma.user.findUnique({
            where: {
                email,
            }
        })
    }
}
