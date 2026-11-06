package com.mybookshelf;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Never connect to the real database from tests.
@SpringBootTest(properties = "spring.mongodb.uri=mongodb://localhost:27017/test")
class MyBookshelfApplicationTests {

	@Test
	void contextLoads() {
	}

}
