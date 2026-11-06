<!--
  TEMPLATE: Copy this file into the new project as `docs/requirements.md`.
  1. Replace every `TODO`. The hints in HTML comments list questions the section should answer.
  2. Remove sections marked as optional if they do not apply, then renumber the headings.
  3. Delete all HTML comments (including this one).
  Check for leftovers with: grep -n "TODO\|<!--" docs/requirements.md
  Wording: "must" = mandatory, "should" = expected, "may" = optional.
-->
# Requirements

## 1. Project Overview

<!-- What is the application, who uses it, and which problem does it solve? Inspired by existing products? -->
TODO: Short description of the application.

TODO: The main purpose in one or two sentences.

## 2. Goals

<!-- Outcomes, not features: what should be possible or easier once the application exists? -->
* TODO
* TODO
* TODO

## 3. Core Features

<!-- Short list of all features. Each larger feature gets its own section below. -->
* TODO
* TODO
* TODO

## 4. TODO: Feature Area

<!--
  Copy this section once per feature area (e.g. Dashboard, Details Page, Management).
  Questions to answer:
  - What is the purpose of this area?
  - What information must be displayed (at least)?
  - Which actions are available, and who may perform them?
  - Which rules, limits, or edge cases apply?
-->
TODO: Purpose of this area.

The page should display at least:

* TODO

Users should be able to:

* TODO

Only actions allowed by the user's permissions should be available.

### TODO: Subsection

TODO

<!-- OPTIONAL: Delete if the application has no user accounts. -->
## 5. Authentication

<!--
  - How do users log in (username/password, OAuth, ...)? Where are users stored?
  - Can users register themselves, or are they created by an administrator?
  - How are passwords reset (by an administrator, by email)?
  - Is a password change required or encouraged after the first login?
-->
TODO

Stored passwords must not be retrievable in plaintext.

<!-- OPTIONAL: Delete if all users have the same rights. -->
## 6. Roles and Permissions

<!--
  - Which default roles exist, and what may each role do?
  - Are permissions fixed per role or configurable by an administrator?
-->
The application should use role-based access control.

The application should provide the following default roles:

### TODO: Role

* TODO

### TODO: Role

* TODO

<!-- OPTIONAL: Delete if the application has no administration area. -->
## 7. Admin Area

<!-- Which administrative functions exist (user management, settings, system information, audit log, ...)? -->
The application should provide a dedicated Admin Area.

The Admin Area should provide access to:

* TODO

## 8. Non-Functional Requirements

<!-- Remove items that do not matter for this project; add project-specific ones. -->

### Security

* TODO (e.g. authentication required for all pages except login, secrets only via environment variables)

### Performance

* TODO (e.g. expected number of users or data volume, acceptable response times)

### Usability

* TODO (e.g. usable on mobile devices, light and dark mode, language of the user interface)

### Operation

* TODO (e.g. deployment as a Docker container, backups, logging)

## 9. Error Handling

The application should provide clear feedback when an operation fails.

Possible failures include:

* TODO (e.g. external service unavailable, resource no longer exists, permission denied)

Normal users should receive a clear but non-technical error message.

Administrators may be shown additional technical information to assist with troubleshooting.

Technical error details should not be unnecessarily exposed to normal users.

## 10. Destructive Actions

<!-- Default assumption (confirmation via modal): adjust if the project works differently. -->
Destructive or potentially disruptive actions should require explicit confirmation.

Confirmation should be presented using a modal.

Examples include:

* TODO (e.g. delete user, delete data that cannot be restored)

The confirmation should clearly describe the action being performed and, where applicable, its consequences.

## 11. Non-Goals

<!-- What is explicitly out of scope? This keeps Claude from building features nobody asked for. -->
The initial version of the application is not intended to provide functionality for:

* TODO

Features outside of this scope should not be implemented unless explicitly requested.

## 12. Future Ideas

<!-- Ideas for later versions. They help with design decisions but are not part of the current scope. -->
Potential future functionality may include:

* TODO

Future ideas should not be implemented unless explicitly requested.

## 13. Open Questions

<!-- Decisions that are still open. Remove entries once they are decided and documented above or in docs/architecture.md. -->
* TODO
