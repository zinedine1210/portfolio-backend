import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema } from './zod.schema';
import { RegisterUserDTO } from './dto/register.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RolesGuard } from 'src/common/roles/roles.guard';
import { Roles } from 'src/common/roles/roles.decorator';
import { User } from 'src/common/decorators/user/user.decorator';
import { LoginUserDTO } from './dto/login.dto';
import { Role } from '@prisma/client';
import { RegisterResponse } from './response/index.response';
import { UserResponse } from 'src/common/decorators/user/user.response';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @UsePipes(new ZodValidationPipe(RegisterSchema))
    @Post('register')
    async register(
        @Body() body: RegisterUserDTO,
        @Req() req: any // kalau mau make interceptor jangan make res lagi nnti bentrok
    ): Promise<any> {
        const result = await this.authService.register(body)
        req.customMessage = 'Successfully register';
        return {
            email: result.email
        }
    }

    @UsePipes(new ZodValidationPipe(LoginSchema))
    @Post('login')
    async login(
        @Body() body: LoginUserDTO,
        @Req() req: any
    ) {
        const result = await this.authService.login(body);

        req.customMessage = 'Successfully login'
        return {
            ...result
        };
    }


    @Post('logout')
    logout(
        @User() user: any,
        @Req() req: any
    ) {
        req.customMessage = 'Successfully logout';
        return `${user.email} logout`
    }


    @Get('me')
    // @UseGuards(RolesGuard)
    // @Roles(Role.OPERATOR, Role.GUEST)
    async getMe(
        @User() user: UserResponse,
        @Req() req: any
    ): Promise<RegisterResponse> {
        const result = await this.authService.getUserById(user.id);
        req.customMessage = 'Successfully get user';
        return {
            ...result
        }
    }

    @Get('halo')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async handleGet(
        @User() user: UserResponse
    ) {
        // const users = await this.prisma.user.findMany();
        // console.log(users);  // Cek di konsol apakah ada data
        // return users;
        return `${user.email} - ${user.role}`
    }
} 
