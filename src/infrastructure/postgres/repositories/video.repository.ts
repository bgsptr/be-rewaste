import { Injectable } from "@nestjs/common";
import { Video, VideoComment } from "@prisma/client";
import PrismaService from "src/core/services/prisma/prisma.service";

@Injectable()
class VideoRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async create(data: Video): Promise<Video> {
        return await this.prisma.video.create({
            data,
        })
    }

    async findById(videoId: string): Promise<Video | null> {
        return this.prisma.video.findUnique({ where: { videoId } });
    }

    async getAll(): Promise<Video[]> {
        return await this.prisma.video.findMany();
    }

    async getByIdWithCommentsAndRating(videoId: string) {
        return await this.prisma.video.findFirst({
            where: {
                videoId
            },
            select: {
                videoId: true,
                url: true,
                uploader: {
                    select: {
                        userId: true,
                        username: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true
                            }
                        }
                    }
                },
                ratings: {
                    select: {
                        userId: true,
                        score: true,
                    }
                }
            }
        })
    }
}

export default VideoRepository