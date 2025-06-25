import { Injectable } from "@nestjs/common";
import { VideoHistoryAndView } from "@prisma/client";
import PrismaService from "src/core/services/prisma/prisma.service";

@Injectable()
class VideoHistoryRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async getAll(userId: string) {
        return await this.prisma.videoHistoryAndView.findMany({
            where: {
                userId
            },
            select: {
                video: true,
                user: {
                    select: {
                        userId: true,
                        username: true,
                    }
                }
            },
            orderBy: {
                viewedAt: 'asc'
            }
        });
    }

    async create(data: VideoHistoryAndView): Promise<string> {
        const { historyId } = await this.prisma.videoHistoryAndView.create({
            data,
        });

        return historyId;
    }

    async countAll(videoId: string): Promise<number> {
        return await this.prisma.videoHistoryAndView.count({
            where: {
                videoId,
            }
        })
    }
}

export default VideoHistoryRepository;