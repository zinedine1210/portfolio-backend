import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/common/logger/logger.service';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users/users.service';
import { RegisterUserDTO } from './dto/register.dto';
import { LoginUserDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private userService: UsersService,
        private jwtService: JwtService,
        private readonly logger: LoggerService,
    ) {}

    async register(data: RegisterUserDTO): Promise<User> {
        const { email, password, name } = data;
        const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException({ message: 'Email is already registered', errors: null });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, password: hashed, name },
        });
        this.logger.logInfo(`User ${email} registered ${user ? 'SUCCESS': 'FAILED'}`)
        return user;
    }

    async login(data: LoginUserDTO): Promise<Record<string, any>> {
        const { email, password } = data;
        const user = await this.userService.findUserByEmail(email);
        this.logger.logInfo(`Try to login with email: ${email}, and ${!user ? 'FAILED': 'SUCCESS'} login`);
        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException('Invalid Credentials');
        }
        return this.getToken(user);
    }

    async getUserById(id: number): Promise<any> {
        const user = await this.userService.findUserById(id);
        this.logger.logInfo(`Get user with id: ${id}, ${user ? 'SUCCESS': 'FAILED'}`);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    private getToken(user: User): { access_token: string } {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
