# Requirements

## 1. Project Overview

My Bookshelf is a personal library of books: books that have been read, books currently being read, and books
the owner would like to read. It is used by a single person for now.

The main purpose is to collect personal impressions of books that have been read and to keep track of books
worth reading, including why and on whose recommendation.

## 2. Goals

* Personal impressions of every book read are collected in one place and can be found again later.
* Books the owner wants to read are not forgotten, together with the reason and the recommendation behind them.
* It is always clear where a book came from (own copy, library, borrowed from someone) and whether a borrowed
  book has been returned.
* Adding a book takes little effort, because the cover, description, and genres are loaded from the internet.

## 3. Core Features

* Add a book by searching an online book catalog and taking over its cover, description, and genres.
* Edit all book data manually, including the loaded cover, description, and genres.
* Track the reading status and the current page.
* Write a personal review and give a rating.
* Record where a book came from and whether a borrowed book has been returned.
* Keep a wish list of books to read, with a note on why and where the book was recommended.
* Search and filter the library, including by genre.

## 4. Library

The Library shows all books and is the main page of the application.

The page should display at least:

* Cover, title, and author of each book
* Reading status
* Rating (for books that have been read)

Users should be able to:

* Search books by title and author
* Filter books by genre
* Filter books by reading status
* Filter books by source (where the book came from)
* Open the details page of a book

### Reading Status

Every book must have one of the following statuses:

* **Want to read** — the book is on the wish list (see section 6)
* **Reading** — the book is currently being read
* **Read** — the book has been finished

## 5. Book Details

The details page shows all data of a single book and allows editing it.

A book must store:

* Title and author(s)
* Cover image
* Description (short summary)
* Genres (one or more)
* Reading status
* Current page (while reading)
* Date added (set automatically when the book is created)
* Date finished (when the status changes to "Read"; editable)
* Rating (scale 1–5)
* Personal review (free text)
* Source (see below)
* Format: paper book, e-book, or audiobook

Users should be able to:

* Edit every field, including the cover, description, and genres loaded from the internet
* Update the current page and the reading status
* Delete the book

### Source

The source records where the book came from:

* **Own copy** — the book is at home
* **Library** — with the name of the library (free text)
* **Borrowed** — with the name of the person it was borrowed from (free text)

For books from a library or borrowed from someone, a "returned" mark must be available.
A return due date is not needed.

### Adding a Book

Users should be able to add a book in one of two ways:

* Search an online book catalog by title, author, or ISBN, pick a result, and take over its title, author(s),
  cover, description, and genres. All taken-over data can be changed afterwards.
* Enter the book manually, if it cannot be found.

Books are in Russian, English, and German. The search must handle titles and authors in all three languages
(including Cyrillic). The catalog with the most complete data for these languages should be used.

## 6. Wish List

The wish list contains the books with the status "Want to read".

For each book on the wish list, users should be able to record:

* Why they want to read it (free text)
* Where they saw it or who recommended it (free text)

When the user starts reading a book from the wish list, its status changes to "Reading"; the book keeps its
wish-list notes.

## 7. Users

The first version has no login and is used by a single person.

The data model must allow adding multiple users later without restructuring the data (e.g. every book belongs
to a user).

## 8. Non-Functional Requirements

### Security

* Secrets (e.g. API keys for the book catalog) are provided only via environment variables.

### Performance

* One user and a personal library of up to a few thousand books.

### Usability

* The user interface is in English.
* Book data is entered in Russian, English, and German; the application must store, display, search, and sort
  text in these languages correctly (Unicode, Cyrillic, umlauts).
* Mobile layout and dark mode are not required in the first version.

### Operation

* The first version runs locally on the owner's computer; the database is hosted in the cloud (MongoDB Atlas).
* The data must be backed up regularly, so that years of reviews cannot be lost.

## 9. Error Handling

The application should provide clear feedback when an operation fails.

Possible failures include:

* The online book catalog is unavailable or finds nothing
* A cover image cannot be loaded
* The book no longer exists

Error messages should be clear and non-technical; technical details should be logged on the server.

## 10. Destructive Actions

Destructive or potentially disruptive actions should require explicit confirmation.

Confirmation should be presented using a modal.

Examples include:

* Delete a book

The confirmation should clearly describe the action being performed and, where applicable, its consequences.

## 11. Non-Goals

The initial version of the application is not intended to provide functionality for:

* Login and multiple users
* Reminders and notifications
* Sharing books with other users or discussing them
* Importing data from other services (e.g. Goodreads, LiveLib)
* Mobile layout and dark mode

Features outside of this scope should not be implemented unless explicitly requested.

## 12. Future Ideas

Potential future functionality may include:

* Multiple users with login
* Sharing books with other users and discussing them

Future ideas should not be implemented unless explicitly requested.

## 13. Open Questions

* Which online book catalog has the most complete data for Russian, English, and German books
  (e.g. Google Books, Open Library)? To be checked before implementing the search; possibly combine several.
