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
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { UploadModule } from './upload/upload.module';
import { ProfileModule } from './profile/profile.module';
import { ContactsModule } from './contacts/contacts.module';
import { FilesModule } from './files/files.module';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { ProfileSkillsModule } from './profile-skills/profile-skills.module';
import { ProjectSkillsModule } from './project-skills/project-skills.module';
import { BlogPostTagsModule } from './blog-post-tags/blog-post-tags.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    ProjectsModule,
    SkillsModule,
    UploadModule,
    ProfileModule,
    ContactsModule,
    BlogPostsModule,
    FilesModule,
    ProfileSkillsModule,
    BlogPostsModule,
    ProjectSkillsModule,
    BlogPostTagsModule,
    TagsModule
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
      path: '/api/*path',
      method: RequestMethod.ALL,
    });
  }
}
