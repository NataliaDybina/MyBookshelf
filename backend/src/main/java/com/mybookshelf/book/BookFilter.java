package com.mybookshelf.book;

/** Optional filters for the book list; {@code null} means "no filter". */
public record BookFilter(String query, String genre, BookStatus status, SourceType source) {
}
