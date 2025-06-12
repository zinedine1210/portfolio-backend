import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterUserDTO } from 'src/auth/dto/register.dto';
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

    async findUserById(id: string) {
        // this.logger.logInfo(`Search user with id: ${id}`);
        return this.prisma.user.findUnique({
            where: {
                id,
            }
        })
    }

    async getAllUsers() {
        return this.prisma.user.findMany();
    }

    async createUser(data: RegisterUserDTO) {
        const { email, password } = data;
        const newUser = await this.prisma.user.create({
            data: { email, password }
        })
        this.logger.logInfo(`New user created with email: ${email}`);
        return newUser;
    }
}
