import { Controller, Get } from "@nestjs/common";
import BookmarkService from "src/core/services/bookmark/bookmark.service";
import { FetchJWTPayload } from "src/shared/decorators/fetch-jwt-payload.decorator";

@Controller('bookmarks')
class BookmarkController {
    constructor(
        private bookmarkService: BookmarkService,
    ) {}

    @Get()
    async getAllVideoFromBookmarkController(@FetchJWTPayload() payload: { id: string }) {
        const bookmarks = await this.bookmarkService.fetchAllBookmarkedVideoFromUser(payload.id);

        return {
            success: true,
            message: "successfully fetch all video from bookmark",
            data: {
                ownerId: payload.id,
                bookmarks,
            }
        }
    }
}

export default BookmarkController;