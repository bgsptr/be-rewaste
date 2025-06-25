import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { VideoModule } from './modules/video/video.module';
import { CommentModule } from './modules/comments/comment.module';
import { BookmarkModule } from './modules/bookmarks/bookmark.module';
import { HistoryModule } from './modules/history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    PrismaModule,
    VideoModule,
    AuthModule,
    LoggerModule,
    CommentModule,
    BookmarkModule,
    HistoryModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
