import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';

@Module({
  providers: [UsersService, PrismaService, LoggerService]
})
export class UsersModule {}
