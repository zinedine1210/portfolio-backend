import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly logger: LoggerService,
    ) {}

    async register(data: {
        email: string,
        password: string,
        name: string
    }): Promise<Record<string, any>> {
        const { email, password, name } = data;
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, password: hashed, name },
        });
        this.logger.log(user);
        return this.getToken(user.id, user.email);
    }

    async login(email: string, password: string): Promise<Record<string, any>> {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
        });
        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException('Invalid Credentials');
        }
        return this.getToken(user.id, user.email);
    }


    private getToken(userId: number, email: string): { access_token: string } {
        const payload = { userId, email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
