import { Injectable } from "@nestjs/common";
import { VideoRated } from "@prisma/client";
import PrismaService from "src/core/services/prisma/prisma.service";

@Injectable()
class VideoRatingRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async create(data: VideoRated) {
        await this.prisma.videoRated.create({
            data,
        });
    }

    async update(score: number, videoId: string, userId: string) {
        await this.prisma.videoRated.update({
            where: {
                userId_videoId: {
                    videoId,
                    userId,
                }
            },
            data: {
                score,
            }
        })
    }
}

export default VideoRatingRepository;