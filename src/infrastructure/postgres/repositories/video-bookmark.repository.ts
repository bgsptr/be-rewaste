import { Injectable } from "@nestjs/common";
import PrismaService from "src/core/services/prisma/prisma.service";

@Injectable()
class VideoBookmarkRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async create(userId: string, videoId: string) {
        await this.prisma.videoBookmarked.create({
            data: {
                userId,
                videoId,
                bookmarkedAt: new Date(),
            }
        })
    }

    async deleteById(videoId: string, userId: string) {
        await this.prisma.videoBookmarked.delete({
            where: {
                userId_videoId: {
                    videoId,
                    userId,
                }
            }
        })
    }

    async getAll(userId: string) {
        return await this.prisma.videoBookmarked.findMany({
            where: {
                userId,
            },
            select: {
                video: true,
                user: {
                    select: {
                        userId: true,
                        username: true,
                    }
                }
            }
        }) 
    }

    async countAll(videoId: string): Promise<number> {
        return await this.prisma.videoBookmarked.count({
            where: {
                videoId,
            }
        })
    }
}

export default VideoBookmarkRepository;