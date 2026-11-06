package com.mybookshelf.book;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

// Never connect to the real database from tests.
@SpringBootTest(properties = "spring.mongodb.uri=mongodb://localhost:27017/test")
@AutoConfigureMockMvc
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookService bookService;

    @Test
    void createReturns201WithLocation() throws Exception {
        when(bookService.create(any(BookRequest.class)))
                .thenReturn(Book.builder().id("b1").userId("default").title("Der Process").status(BookStatus.READING).build());

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": "Der Process", "status": "READING"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/books/b1"))
                .andExpect(jsonPath("$.id").value("b1"))
                .andExpect(jsonPath("$.title").value("Der Process"))
                .andExpect(jsonPath("$.userId").doesNotExist());
    }

    @Test
    void createWithInvalidDataReturns400WithFieldErrors() throws Exception {
        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title": " ", "status": "READ", "rating": 6}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid input"))
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.rating").exists());
    }

    @Test
    void getUnknownBookReturns404() throws Exception {
        when(bookService.get("missing")).thenThrow(new BookNotFoundException("missing"));

        mockMvc.perform(get("/api/books/missing"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Book not found"));
    }

    @Test
    void listPassesFiltersToService() throws Exception {
        when(bookService.list(any(BookFilter.class))).thenReturn(List.of());

        mockMvc.perform(get("/api/books")
                        .param("q", "булгаков")
                        .param("genre", "Roman")
                        .param("status", "READ")
                        .param("source", "LIBRARY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        verify(bookService).list(new BookFilter("булгаков", "Roman", BookStatus.READ, SourceType.LIBRARY));
    }
}
