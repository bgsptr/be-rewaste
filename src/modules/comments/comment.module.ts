import VideoService from "src/core/services/videos/video.service";
import VideoRepository from "src/infrastructure/postgres/repositories/video.repository";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import VideoCommentRepository from "src/infrastructure/postgres/repositories/video-comment.repository";
import { Module, NestModule } from "@nestjs/common";

@Module({
    providers: [VideoCommentRepository],
    exports: [VideoCommentRepository],
})

export class CommentModule {}