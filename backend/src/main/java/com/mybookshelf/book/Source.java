package com.mybookshelf.book;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Where a book came from. {@code from} names the library or the person;
 * {@code returned} only applies to {@link SourceType#LIBRARY} and {@link SourceType#BORROWED}.
 */
public record Source(
        @NotNull SourceType type,
        @Size(max = 200) String from,
        boolean returned) {

    public static Source own() {
        return new Source(SourceType.OWN, null, false);
    }
}
