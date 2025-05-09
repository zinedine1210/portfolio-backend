import { Body, ConflictException, Controller, Get, Post, Req, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterSchema } from './zod.schema';
import { RegisterUserDTO } from './dto/register.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { UsersService } from 'src/users/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
        private prisma: PrismaService,
        private logger: LoggerService
    ) { }

    @UsePipes(new ZodValidationPipe(RegisterSchema))
    @Post('register')
    async register(
        @Body() body: RegisterUserDTO,
        @Req() req: any // kalau mau make interceptor jangan make res lagi nnti bentrok
    ) {
        const existingUser = await this.userService.findUserByEmail(body.email);
        if (existingUser) {
            throw new ConflictException({message: 'Email is already registered', errors: null });
        }
        const token = await this.authService.register(body)
        req.customMessage = 'Successfully register';
        return {
            ...token
        }
    }

    @Post('login')
    async login(@Body() body: any, @Res() res: Response) {
        // const parsed
    }

    @Get('halo')
    async handleGet(){
        const users = await this.prisma.user.findMany();
        console.log(users);  // Cek di konsol apakah ada data
        return users;
    }
} 
