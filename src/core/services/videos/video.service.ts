import { Video, VideoComment } from '@prisma/client';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { CustomBadRequest } from 'src/core/exceptions/custom-bad-request.exception';
import VideoRepository from 'src/infrastructure/postgres/repositories/video.repository';
import { generateId } from 'src/utils/generator';
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { Injectable } from '@nestjs/common';
import VideoCommentRepository from 'src/infrastructure/postgres/repositories/video-comment.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundException } from 'src/core/exceptions/not-found.exception';
import VideoBookmarkRepository from 'src/infrastructure/postgres/repositories/video-bookmark.repository';
import { CustomConflict } from 'src/core/exceptions/custom-conflict.exception';
import VideoHistoryRepository from 'src/infrastructure/postgres/repositories/video-history.repository';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
class VideoService {
    constructor(
        private readonly videoRepository: VideoRepository,
        private readonly commentRepository: VideoCommentRepository,
        private readonly bookmarkRepository: VideoBookmarkRepository,
        private readonly historyRepository: VideoHistoryRepository,
        private logger: LoggerService,
    ) { }

    async upload(inputPath: string, outputDir: string): Promise<{ message: string; streamUrl: string }> {
        const baseName = path.basename(outputDir);
        const outputPath = path.join(outputDir, 'index.m3u8');

        fs.mkdirSync(outputDir, { recursive: true });

        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .addOptions([
                    '-profile:v baseline',
                    '-level 3.0',
                    '-start_number 0',
                    '-hls_time 10',
                    '-hls_list_size 0',
                    '-f hls',
                ])
                .output(outputPath)
                .on('end', () => {
                    fs.unlinkSync(inputPath);
                    resolve({
                        message: 'Upload & HLS conversion successful',
                        streamUrl: `/videos/${baseName}/index.m3u8`,
                    });
                })
                .on('error', (err) => {
                    this.logger.error(err.message);
                    reject(new CustomBadRequest('HLS Conversion failed'));
                })
                .run();
        });
    }

    async uploadToDatabase(data: Partial<Video>): Promise<Video> {
        return this.videoRepository.create({
            videoId: `VID-${generateId()}`,
            title: data.title ?? "",
            url: data.url ?? "",
            uploaderUserId: data.uploaderUserId ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    async getById(videoId: string, userId: string) {
        const data = await this.videoRepository.getByIdWithCommentsAndRating(videoId);

        if (!data) throw new NotFoundException('video', videoId);
        const totalRating = data.ratings.reduce((acc: number, rating: { userId: string, score: number }) =>
            acc + rating.score, 0) / data.ratings.length;

        const totalBookmark = await this.bookmarkRepository.countAll(videoId);
        const totalView = await this.historyRepository.countAll(videoId);

        const yourRating = data.ratings.find(rating => rating.userId === userId)?.score;

        return {
            ...data,
            totalRating,
            totalBookmark,
            totalView,
            yourRating,
        }
    }

    async getAllVideo(): Promise<Video[]> {
        return await this.videoRepository.getAll();
    }

    async comment(userId: string, videoId: string, commentContent: string) {
        try {
            const data: VideoComment = {
                commentId: `COMM-${generateId()}`,
                userId,
                videoId,
                content: commentContent,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            return await this.commentRepository.postComment(data);
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) throw new NotFoundException('video');
            throw err;
        }
    }

    async bookmarkTheVideo(userId: string, videoId: string) {
        try {
            return await this.bookmarkRepository.create(userId, videoId);
        } catch (err) {
            this.logger.error(err);
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') throw new CustomConflict('bookmark', `video id ${videoId}`);
            if (err instanceof PrismaClientKnownRequestError && err.code === "P2003") throw new NotFoundException('video', videoId);
            throw err;
        }
    }

    async deleteVideoFromBookmark(userId: string, videoId: string) {
        try {
            await this.bookmarkRepository.deleteById(videoId, userId);

        } catch (err) {
            this.logger.error(err);
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') throw new CustomConflict('bookmark', `video id ${videoId}`);
            if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") throw new NotFoundException('video', videoId);
            throw err;
        }
    }

    async getAllVideoHistoriesService(userId: string) {
        const histories = await this.historyRepository.getAll(userId);
        const uniqueHistories: {
            userId?: string
            videoId: string,
            title: string,
            createdAt: Date,
            uploadBy: string,
            url: string,
            updatedAt: Date,
        }[] = [];
        histories.map(history => {
            if (uniqueHistories.findIndex(empty => empty.videoId === history.video.videoId) === -1) {
                uniqueHistories.push({
                    videoId: history.video.videoId,
                    title: history.video.title,
                    createdAt: history.video.createdAt,
                    updatedAt: history.video.updatedAt,
                    url: history.video.url,
                    uploadBy: history.user.username,
                });
            }
        });

        return uniqueHistories;
    }

    async addVideoToHistory(userId: string, videoId: string) {
        const historyId = await this.historyRepository.create({
            historyId: `HIS-${generateId()}`,
            userId,
            videoId,
            viewedAt: new Date(),
        });

        return historyId;
    }
}

export default VideoService;
