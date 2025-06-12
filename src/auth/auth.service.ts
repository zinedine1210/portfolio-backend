import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/common/logger/logger.service';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users/users.service';
import { RegisterUserDTO } from './dto/register.dto';
import { LoginUserDTO } from './dto/login.dto';
import { LoginResponse, RegisterResponse } from './response/index.response';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private readonly logger: LoggerService,
    ) {}

    async register(data: RegisterUserDTO): Promise<User> {
        const { email, password } = data;
        const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException({ message: 'Email is already registered', errors: null });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.userService.createUser({
            email,
            password: hashed
        })
        this.logger.logInfo(`User ${email} registered ${user ? 'SUCCESS': 'FAILED'}`)
        return user;
    }

    async login(data: LoginUserDTO): Promise<LoginResponse> {
        const { email, password } = data;
        const user = await this.userService.findUserByEmail(email);
        this.logger.logInfo(`Try to login with email: ${email}, and ${!user ? 'FAILED': 'SUCCESS'} login`);
        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException('Invalid Credentials');
        }
        return this.getToken(user);
    }

    async getUserById(id: string): Promise<RegisterResponse> {
        const user = await this.userService.findUserById(id);
        this.logger.logInfo(`Get user with id: ${id}, ${user ? 'SUCCESS': 'FAILED'}`);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }

    private getToken(user: User): LoginResponse{
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
