import PrismaService from "src/core/services/prisma/prisma.service";

class VideoLikeRepository {
    constructor(
        private prisma: PrismaService,
    ) {}

    async create(userId: string, videoId: string, score: number) {
        await this.prisma.videoRated.create({
            data: {
                userId,
                videoId,
                score,
                createdAt: new Date(),
            }
        })
    }
}

export default VideoLikeRepository;