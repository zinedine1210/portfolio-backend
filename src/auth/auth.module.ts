import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRATION}` }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, LoggerService, PrismaService]
})
export class AuthModule {}
