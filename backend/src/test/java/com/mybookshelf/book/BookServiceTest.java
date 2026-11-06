package com.mybookshelf.book;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import com.mybookshelf.user.CurrentUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    private static final Instant NOW = Instant.parse("2026-11-06T10:00:00Z");

    @Mock
    private BookRepository bookRepository;
    @Mock
    private MongoTemplate mongoTemplate;

    private BookService bookService;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(NOW, ZoneOffset.UTC);
        bookService = new BookService(bookRepository, mongoTemplate, new CurrentUser(), clock);
    }

    @Test
    void createSetsUserAndAddedAtAndCleansInput() {
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Book book = bookService.create(request(" Мастер и Маргарита ", BookStatus.READING, null,
                new Source(SourceType.OWN, "ignored", true)));

        assertThat(book.getUserId()).isEqualTo(CurrentUser.DEFAULT_USER_ID);
        assertThat(book.getAddedAt()).isEqualTo(NOW);
        assertThat(book.getTitle()).isEqualTo("Мастер и Маргарита");
        assertThat(book.getAuthors()).containsExactly("Михаил Булгаков");
        assertThat(book.getGenres()).containsExactly("Roman", "Klassik");
        assertThat(book.getSource()).isEqualTo(Source.own());
        assertThat(book.getFinishedAt()).isNull();
    }

    @Test
    void createSetsFinishedAtToTodayWhenReadWithoutDate() {
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Book book = bookService.create(request("Title", BookStatus.READ, null, null));

        assertThat(book.getFinishedAt()).isEqualTo(LocalDate.of(2026, 11, 6));
        assertThat(book.getSource()).isEqualTo(Source.own());
    }

    @Test
    void createKeepsGivenFinishedAtAndBorrowedSource() {
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));
        LocalDate finished = LocalDate.of(2025, 3, 1);

        Book book = bookService.create(request("Title", BookStatus.READ, finished,
                new Source(SourceType.BORROWED, "  Anna ", true)));

        assertThat(book.getFinishedAt()).isEqualTo(finished);
        assertThat(book.getSource()).isEqualTo(new Source(SourceType.BORROWED, "Anna", true));
    }

    @Test
    void updateKeepsUserAndAddedAt() {
        Instant addedAt = Instant.parse("2026-01-01T00:00:00Z");
        Book existing = Book.builder().id("b1").userId(CurrentUser.DEFAULT_USER_ID).title("Old").addedAt(addedAt).build();
        when(bookRepository.findByIdAndUserId("b1", CurrentUser.DEFAULT_USER_ID)).thenReturn(Optional.of(existing));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Book book = bookService.update("b1", request("New", BookStatus.WANT_TO_READ, null, null));

        assertThat(book.getTitle()).isEqualTo("New");
        assertThat(book.getAddedAt()).isEqualTo(addedAt);
        assertThat(book.getUserId()).isEqualTo(CurrentUser.DEFAULT_USER_ID);
    }

    @Test
    void getThrowsWhenBookDoesNotExist() {
        when(bookRepository.findByIdAndUserId("missing", CurrentUser.DEFAULT_USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.get("missing")).isInstanceOf(BookNotFoundException.class);
    }

    @Test
    void listFiltersByUserAndAllGivenFilters() {
        when(mongoTemplate.find(any(Query.class), eq(Book.class))).thenReturn(List.of());

        bookService.list(new BookFilter("булгаков", "Roman", BookStatus.READ, SourceType.LIBRARY));

        ArgumentCaptor<Query> captor = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(captor.capture(), eq(Book.class));
        String query = captor.getValue().getQueryObject().toString();
        assertThat(query)
                .contains("userId=default")
                .contains("булгаков")
                .contains("genres=Roman")
                .contains("status=READ")
                .contains("source.type=LIBRARY");
    }

    private static BookRequest request(String title, BookStatus status, LocalDate finishedAt, Source source) {
        return new BookRequest(title, List.of(" Михаил Булгаков ", ""), null, null,
                List.of("Roman", " Klassik", "Roman"), null, status, null, null, BookFormat.PAPER,
                null, null, source, null, null, finishedAt);
    }
}
