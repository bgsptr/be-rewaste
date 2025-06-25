import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import VideoController from "./video.controller";
import VideoService from "src/core/services/videos/video.service";
import VideoRepository from "src/infrastructure/postgres/repositories/video.repository";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { CommentModule } from "../comments/comment.module";
import VideoBookmarkRepository from "src/infrastructure/postgres/repositories/video-bookmark.repository";
import { BookmarkModule } from "../bookmarks/bookmark.module";
import RatingService from "src/core/services/ratings/rating.service";
import VideoRatingRepository from "src/infrastructure/postgres/repositories/video-rating.repository";
import VideoHistoryRepository from "src/infrastructure/postgres/repositories/video-history.repository";

@Module({
    imports: [CommentModule, BookmarkModule],
    controllers: [VideoController],
    providers: [VideoService, RatingService, VideoRatingRepository, VideoRepository, VideoBookmarkRepository, VideoHistoryRepository],
})

export class VideoModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('videos');
    }
}