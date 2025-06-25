import { Controller, Get } from "@nestjs/common";
import VideoService from "src/core/services/videos/video.service";
import { FetchJWTPayload } from "src/shared/decorators/fetch-jwt-payload.decorator";

@Controller("history")
class HistoryController {
    constructor(
        private videoService: VideoService,
    ) {}

    @Get()
    async getAllHistory(@FetchJWTPayload() payload: { id: string }) {
        const history = await this.videoService.getAllVideoHistoriesService(payload.id);

        return {
            success: true,
            message: "all history fetched successfully",
            history,
        }
    }
}

export default HistoryController;