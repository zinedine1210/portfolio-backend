import { PrismaService } from "src/prisma/prisma.service";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";
import { LoggerService } from "src/common/logger/logger.service";
import { ApiResponseMessage } from "src/common/utils/message.response";
import { Module } from "@nestjs/common";

@Module({
  controllers: [TagsController],
  providers: [
    TagsService,
    PrismaService,
    LoggerService,
    ApiResponseMessage
  ],
  exports: []
})
export class TagsModule {}
