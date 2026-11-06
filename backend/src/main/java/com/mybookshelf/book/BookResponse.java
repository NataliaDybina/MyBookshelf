package com.mybookshelf.book;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** Book data returned to the client (without internal fields such as the user ID). */
public record BookResponse(
        String id,
        String title,
        List<String> authors,
        String coverUrl,
        String description,
        List<String> genres,
        String catalogId,
        BookStatus status,
        Integer currentPage,
        Integer pageCount,
        BookFormat format,
        Integer rating,
        String review,
        Source source,
        String wishReason,
        String recommendedBy,
        Instant addedAt,
        LocalDate finishedAt) {

    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthors(),
                book.getCoverUrl(),
                book.getDescription(),
                book.getGenres(),
                book.getCatalogId(),
                book.getStatus(),
                book.getCurrentPage(),
                book.getPageCount(),
                book.getFormat(),
                book.getRating(),
                book.getReview(),
                book.getSource(),
                book.getWishReason(),
                book.getRecommendedBy(),
                book.getAddedAt(),
                book.getFinishedAt());
    }
}
