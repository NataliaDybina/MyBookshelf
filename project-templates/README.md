# Project Templates

Templates for the documents that give Claude Code (and humans) the context of a new project: what to build,
how it is built, how it is deployed, and how to work on it.

## Files

| Template | Copy to | Purpose |
|---|---|---|
| `CLAUDE.example.md` | `CLAUDE.md` (project root) | Rules and context that Claude Code reads in every session |
| `requirements.example.md` | `docs/requirements.md` | What the application should do |
| `architecture.example.md` | `docs/architecture.md` | How it is built and why |
| `deployment.example.md` | `docs/deployment.md` | How to install, update, and operate it |
| `memory.example.md` | `docs/memory.md` | Working agreements and a dated decision log (local only) |

Only the template files you need have to be used; `deployment` and `memory` are optional for small projects.

## Usage

1. Copy the templates into the new project (see the table) and drop the `.example` from the file name.
2. Add `docs/memory.md` to the project's `.gitignore` **before the first commit**.
3. Fill in the files, roughly in this order: `requirements` → `CLAUDE.md` → `architecture` → `deployment` → `memory`.
   Each template starts with an HTML comment that explains how to fill it in.
4. Delete all HTML comments; Claude reads the raw files.
5. Check for leftovers, e.g. `grep -rn "TODO\|<!--" CLAUDE.md docs/` (deployment also uses `<app>` as a placeholder).

## Defaults you may want to change

The templates are prefilled with the author's defaults. Replace them if your project differs:

- **Stack:** React, TypeScript, Vite, Tailwind CSS v4 (frontend); Java 25, Spring Boot, Maven, MongoDB (backend).
  The versions are examples; check the current ones.
- **Deployment:** Docker Compose on a Linux server. The files it refers to (`docker-compose.yml`, Dockerfiles,
  `.env.example`, `.env.production.example`) are not included and must be created in the project.
- **Workflow rules:** Claude proposes a plan and waits for approval before non-trivial changes, and never commits
  unless asked. This is a matter of taste; loosen or tighten the rules in `CLAUDE.md` and `memory.md`.
- **Development environment:** The optional sections describe a split setup (development host vs. Claude Code
  sandbox vs. deployment target). Delete them if everything runs in one place.
