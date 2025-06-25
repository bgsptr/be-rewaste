import { Injectable } from "@nestjs/common";
import { VideoComment } from "@prisma/client";
import PrismaService from "src/core/services/prisma/prisma.service";

@Injectable()
class VideoCommentRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async postComment(data: VideoComment) {
        return await this.prisma.videoComment.create({
            data,
        });
    }
}

export default VideoCommentRepository;