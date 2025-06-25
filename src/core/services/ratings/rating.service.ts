import { Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomConflict } from "src/core/exceptions/custom-conflict.exception";
import { NotFoundException } from "src/core/exceptions/not-found.exception";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import VideoRatingRepository from "src/infrastructure/postgres/repositories/video-rating.repository";

@Injectable()
class RatingService {
    constructor(
        private ratingRepository: VideoRatingRepository,
        private logger: LoggerService,
    ) { }

    async addNewRating(videoId: string, userId: string, score: number) {
        try {
            await this.ratingRepository.create({
                videoId,
                userId,
                score,
                createdAt: new Date(),
            });
        } catch (err) {
            this.getErrorRating(err, videoId);
        }
    }

    async updateRating(videoId: string, userId: string, score: number) {
        try {
            await this.ratingRepository.update(score, videoId, userId);
        } catch (err) {
            this.getErrorRating(err, videoId);
        }
    }

    private getErrorRating(err: any, videoId: string) {
        this.logger.error(err);
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') throw new CustomConflict('rating', `video id ${videoId}`);
        if (err instanceof PrismaClientKnownRequestError && err.code === "P2003") throw new NotFoundException('video', videoId);
        throw err;
    }
}

export default RatingService