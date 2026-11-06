package com.mybookshelf.book;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("books")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    private String id;
    private String userId;

    private String title;
    private List<String> authors;
    private String coverUrl;
    private String description;
    private List<String> genres;
    private String catalogId;

    private BookStatus status;
    private Integer currentPage;
    private Integer pageCount;
    private BookFormat format;

    private Integer rating;
    private String review;

    private Source source;

    private String wishReason;
    private String recommendedBy;

    private Instant addedAt;
    private LocalDate finishedAt;
}
