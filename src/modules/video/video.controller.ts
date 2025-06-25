import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FetchJWTPayload } from 'src/shared/decorators/fetch-jwt-payload.decorator';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import VideoService from 'src/core/services/videos/video.service';
import RatingService from 'src/core/services/ratings/rating.service';
import { CustomBadRequest } from 'src/core/exceptions/custom-bad-request.exception';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { roleNumber } from 'src/utils/enum/role.enum';

@Controller('videos')
class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly logger: LoggerService,
    private readonly ratingService: RatingService,
  ) { }

  // @UseGuards(RolesGuard)
  // @Roles(roleNumber.ADMIN)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFileController(
    @UploadedFile() file: Express.Multer.File,
    @FetchJWTPayload() payload: { id: string },
  ) {
    try {
      const inputPath = join(__dirname, '..', '..', '..', 'public', 'uploads', file.filename);
      const outputDir = join(__dirname, '..', '..', '..', 'public', 'hls', file.filename.split('.')[0]);

      const { message, streamUrl } = await this.videoService.upload(inputPath, outputDir);

      this.logger.debug(payload);

      const videoData = {
        title: file.originalname,
        url: streamUrl,
        uploaderUserId: payload.id,
      };

      await this.videoService.uploadToDatabase(videoData);
      return { message, streamUrl };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Get('/:id')
  async getVideoById(@Param('id') id: string, @FetchJWTPayload() payload: { id: string }) {
    const video = await this.videoService.getById(id, payload.id);
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return {
      success: true,
      message: `video with id ${video.videoId} fetched successfully`,
      data: {
        video
      },
    };
  }

  @Get()
  async getAllVideoController() {
    const results = await this.videoService.getAllVideo();

    return {
      success: true,
      message: "all videos fetched successfully",
      results,
    }
  }

  @Post("/:id/comment")
  async commentOnVideoController(@Body() body: { content: string }, @Param() param: { id: string }, @FetchJWTPayload() payload: { id: string }) {
    const data = await this.videoService.comment(payload.id, param.id, body.content);

    return {
      success: true,
      message: `successfully comment on video with id ${data.videoId}`,
      data,
    }
  }

  @Post("/:id/bookmark")
  async postBookmarkController(@FetchJWTPayload() payload: { id: string }, @Param() param: { id: string }) {
    const data = await this.videoService.bookmarkTheVideo(payload.id, param.id);

    return {
      success: true,
      message: "successfully bookmark the video",
      data,
    }
  }

  @Delete("/:id/bookmark")
  async deleteBookmarkController(@FetchJWTPayload() payload: { id: string }, @Param() param: { id: string }) {
    await this.videoService.deleteVideoFromBookmark(payload.id, param.id);

    return {
      success: true,
      message: `successfully delete video with id ${param.id} from bookmark`,
    }
  }

  @Post("/:id/rating")
  async rateTheVideoController(@Body() body: { score: number }, @Param() param: { id: string }, @FetchJWTPayload() payload: { id: string }) {
    if (typeof (body.score) !== 'number') throw new CustomBadRequest("score must have type of number value");
    if (body.score < 1 && body.score > 5) throw new CustomBadRequest("score must have value between 1 and 5");
    await this.ratingService.addNewRating(param.id, payload.id, body.score);

    return {
      success: true,
      message: `successfully give rating to video with id ${param.id}`,
    }
  }

  @Put("/:id/rating")
  async updateRatingOfVideo(@Body() body: { score: number }, @Param() param: { id: string }, @FetchJWTPayload() payload: { id: string }) {
    if (typeof (body.score) !== 'number') throw new CustomBadRequest("score must have type of number value");
    if (body.score < 1 && body.score > 5) throw new CustomBadRequest("score must have value between 1 and 5");
    await this.ratingService.updateRating(param.id, payload.id, body.score);

    return {
      success: true,
      message: `successfully give rating to video with id ${param.id}`,
    }
  }

  @Post("/:id/view")
  async viewTheVideoController(@FetchJWTPayload() payload: { id: string }, @Param() param: { id: string }) {
    const historyId = await this.videoService.addVideoToHistory(payload.id, param.id);

    return {
      success: true,
      message: "successfully view the video",
      data: {
        historyId,
      }
    }
  }
}

export default VideoController;
