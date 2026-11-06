<!--
  TEMPLATE: Copy this file into the new project's root as `CLAUDE.md`.
  1. Replace every `TODO` and adjust the prefilled defaults (tech stack, commands) to the new project.
  2. Remove sections marked as optional if they do not apply.
  3. Delete all HTML comments (including this one) — Claude reads the raw file.
  The prefilled rules (Architecture, Development Principles, Claude Code Workflow, Git, Security) are the
  template author's defaults and a matter of taste: keep, loosen, or tighten them to fit your way of working.
  Check for leftovers with: grep -n "TODO\|<!--" CLAUDE.md
-->
# Project Instructions

## Project

<!-- One or two sentences: what is it, for whom, inspired by what? -->
TODO: Short project description.

## Project Structure

<!-- Top-level folders only. Remove or add entries as needed. -->
- `/frontend` — React frontend application
- `/backend` — Spring Boot backend application
- `/docs` — project requirements and documentation

## Documentation

<!-- Remove entries for documents the project does not use. -->
- `docs/requirements.md` — what the application should do. Read the relevant sections before implementing a feature.
- `docs/architecture.md` — architecture decisions and their reasons. Update it when a decision changes.
- `docs/deployment.md` — how to install, update, and operate the application.
- `docs/memory.md` — local only (gitignored). Working agreements and a short, dated history of decisions.

If a requested change conflicts with these documents, point out the conflict before implementing it.

## Tech Stack

<!-- Prefilled with an example default stack; the versions are examples too. Check current versions and remove what the project does not use. -->

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS v4

### Backend

- Java 25
- Spring Boot 4.1.1
- Maven
- Lombok
- Spring Web
- Spring Data MongoDB

### Infrastructure

<!-- Database, hosting, deployment target, external services. -->
- MongoDB
- TODO: Deployment target (e.g. Docker on a Debian 12 server)

## Commands

<!-- Verify that these commands work in the new project. Claude uses them for verification. -->

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
<!-- Add project-specific architecture rules here, e.g. authentication approach, API conventions. -->

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

<!--
  OPTIONAL: Keep this section if the application manages remote infrastructure
  (servers, Docker, SSH, cloud resources). Otherwise delete it.
-->
## Infrastructure

TODO: Describe what infrastructure the application manages and how it is accessed (e.g. a remote Debian 12 server via SSH).

- Treat remote infrastructure operations as potentially destructive.
- Never perform destructive infrastructure operations without explicit user intent.
- Do not remove resources (e.g. containers, images, volumes, networks) unless explicitly requested.
- Prefer read-only inspection when investigating the remote infrastructure.

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

<!--
  OPTIONAL: Keep this section if the development host, the environment Claude Code runs in, and the deployment
  target differ (e.g. Windows host + Docker sandbox + Linux server). Otherwise delete it.
-->
## Development Environment

- Local development host: TODO (e.g. Windows 11, macOS, Linux).
- Claude Code runs in: TODO (e.g. directly on the host, inside a Docker sandbox).
- TODO: Where the application is deployed (e.g. "The application is deployed to a remote Debian 12 server.").
- Do not assume that commands available on the development host are available inside the Claude Code environment.
- Prefer commands and tooling available within the current execution environment.
- When environment-specific behavior matters, explicitly distinguish between the development host, the Claude Code environment, and the deployment target.
