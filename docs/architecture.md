# Architecture Decisions

Decisions that complement `requirements.md`. Update this file when a decision changes.

## Deployment

- The application runs only locally for now: the backend with `./mvnw spring-boot:run`, the frontend with the
  Vite dev server. There is no server deployment yet.
- During local development, the Vite dev server proxies `/api` to the backend.
- The database is a MongoDB Atlas cluster (cloud). There is no separate production database yet.

## Configuration & Secrets

- Secrets are provided via environment variables.
- For local development, the backend loads the project-root `.env` (see `.env.example`, which lists all variables
  without real values).
- `.env` files and keys are never committed.

## Users

- There is no login in the first version. The backend uses one fixed default user.
- Every book document stores a `userId`, and every query filters by it, so that multiple users and login can be
  added later without migrating the data structure.

## Books

- Collection `books`; one document per book, including its wish-list notes, review, and source.
- Fields: `userId`, `title`, `authors` (list), `coverUrl`, `description`, `genres` (list), `status`
  (`WANT_TO_READ`, `READING`, `READ`), `currentPage`, `pageCount`, `format` (`PAPER`, `EBOOK`, `AUDIOBOOK`),
  `rating` (1–5), `review`, `source` (see below), `wishReason`, `recommendedBy`, `addedAt`, `finishedAt`,
  `catalogId` (ID in the external catalog, if the book was taken from it).
- `source`: embedded object with `type` (`OWN`, `LIBRARY`, `BORROWED`), `from` (library or person, free text),
  and `returned` (boolean; only for `LIBRARY` and `BORROWED`).
- `addedAt` is set by the backend on creation. `finishedAt` is set when the status changes to `READ`, if it is
  still empty; it can be edited.
- Genres are taken over from the catalog as plain strings and can be edited freely; there is no fixed genre list.
- Search by title and author is case-insensitive; for a personal library (up to a few thousand books) a simple
  query without a text index is sufficient.

| Endpoint | Behavior |
|---|---|
| `GET /api/books` | List books; filters: `q` (title/author), `genre`, `status`, `source` |
| `GET /api/books/{id}` | Book details |
| `POST /api/books` | Create a book |
| `PUT /api/books/{id}` | Update a book |
| `DELETE /api/books/{id}` | Delete a book (confirmed in the frontend with a modal) |
| `GET /api/books/genres` | All genres in use (for the filter) |

## Book Search

- The backend searches the external catalog and returns a simplified list of results (title, authors, cover URL,
  description, genres, page count, catalog ID). The frontend never calls the catalog directly, so a possible API
  key stays on the server.
- The catalog is not decided yet (see `requirements.md` → Open Questions). Candidates: Google Books, Open Library.
  The search is behind one service interface, so the catalog can be replaced or several can be combined.

| Endpoint | Behavior |
|---|---|
| `GET /api/catalog/search?q=...` | Search the external catalog by title, author, or ISBN |

## Covers

- Only the cover URL from the catalog is stored; images are not downloaded. The user can replace the URL.
- If a cover cannot be loaded, the frontend shows a placeholder.
- Downloading and storing covers locally may be added later if links turn out to break.

## Backups

- The database is backed up regularly with `mongodump` against the Atlas cluster; the dump is stored outside the
  project folder.
- TODO: Backup schedule and storage location; check whether the Atlas tier includes automatic backups
  (the free M0 tier does not).

## Frontend Conventions

- Theme colors are defined once in `frontend/src/index.css`; components use these colors instead of hard-coded ones.
- Pages load data once and are refreshed manually (no polling).
- The UI is in English; mobile layout and dark mode are not required in the first version.

## Error Handling

- API errors use RFC 9457 `ProblemDetail`.
- Validation errors include an `errors` object (field name → message).
- The backend locale is fixed to English (`spring.web.locale-resolver: fixed`), so messages match the English UI
  regardless of the browser or system language.
- Technical details are logged on the server and not shown in the UI.
- If the external catalog is unavailable, the backend returns `502` and the user can still add the book manually.

## Testing

- Backend tests mock the database (Mockito); no database or other infrastructure is needed to run them.
- The external catalog client is mocked in tests; tests never call the real catalog.
- Controller behavior is tested with MockMvc against the full application context.
