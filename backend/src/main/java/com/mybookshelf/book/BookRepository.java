package com.mybookshelf.book;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {

    Optional<Book> findByIdAndUserId(String id, String userId);
}
