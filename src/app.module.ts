import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConnectionService, createConnection } from './common/connection/connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './common/logger/logger.module';
import { AuthMiddleware } from './common/middleware/auth/auth.middleware';
import { LoggerService } from './common/logger/logger.service';

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
    LoggerService,
    {
      provide: ConnectionService,
      useFactory: createConnection,
      inject: [ConfigService],
    },
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
      path: '/api/auth/*',
      method: RequestMethod.ALL,
    });
  }
}
