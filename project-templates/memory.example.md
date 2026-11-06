<!--
  TEMPLATE: Copy this file into the new project as `docs/memory.md`.
  This file is LOCAL ONLY: add `docs/memory.md` to `.gitignore` before the first commit.
  It may contain details that do not belong in a repository (server addresses, paths, installation state),
  but never secrets (passwords, keys, tokens).

  Purpose: working agreements and a short, dated history of decisions. Details live in the other documents;
  this file only records what is not obvious from them and points to where things are described.

  1. Replace every `TODO`, remove rows and sections that do not apply.
  2. Delete all HTML comments (including this one).
  Check for leftovers with: grep -n "TODO\|<!--" docs/memory.md
-->
# Project Memory

Local only (gitignored, not published). Working agreements and a short history of decisions. Details live in the other documents; this file only records
what is not obvious from them and points to where things are described. Keep entries short and dated.

<!-- Remove rows for documents the project does not use. -->
| Topic | Document |
|---|---|
| What the application should do | `requirements.md` |
| How it is built and why | `architecture.md` |
| Installation, updates, operation | `deployment.md` |
| Rules for working on the project | `../CLAUDE.md` |

## Working agreements

<!--
  Prefilled with the template author's default agreements; they are a matter of taste.
  Adjust, remove, and add project-specific ones (commands, test approach).
-->
- Features are built in phases: plan → user's approval → implementation → tests → verification → report.
- Commits only when the user asks for them. Before each commit, the changed files are checked for secrets.
- Backend tests mock the database (Mockito); no Testcontainers or real database. Run them with `./mvnw test` in `backend/`.
- Frontend checks: `npm run lint` and `npm run build` in `frontend/`.
- Infrastructure changes on the server (deployments included) only with the user's go-ahead for that specific change.
- TODO

<!-- OPTIONAL: Keep once the application is deployed. Update the "Last deployment" row after each deployment. -->
## Current installation

| | |
|---|---|
| Server | TODO (address, OS, SSH user) |
| Directory | TODO |
| URL | TODO |
| Database | TODO (production database; development uses TODO) |
| First deployment | TODO (date, commit) |
| Last deployment | TODO (date, commit, what changed) |

<!--
  OPTIONAL: Keep this section if the development host and the environment Claude Code runs in differ
  (e.g. Windows host + Docker sandbox). Otherwise delete it.
-->
## Development environment

- The development host is TODO (e.g. Windows 11); Claude Code runs in TODO (e.g. a Docker sandbox with the project mounted).
- If `frontend/node_modules` is installed on the host, run `npm install` there after dependency changes; installing from
  a different environment (e.g. the sandbox) would replace the platform-specific binaries.
- TODO (e.g. where SSH keys are located, which external services are needed locally)

## Decision log

<!--
  One row per decision, newest at the bottom. Short summary only; details belong in the referenced document.
  Also record things that went wrong or were surprising (e.g. "Atlas user needed readWrite on the new database").
-->
| Date | Decision | Details |
|---|---|---|
| TODO (YYYY-MM-DD) | TODO | `architecture.md` → TODO |

## Open points

<!-- Postponed features, known limitations, things to revisit later. -->
- TODO
