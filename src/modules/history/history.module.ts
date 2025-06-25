import VideoService from "src/core/services/videos/video.service";
import VideoRepository from "src/infrastructure/postgres/repositories/video.repository";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import VideoCommentRepository from "src/infrastructure/postgres/repositories/video-comment.repository";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import HistoryController from "./history.controller";
import VideoBookmarkRepository from "src/infrastructure/postgres/repositories/video-bookmark.repository";
import VideoHistoryRepository from "src/infrastructure/postgres/repositories/video-history.repository";

@Module({
    providers: [VideoService, VideoRepository, VideoCommentRepository, VideoBookmarkRepository, VideoHistoryRepository],
    controllers: [HistoryController],
})

export class HistoryModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('history');
    }
}