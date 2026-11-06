package com.mybookshelf;

import java.time.Clock;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockConfig {

    /** System clock; injected so that tests can use a fixed time. */
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
