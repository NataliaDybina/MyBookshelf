package com.mybookshelf.user;

import org.springframework.stereotype.Component;

/**
 * Provides the ID of the user the current request acts for.
 * There is no login yet, so every request belongs to one fixed default user.
 * Replace this with the authenticated user once login is added.
 */
@Component
public class CurrentUser {

    public static final String DEFAULT_USER_ID = "default";

    public String id() {
        return DEFAULT_USER_ID;
    }
}
