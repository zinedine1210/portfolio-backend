import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConnectionService, createConnection } from './common/connection/connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    {
      provide: ConnectionService,
      useFactory: createConnection,
      inject: [ConfigService],
    },
  ]
})
export class AppModule {}
