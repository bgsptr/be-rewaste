import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import VideoBookmarkRepository from "src/infrastructure/postgres/repositories/video-bookmark.repository";
import BookmarkController from "./bookmark.controller";
import BookmarkService from "src/core/services/bookmark/bookmark.service";
import { AuthMiddleware } from "src/middlewares/auth.middleware";

@Module({
    controllers: [BookmarkController],
    providers: [BookmarkService, VideoBookmarkRepository],
    exports: [VideoBookmarkRepository]
})

export class BookmarkModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('bookmarks');
    }
}