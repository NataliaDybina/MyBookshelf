# Project Instructions

## Project

My Bookshelf is a personal library of books read, currently being read, and wanted, with personal reviews,
covers and descriptions loaded from an online book catalog, and notes on where each book came from.
Single user for now, without login.

## Project Structure

- `/frontend` — React frontend application
- `/backend` — Spring Boot backend application
- `/docs` — project requirements and documentation

## Documentation

- `docs/requirements.md` — what the application should do. Read the relevant sections before implementing a feature.
- `docs/architecture.md` — architecture decisions and their reasons. Update it when a decision changes.
- `docs/memory.md` — local only (gitignored). Working agreements and a short, dated history of decisions.

If a requested change conflicts with these documents, point out the conflict before implementing it.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4

### Backend

- Java 25
- Spring Boot 4.1.2
- Maven
- Lombok
- Spring Web
- Spring Data MongoDB

### Infrastructure

- MongoDB Atlas (cloud database)
- Runs locally on the developer's computer (no server deployment yet)
- External book catalog API (see `docs/architecture.md` → Book Search)

## Commands

### Backend (in `backend/`)

- Run tests: `./mvnw test`
- Build: `./mvnw clean package`
- Start locally: `./mvnw spring-boot:run`

### Frontend (in `frontend/`)

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Build (includes type check): `npm run build`

## Architecture

- Keep business logic outside controllers.
- Use Controller → Service → Repository where applicable.
- Do not introduce layers or abstractions without a concrete reason.
- Frontend communicates with the backend through HTTP.
- During local development, use the Vite development proxy to avoid unnecessary CORS configuration.
- The frontend never calls the external book catalog directly; all catalog requests go through the backend.
- Every stored book belongs to a user (`userId`), even though there is only one user and no login yet.
- All text (titles, authors, reviews) may be in Russian, English, or German; never assume ASCII.

## Development Principles

- Prefer simple solutions over unnecessary abstractions.
- Inspect the existing codebase before introducing new patterns or dependencies.
- Prefer existing project conventions over personal preferences.
- Preserve existing functionality unless a change explicitly requires modifying it.
- Avoid unnecessary refactoring.
- Prefer incremental changes over large rewrites.
- Keep changes focused on the requested task.
- Do not modify unrelated code.
- Do not introduce new frameworks without discussing it first.
- Do not add new dependencies without a concrete reason.

## Security

- Never commit secrets, credentials, API keys, private keys, or `.env` files.
- Never print secrets or private keys in logs or command output.
- Never expose credentials in source code.
- Never modify or expose SSH private keys.
- Use environment variables or local configuration for secrets.

## Verification

After making changes:

- Run relevant frontend type checks, linting, and builds.
- Run relevant backend tests and builds.
- Verify both frontend and backend when a change affects their integration.
- Do not consider a task complete if relevant verification fails.

## Claude Code Workflow

- For non-trivial changes, first inspect the relevant code and propose an implementation plan.
- Wait for approval before implementing non-trivial changes.
- Small, obvious changes may be implemented directly when explicitly requested.
- Before implementing larger features, inspect the existing architecture and relevant requirements.
- Do not claim a task is complete without verifying the result.

## Git

- Keep changes logically focused.
- Do not modify Git history unless explicitly requested.
- Never commit changes unless explicitly requested.
- Never commit secrets.
