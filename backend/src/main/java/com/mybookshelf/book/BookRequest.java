package com.mybookshelf.book;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/** Data sent by the client to create or update a book. */
public record BookRequest(
        @NotBlank @Size(max = 500) String title,
        @Size(max = 20) List<@Size(max = 200) String> authors,
        @Size(max = 2000) String coverUrl,
        @Size(max = 20000) String description,
        @Size(max = 30) List<@Size(max = 100) String> genres,
        @Size(max = 200) String catalogId,
        @NotNull BookStatus status,
        @PositiveOrZero Integer currentPage,
        @Positive Integer pageCount,
        BookFormat format,
        @Min(1) @Max(5) Integer rating,
        @Size(max = 20000) String review,
        @Valid Source source,
        @Size(max = 2000) String wishReason,
        @Size(max = 500) String recommendedBy,
        LocalDate finishedAt) {
}
