import { Injectable } from "@nestjs/common";
import VideoBookmarkRepository from "src/infrastructure/postgres/repositories/video-bookmark.repository";

@Injectable()
class BookmarkService {
    constructor(
        private bookmarkRepository: VideoBookmarkRepository
    ) {}

    async fetchAllBookmarkedVideoFromUser(userId: string) {
        const bookmarks = await this.bookmarkRepository.getAll(userId);
        return bookmarks.map(bookmark => ({
            ...bookmark.video,
            uploadBy: bookmark.user.username,
        }));
    }
}

export default BookmarkService;