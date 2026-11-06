<!--
  TEMPLATE: Copy this file into the new project as `docs/architecture.md`.
  Purpose: HOW the application is built and WHY — decisions that complement `requirements.md`.
  Requirements describe what the application should do; this file records the technical decisions behind it.

  How to write entries:
  - One section per topic or feature area, short bullet points.
  - Record the decision and, where not obvious, the reason ("..., because ...").
  - Record limits, defaults, and what is deliberately NOT supported.
  - Update the section when a decision changes; do not keep outdated decisions here (history goes to `memory.md`).

  1. Replace every `TODO`, adjust the prefilled defaults, remove sections that do not apply.
  2. Sections are usually added feature by feature while the project grows — it is fine to start almost empty.
  3. Delete all HTML comments (including this one).
  The prefilled bullets (Deployment, Configuration & Secrets, Frontend Conventions, Error Handling, Testing) reflect the
  default stack (React/Vite/Tailwind, Spring Boot/MongoDB): adjust or delete them if the project differs.
  Check for leftovers with: grep -n "TODO\|<!--" docs/architecture.md
-->
# Architecture Decisions

Decisions that complement `requirements.md`. Update this file when a decision changes.

## Deployment

<!--
  - Where and how does the application run in production (Docker container, server, port, HTTP/HTTPS)?
  - How is it built and updated? Is the frontend served by the backend or separately?
  - Which database is used in production, and is it separate from development?
  Details on installation and updates may go to a separate `docs/deployment.md`.
-->
- TODO
- During local development, the Vite dev server proxies `/api` to the backend.

## Configuration & Secrets

- Secrets are provided via environment variables.
- For local development, the backend loads the project-root `.env` (see `.env.example`, which you create in the project and which lists all variables without real values).
- `.env` files and keys are never committed.

<!-- OPTIONAL: Delete if the application has no user accounts. -->
## Authentication

<!--
  - Sessions (cookie + CSRF) or tokens? Where are sessions stored, and do they survive a restart?
  - Login/logout/current-user endpoints.
  - Password hashing and rules (length), username rules (case sensitivity).
  - How is the first administrator created?
  - Protection against brute force (limits for failed logins)?
  - What is postponed (e.g. password reset via email)?
-->
- TODO

<!-- OPTIONAL: Delete if all users have the same rights. -->
## Authorization

<!--
  - Are permissions fixed codes in code or stored in the database? How are roles stored?
  - Is there a superuser that bypasses permission checks?
  - Safeguards (e.g. the last admin cannot be deleted or demoted).
-->
- TODO
- Permission checks are enforced in the backend; the frontend only hides unavailable actions.

## TODO: Feature Area

<!--
  Copy this section once per feature area (named like the matching section in `requirements.md`).
  Typical content:
  - Data storage: collection/table, fields, limits, unique indexes.
  - API endpoints with the required permission (table or list).
  - Rules and edge cases (idempotency, conflicts → 409, timeouts, limits).
  - What is deliberately not supported, and why.
  - Frontend notes (pages, confirmations, refresh behavior).
-->
| Endpoint | Permission | Behavior |
|---|---|---|
| `GET /api/TODO` | `TODO` | TODO |

- TODO

<!-- OPTIONAL: Shared UI decisions. Adjust or delete. -->
## Frontend Conventions

- Theme colors (light and dark mode) are defined once in `frontend/src/index.css`; components use these colors
  instead of hard-coded ones.
- Small screens are covered with Tailwind breakpoints; the main breakpoint is `md` (768 px).
- Pages load data once and are refreshed manually (no polling) unless a feature requires live updates.
- TODO

## Error Handling

- API errors use RFC 9457 `ProblemDetail`.
- Validation errors include an `errors` object (field name → message).
- Technical details are included only for administrators.

## Testing

- Backend tests mock the database (Mockito); no database or other infrastructure is needed to run them.
- Controller and security behavior is tested with MockMvc against the full application context.
