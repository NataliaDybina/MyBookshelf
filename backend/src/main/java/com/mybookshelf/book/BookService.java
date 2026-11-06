package com.mybookshelf.book;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.regex.Pattern;

import com.mybookshelf.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final MongoTemplate mongoTemplate;
    private final CurrentUser currentUser;
    private final Clock clock;

    public List<Book> list(BookFilter filter) {
        List<Criteria> criteria = new ArrayList<>();
        criteria.add(Criteria.where("userId").is(currentUser.id()));

        String text = trimToNull(filter.query());
        if (text != null) {
            // Literal, case-insensitive substring match on title or any author.
            Pattern pattern = Pattern.compile(Pattern.quote(text),
                    Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
            criteria.add(new Criteria().orOperator(
                    Criteria.where("title").regex(pattern),
                    Criteria.where("authors").regex(pattern)));
        }
        String genre = trimToNull(filter.genre());
        if (genre != null) {
            criteria.add(Criteria.where("genres").is(genre));
        }
        if (filter.status() != null) {
            criteria.add(Criteria.where("status").is(filter.status()));
        }
        if (filter.source() != null) {
            criteria.add(Criteria.where("source.type").is(filter.source()));
        }

        Query query = new Query(new Criteria().andOperator(criteria))
                .with(Sort.by(Sort.Direction.DESC, "addedAt"));
        return mongoTemplate.find(query, Book.class);
    }

    public List<String> genres() {
        Query query = new Query(Criteria.where("userId").is(currentUser.id()));
        return mongoTemplate.findDistinct(query, "genres", Book.class, String.class).stream()
                .sorted(Comparator.comparing(String::toLowerCase))
                .toList();
    }

    public Book get(String id) {
        return bookRepository.findByIdAndUserId(id, currentUser.id())
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    public Book create(BookRequest request) {
        Book book = new Book();
        book.setUserId(currentUser.id());
        book.setAddedAt(Instant.now(clock));
        apply(book, request);
        return bookRepository.save(book);
    }

    public Book update(String id, BookRequest request) {
        Book book = get(id);
        apply(book, request);
        return bookRepository.save(book);
    }

    public void delete(String id) {
        bookRepository.delete(get(id));
    }

    private void apply(Book book, BookRequest request) {
        book.setTitle(request.title().trim());
        book.setAuthors(cleanList(request.authors()));
        book.setCoverUrl(trimToNull(request.coverUrl()));
        book.setDescription(trimToNull(request.description()));
        book.setGenres(cleanList(request.genres()));
        book.setCatalogId(trimToNull(request.catalogId()));
        book.setStatus(request.status());
        book.setCurrentPage(request.currentPage());
        book.setPageCount(request.pageCount());
        book.setFormat(request.format());
        book.setRating(request.rating());
        book.setReview(trimToNull(request.review()));
        book.setSource(normalizeSource(request.source()));
        book.setWishReason(trimToNull(request.wishReason()));
        book.setRecommendedBy(trimToNull(request.recommendedBy()));

        LocalDate finishedAt = request.finishedAt();
        if (finishedAt == null && request.status() == BookStatus.READ) {
            finishedAt = LocalDate.now(clock);
        }
        book.setFinishedAt(finishedAt);
    }

    private static Source normalizeSource(Source source) {
        if (source == null || source.type() == SourceType.OWN) {
            return Source.own();
        }
        return new Source(source.type(), trimToNull(source.from()), source.returned());
    }

    /** Trims entries, drops blank ones and duplicates, keeps the order. */
    private static List<String> cleanList(List<String> values) {
        if (values == null) {
            return List.of();
        }
        LinkedHashSet<String> cleaned = new LinkedHashSet<>();
        for (String value : values) {
            String trimmed = trimToNull(value);
            if (trimmed != null) {
                cleaned.add(trimmed);
            }
        }
        return List.copyOf(cleaned);
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
