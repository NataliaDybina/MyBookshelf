<!--
  TEMPLATE: Copy this file into the new project as `docs/deployment.md`.
  Purpose: how to install, update, and operate the application — written so the steps can be followed
  without reading the code. Technical decisions behind the deployment belong in `architecture.md` → Deployment,
  the current installation state (server, last deployed commit) in `memory.md`.

  Prefilled with the default setup: Docker Compose on a Linux server, built on the server, code copied via SSH.
  If the project is deployed differently (no Docker, a PaaS, another build flow), replace the affected sections.
  The files this document refers to are not part of the templates; create them in the project:
  - `docker-compose.yml` and the Dockerfiles (backend, frontend) that build and start the application,
  - `.env.production.example`: every environment variable the application reads in production, without real values.
  This file may be committed: use placeholders like `<server>` instead of real addresses, never secrets.

  1. Replace every `TODO` and every `<app>` (directory and service name), adjust the defaults.
  2. Delete all HTML comments (including this one).
  Check for leftovers with: grep -n "TODO\|<!--\|<app>" docs/deployment.md
-->
# Deployment

<!-- One or two sentences: where does the application run, how is it reachable (port, HTTP/HTTPS, local network or internet)? -->
TODO: The application runs as a Docker container on `<server>`.
It is reachable at `http://<server>:TODO`.

## Requirements on the server

<!-- Everything that must exist before the first installation: software, users, network access, external services. -->
- Docker Engine with the Compose plugin (`docker compose version`)
- A user in the `docker` group to run the commands
- Internet access during the build (base images, npm and Maven dependencies)
- TODO: Database access (e.g. MongoDB Atlas: the server's public IP is allowed under "Network Access", the database
  user has `readWrite` on the production database)
- TODO: Port forwarding / firewall (e.g. the port must **not** be forwarded to the internet by the router)

## First installation

```bash
# 1. Copy the project to the server (no Git repository needed), e.g. from the development machine:
tar --exclude=node_modules --exclude=target --exclude=dist --exclude=.git --exclude=.idea \
    --exclude='.env' --exclude='id_*' --exclude='*_ed25519*' -czf - . \
  | ssh <user>@<server> 'mkdir -p ~/<app> && tar -xzf - -C ~/<app>'

# 2. On the server: create the configuration (never commit it)
cd ~/<app>
cp .env.production.example .env
chmod 600 .env
# edit .env: TODO (list the variables that must be set, e.g. database URI, initial admin)

# 3. Build and start
docker compose up -d --build

# 4. Check
docker compose ps
docker compose logs -f <app>     # until TODO (log line that shows a successful start)
```

<!-- What has to be done after the first start (e.g. log in with the initial admin and change its password)? -->
TODO

## Updates

```bash
# Copy the new version (same command as step 1), then on the server:
cd ~/<app>
docker compose up -d --build
docker image prune -f        # removes the previous image
```

<!-- Steps that are needed for some updates only (e.g. new environment variables, data migrations). -->
TODO

## Operation

| Task | Command (in `~/<app>`) |
|---|---|
| Status | `docker compose ps` |
| Logs | `docker compose logs -f <app>` |
| Restart | `docker compose restart <app>` |
| Stop | `docker compose down` |

## Notes

<!--
  Things an operator should know: behavior after restarts (e.g. sessions lost), security implications,
  limitations without HTTPS, backups.
-->
- TODO
