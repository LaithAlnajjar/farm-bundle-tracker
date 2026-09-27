# Deploying Farm Bundle Tracker to AWS Lightsail

This chapter explains how to deploy Farm Bundle Tracker to one Ubuntu-based
AWS Lightsail instance. Its purpose is to build a reusable mental model of a
small production deployment, not to provide an unattended installation
script.

The final system deliberately stays small:

- Nginx runs directly on Ubuntu and is the only public web server.
- The NestJS API and PostgreSQL run in Docker Compose.
- Nginx serves the built Vite files from the host filesystem.
- PostgreSQL data lives in a Docker volume on the Lightsail disk.
- DNS points two hostnames at one Lightsail static IP.

The examples use `app.example.com` and `api.example.com`. Replace those names,
paths, usernames, and secrets with real values before using any configuration.

## Guided deployment path: what to do next

The rest of this chapter explains each part of the system in depth. This
section is the linear runbook: follow it from top to bottom for the first
deployment, and use the verification checkpoint at the end of each phase
before moving on.

Do not try to configure DNS, Docker, Nginx, TLS, and PostgreSQL simultaneously.
Each phase introduces one boundary and proves it works. When something fails,
the most recent boundary is then the likely cause.

### Phase 0: decide and record the deployment values

Before changing code or creating AWS resources, choose the values that every
later configuration will use:

| Decision | Example used in this guide |
| --- | --- |
| Frontend hostname | `app.example.com` |
| API hostname | `api.example.com` |
| Lightsail region | A region near the application's users |
| Initial bundle | Ubuntu LTS with at least 1 GB RAM |
| API internal port | `3000` |
| Database name | `farm_bundle_tracker` |
| Deployment user | `deploy` |
| Repository path | `/srv/farm-bundle-tracker/repository` |
| Frontend path | `/var/www/farm-bundle-tracker/current` |

Write the real values in private deployment notes. Inconsistent hostnames and
paths are a common source of errors because DNS, Certbot, Nginx, CORS, cookies,
and the Vite build all need to agree.

**Checkpoint:** you own or control the domain and have selected the two real
hostnames, but no DNS records need to exist yet.

### Phase 1: make the repository deployable locally

Do this before renting infrastructure. The server should receive code that is
already known to build and start.

1. Correct `apps/backend/package.json`:

   ```json
   "start:prod": "DOTENV_CONFIG_PATH=../../.env node dist/src/main.js"
   ```

2. Make the API's container listen address explicit in
   `apps/backend/src/main.ts`:

   ```ts
   const port = Number(process.env.PORT ?? 3000);
   await app.listen(port, '0.0.0.0');
   ```

3. Add the production deployment files described later in this chapter:

   ```text
   deploy/backend.Dockerfile
   compose.production.yml
   .dockerignore
   ```

   Keep the existing `docker-compose.yml` for local development. Development
   publishes PostgreSQL to the host; production deliberately does not.

4. At minimum, exclude these things from the Docker build context:

   ```dockerignore
   .git
   **/node_modules
   **/dist
   coverage
   .env
   .env.*
   !.env.example
   npm-debug.log*
   ```

5. Run the same checks that should later guard a deployment:

   ```bash
   npm ci
   npm test -w backend -- --runInBand
   npm run build -w backend
   npm run build -w frontend
   npm run start:prod -w backend
   ```

   The final command needs valid temporary backend environment variables and a
   database connection string. Its purpose is to prove that the generated
   JavaScript starts, not to run a development server permanently.

6. Build the backend image locally:

   ```bash
   docker build \
     --file deploy/backend.Dockerfile \
     --tag farm-bundle-tracker-api:local \
     .
   ```

If this phase fails, fix the repository rather than compensating with an
ad-hoc server command. A deployment should be reproducible from committed
configuration.

**Checkpoint:** tests and both builds pass, the corrected production entry
point starts, and Docker can build the API image. Commit these deployment
changes before touching the server.

### Phase 2: create the Lightsail network foundation

1. Create an Ubuntu LTS Lightsail instance with at least 1 GB RAM.
2. Attach a Lightsail static IP. Do not point DNS at the default dynamic IP.
3. Configure Lightsail's IPv4 firewall:

   ```text
   TCP 22  → your trusted public IP or range
   TCP 80  → anywhere
   TCP 443 → anywhere
   ```

4. If IPv6 is enabled, either configure its firewall intentionally or avoid
   publishing `AAAA` DNS records for now.
5. Create DNS `A` records for both hostnames pointing at the static IP.

DNS changes can take time because resolvers cache records. Check the result
from your own computer:

```bash
dig +short app.example.com
dig +short api.example.com
```

Both should return the Lightsail static IP. Certbot will fail later if public
DNS does not lead to this server.

**Checkpoint:** you can SSH to the static IP, both DNS names resolve to it, and
ports 3000 and 5432 have not been added to the Lightsail firewall.

### Phase 3: prepare and secure Ubuntu

Connect initially with the Lightsail-provided Ubuntu account and SSH key. Then:

1. Install current package and security updates.
2. Create a `deploy` user, give it the required administrative access, and
   install your SSH public key for that user.
3. Open a second terminal and prove `ssh deploy@<STATIC_IP>` works before
   tightening the original account or SSH configuration.
4. Configure UFW in this order:

   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   sudo ufw status verbose
   ```

5. Install Nginx.
6. Install Docker Engine and the Compose plugin from Docker's supported Ubuntu
   repository.
7. Install Node.js 24 and npm if builds will happen on this server. If builds
   will happen in CI or a container, a host Node installation is unnecessary.
8. Install Certbot using its current official Nginx-on-Linux instructions.
9. Decide whether the deployment user will run Docker through `sudo` or be
   added to the root-equivalent `docker` group.
10. Reboot once.

After reboot, inspect rather than assume:

```bash
systemctl status nginx
systemctl status docker
docker compose version
sudo ufw status verbose
```

The default Nginx page may now be visible. That proves DNS, firewalls, and
Nginx can connect, even though the application is not deployed yet.

**Checkpoint:** SSH still works, Nginx and Docker survive a reboot, and only
22, 80, and 443 are reachable from outside.

### Phase 4: create application directories and secrets

Create the directory layout described in the server-preparation section:

```text
/srv/farm-bundle-tracker/repository
/srv/farm-bundle-tracker/backups
/var/www/farm-bundle-tracker/releases
/etc/farm-bundle-tracker/backend.env
/etc/farm-bundle-tracker/postgres.env
```

Clone the repository into `/srv/farm-bundle-tracker/repository` as the
deployment user. Do not clone it as root and then make every future deployment
depend on `sudo`.

The database environment file should contain only database initialization
values:

```dotenv
POSTGRES_USER=farm
POSTGRES_PASSWORD=replace-with-a-strong-random-password
POSTGRES_DB=farm_bundle_tracker
```

The backend environment file should contain runtime values:

```dotenv
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://farm:URL_ENCODED_PASSWORD@postgres:5432/farm_bundle_tracker
JWT_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://app.example.com
REFRESH_COOKIE_SAME_SITE=lax
REFRESH_COOKIE_PATH=/auth
```

Use the real domains selected in Phase 0. Ensure the database password is URL
encoded in `DATABASE_URL`. Give the files restrictive permissions, such as
mode `600`, and never copy them into the Git checkout or Docker image.

Place the committed `compose.production.yml` in the repository. Its API
service should read `backend.env`; its PostgreSQL service should read
`postgres.env`.

**Checkpoint:** the repository is owned by the deployment user, the two secret
files exist outside Git with restricted permissions, and
`docker compose -f compose.production.yml config` accepts the configuration.
Run that command privately because rendered configuration may contain secrets.

### Phase 5: start PostgreSQL, migrate, and start the API

Bring up one dependency at a time:

1. Start PostgreSQL:

   ```bash
   docker compose -f compose.production.yml up -d postgres
   docker compose -f compose.production.yml ps
   docker compose -f compose.production.yml logs postgres
   ```

2. Wait for its health check to pass. If it does not, fix the database before
   starting the API.
3. Build the API image from the checked-out commit:

   ```bash
   docker compose -f compose.production.yml build api
   ```

4. Apply committed migrations once:

   ```bash
   docker compose -f compose.production.yml run --rm api \
     npm run db:migrate -w backend
   ```

5. Seed the catalog on the initial deployment:

   ```bash
   docker compose -f compose.production.yml run --rm api \
     npm run db:seed:catalog -w backend
   ```

6. Start the API:

   ```bash
   docker compose -f compose.production.yml up -d api
   docker compose -f compose.production.yml ps
   docker compose -f compose.production.yml logs api
   ```

7. Test from the Lightsail host:

   ```bash
   curl http://127.0.0.1:3000
   ```

At this point the API should work locally on the server but not from the
internet. That is intentional: Nginx has not been configured as its public
entry point yet.

**Checkpoint:** PostgreSQL is healthy, migrations and the catalog seed finish
successfully, the API stays running, and the loopback request reaches NestJS.

### Phase 6: build and publish the frontend

Build with the production API URL, not the local development default:

```bash
npm ci
VITE_API_URL=https://api.example.com npm run build -w frontend
```

Publish the contents of `apps/frontend/dist` into a release directory under
`/var/www/farm-bundle-tracker/releases`. Then make `current` a symlink to that
complete release. For example, the resulting shape might be:

```text
/var/www/farm-bundle-tracker/
├── current -> releases/2026-08-10T1500Z
└── releases/
    └── 2026-08-10T1500Z/
        ├── index.html
        └── assets/
```

Build and copy the complete release before switching the symlink. This makes
the publish operation effectively atomic and keeps the previous release
available for a quick frontend rollback. Nginx needs read/execute permission
on the directory path, but it should not own or write the build files.

**Checkpoint:** `current/index.html` exists, its `assets` files exist, Nginx's
service user can read them, and the built JavaScript targets
`https://api.example.com` rather than localhost.

### Phase 7: configure Nginx over HTTP first

Do not begin with the final TLS configuration because the certificate files do
not exist yet. Start with two port-80 server blocks:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.example.com;

    root /var/www/farm-bundle-tracker/current;
    index index.html;

    location /assets/ {
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable this site, disable the default site if appropriate, and always validate
before reloading:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

From your computer, request both HTTP domains. The frontend should render and
the API root should respond. Production authentication cookies are Secure, so
do not diagnose cookie behavior over HTTP; HTTPS comes next.

**Checkpoint:** Nginx serves the frontend, proxies the API, nested frontend
routes fall back to `index.html`, and the Nginx error log remains clean.

### Phase 8: issue TLS certificates and enforce HTTPS

Now that public DNS and HTTP both work, request one certificate covering both
hostnames:

```bash
sudo certbot --nginx -d app.example.com -d api.example.com
```

Certbot proves control of the hostnames and can update Nginx. Review its
changes, then move the configuration to the final form shown in the Nginx
section: port 80 redirects to HTTPS, and separate TLS server blocks serve the
frontend and proxy the API.

Validate and reload again:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --dry-run
```

Test both `https://` URLs and confirm their certificates cover the correct
hostnames. An `http://` request should redirect to the same hostname and path
over HTTPS.

**Checkpoint:** both domains have valid HTTPS, HTTP redirects correctly, and
the renewal dry-run succeeds.

### Phase 9: test the application as a user

Infrastructure checks are necessary but not sufficient. Use the browser to
exercise the actual product:

1. Load the frontend and refresh a nested route.
2. Register or sign in.
3. Inspect the refresh cookie: it should be HttpOnly, Secure, host-only to the
   API, scoped to `/auth`, and `SameSite=Lax`.
4. Refresh the browser and confirm the session recovers.
5. Create or open a farm.
6. Read and update the board with an authorized account.
7. Confirm browser API requests use `https://api.example.com`.
8. Inspect Nginx, API, and PostgreSQL logs for unexpected errors.

If sign-in works but session refresh fails, stop and debug CORS and cookie
attributes before continuing. Do not weaken cookie security to make the test
pass.

**Checkpoint:** a real user can complete the application's core workflow over
HTTPS, including a page reload that uses the refresh cookie.

### Phase 10: configure recovery before inviting users

1. Create a manual `pg_dump -Fc` using the command in the PostgreSQL section.
2. Check that it exits successfully and produces a nonempty file.
3. Copy it to private off-server storage such as S3.
4. Schedule daily dumps and a simple retention policy.
5. Restore a dump into a disposable database and verify it.
6. Enable Lightsail automatic snapshots or define a manual snapshot routine.
7. Record where production secrets and recovery instructions are stored.

The first backup should happen before the application contains irreplaceable
friend data, not after the first incident.

**Checkpoint:** you have a recent off-server dump, have successfully tested a
restore, and know how to recreate the VM from Git, secrets, and the backup.

### Phase 11: use the routine release workflow

After the first deployment, do not repeat server provisioning, firewall, DNS,
or Certbot setup for every code change. Routine releases are narrower:

```text
pull an intentional commit
→ install locked dependencies
→ test and build
→ build the new API image
→ back up PostgreSQL
→ run one migration process
→ publish the new frontend release
→ replace the API container
→ smoke-test the product
```

Nginx only needs reloading when its configuration changes. The catalog seed
only needs running initially or when catalog data changes. A migration only
runs when the release contains unapplied migrations, although running the
idempotent migration command every release is a common way to avoid manually
guessing.

Keep a short deployment log containing the time, Git commit, migration result,
frontend release directory, API image, and smoke-test result. That small record
makes a failed release much easier to reason about.

**Checkpoint:** future code releases follow the deployment workflow in section
11 without reconfiguring the whole server.

## 1. Architecture and request flow

The production topology is:

```text
                         public Internet
                               │
                    DNS: app.example.com
                         api.example.com
                               │
                               ▼
                   Lightsail static public IP
                               │
              Lightsail firewall + Ubuntu firewall
                     allow 22, 80, and 443 only
                               │
                               ▼
                     Nginx on the Ubuntu host
                       ports 80 and 443
                         /             \
          app.example.com               api.example.com
                 │                              │
       static Vite build                 reverse proxy
      under /var/www/...                         │
                                                ▼
                                    127.0.0.1:3000 on host
                                                │
                                      Docker port mapping
                                                │
                                                ▼
                                      NestJS API container
                                                │
                                      private Compose network
                                                │
                                                ▼
                                  PostgreSQL container:5432
                                                │
                                                ▼
                                      named Docker volume
```

Each component has one clear responsibility:

- **DNS** translates a hostname into the Lightsail instance's public IP.
- **The Lightsail firewall** decides which inbound traffic can reach the VM.
- **Ubuntu's firewall** provides a second host-level allowlist.
- **Nginx** accepts HTTP and HTTPS, terminates TLS, serves static files, and
  proxies API requests.
- **NestJS** performs application logic, authentication, authorization, and
  validation.
- **PostgreSQL** owns durable relational data.
- **Docker Compose** defines and connects the API and database runtime.

The browser never connects directly to Node.js or PostgreSQL. That boundary is
important: Nginx is designed to face hostile internet traffic, while the API
and database remain private implementation details.

### Public and private ports

| Port | Service | Public? | Reason |
| --- | --- | --- | --- |
| `22` | SSH | Restricted to trusted IPs | Administrative access only |
| `80` | Nginx HTTP | Yes | Initial certificate validation and redirect to HTTPS |
| `443` | Nginx HTTPS | Yes | Normal browser traffic |
| `3000` | NestJS | No; bind to `127.0.0.1` only | Nginx is the API's public entry point |
| `5432` | PostgreSQL | No; do not publish it | Only the API should connect to the database |

There are two firewalls to think about: the Lightsail firewall outside the VM
and a host firewall such as UFW inside Ubuntu. A packet must pass both before a
host process can receive it. Neither firewall replaces correct service
binding: the API should still bind through `127.0.0.1:3000`, and PostgreSQL
should not have a host port at all.

### Why use `app.example.com` and `api.example.com`?

For this repository, separate subdomains are preferable to
`example.com` plus `example.com/api`.

The backend already exposes routes such as `/auth/refresh` and `/farms`; it
does not have a global `/api` prefix. An `/api` deployment would require Nginx
to strip that prefix carefully. More subtly, the refresh cookie currently has
a default path of `/auth`. A browser calling `/api/auth/refresh` would not send
a cookie scoped to `/auth` unless `REFRESH_COOKIE_PATH` were changed to
`/api/auth`.

With subdomains:

```text
VITE_API_URL=https://api.example.com
FRONTEND_URL=https://app.example.com
REFRESH_COOKIE_PATH=/auth
REFRESH_COOKIE_SAME_SITE=lax
```

The frontend and API are different **origins**, so CORS is still required.
However, they are the same **site** because both use HTTPS and share the
registrable domain `example.com`. That means the existing `SameSite=Lax`
policy is appropriate. The refresh cookie remains host-only to
`api.example.com`, which is a useful security boundary, and the frontend's
existing `credentials: 'include'` setting allows it to participate in the
credentialed CORS exchange.

Using one origin and an `/api` prefix is also a valid architecture. It removes
CORS and can simplify cookie policy, but it introduces URI rewriting and the
cookie-path adjustment described above. For this application, subdomains
require fewer application-specific changes and make the frontend/API boundary
more visible while learning.

**Verify the architecture:** once deployed, `ss -lntp` on the server should
show Nginx on public ports 80/443, the API on `127.0.0.1:3000`, and no public
listener on 5432.

## 2. Preparing the application for production

Production does not run TypeScript development servers. It builds immutable
artifacts and starts those artifacts with production configuration.

### Build both applications before deploying

The repository's relevant checks are:

```bash
npm ci
npm test -w backend -- --runInBand
npm run build -w backend
npm run build -w frontend
```

`npm ci` installs exactly what the lockfile describes and is preferable in a
deployment because it is deterministic. The backend build compiles TypeScript
into `apps/backend/dist`. The frontend build type-checks the application and
creates static files in `apps/frontend/dist`.

Run these checks before changing production. A failed build should stop a
deployment before the current working version is touched.

### Fix the backend production entry point

The repository currently contains this script:

```json
"start:prod": "node dist/main"
```

With the current TypeScript configuration, `nest build` emits the entry point
at `apps/backend/dist/src/main.js`. The existing script therefore fails with a
module-not-found error.

Fix the script before deployment and keep local production smoke tests pointed
at the repository-root environment file:

```json
"start:prod": "DOTENV_CONFIG_PATH=../../.env node dist/src/main.js"
```

The Docker image starts `node` directly because Compose injects its production
environment; it neither needs nor contains the repository's local `.env` file.

If the container starts from the repository root, the equivalent command is:

```bash
node apps/backend/dist/src/main.js
```

This is a good example of why a successful compilation is not enough: a
production smoke test must also start the compiled program.

It is also worth making the container binding explicit in `main.ts`:

```ts
const port = Number(process.env.PORT ?? 3000);
await app.listen(port, '0.0.0.0');
```

`0.0.0.0` means "all interfaces inside this container." It does not make the
API publicly reachable by itself. The Compose port mapping later restricts
the host side to `127.0.0.1`.

**Verify it:** after building, start the compiled entry point with a temporary
production environment and request its root route. The process should start
without invoking the Nest development CLI.

### Frontend build-time configuration

Vite replaces `import.meta.env.VITE_API_URL` while it builds the JavaScript.
The resulting files are static; Nginx cannot change that value later without
building again or introducing a separate runtime-configuration mechanism.

For this architecture, build with:

```text
VITE_API_URL=https://api.example.com
```

A common failure is building with the local default and then deploying the
files. The production browser will try to call `http://localhost:3000`, which
means the user's own computer, not the Lightsail server.

**Verify it:** inspect browser network requests after deployment. API requests
must go to `https://api.example.com`, and the built assets should not contain
the localhost API URL.

### Backend runtime configuration

The production API needs at least:

```dotenv
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://farm:ENCODED_PASSWORD@postgres:5432/farm_bundle_tracker
JWT_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://app.example.com
REFRESH_COOKIE_SAME_SITE=lax
REFRESH_COOKIE_PATH=/auth
```

Several details matter:

- `postgres` is the Compose service name. Inside the API container,
  `localhost` would mean the API container itself.
- URL-reserved characters in the database password must be percent-encoded in
  `DATABASE_URL`, even though the raw password in PostgreSQL's environment does
  not use URL encoding.
- `NODE_ENV=production` makes the refresh cookie `Secure` in the current auth
  configuration. A Secure cookie is sent only over HTTPS.
- `FRONTEND_URL` must be the exact browser origin, including `https://` and no
  path. The backend accepts a comma-separated list if another trusted frontend
  is added later.
- Keep `JWT_SECRET` stable across deployments. Generate it from a
  cryptographically secure random source and do not commit it.

The backend already enables credentialed CORS and the frontend already uses
`credentials: 'include'`. Nginx should not add a second set of CORS headers;
the application is the source of truth for allowed origins.

### Cookie behavior to understand

The refresh cookie is:

- `HttpOnly`, so JavaScript cannot read it;
- `Secure` in production, so it requires HTTPS;
- `SameSite=Lax` by default;
- scoped to `/auth` by default;
- host-only because no `Domain` attribute is set.

The access token is held in frontend memory and sent as a bearer token. The
refresh cookie allows the frontend to recover a session without exposing the
refresh token to JavaScript.

If authentication works immediately after sign-in but fails after a refresh,
inspect the browser's cookie view and the `/auth/refresh` request. Typical
causes are an incorrect cookie path, an HTTP URL with `Secure` cookies, an
incorrect `FRONTEND_URL`, or a missing `credentials: 'include'`.

### Migrations and seeds

Migrations change database structure; seeds create expected reference data.
They are deployment operations, not API startup side effects.

Use the committed Drizzle migrations:

```bash
npm run db:migrate -w backend
```

Run the catalog seed initially and whenever its committed catalog data changes:

```bash
npm run db:seed:catalog -w backend
```

The catalog seed is designed to validate and write transactionally and is safe
to rerun. It is still conceptually separate from schema migration, and there is
no need to run it on every restart.

For this single-server application, a short maintenance window is reasonable:
take a backup, stop the API if the migration is destructive, run one migration
process, and then start the new API. Larger systems need backward-compatible
migrations because old and new application versions overlap; this deployment
does not need that complexity yet.

**Verify it:** check the migration command's exit status, inspect the Drizzle
migration journal, and exercise a database-backed API route after the API
restarts. A running process does not prove that the schema is correct.

### Secrets management

Store production environment files outside the Git checkout, for example:

```text
/etc/farm-bundle-tracker/
├── backend.env
└── postgres.env
```

Make them readable only by root and the deployment operator as needed. Do not
copy them into a Docker image, commit them, print them in deployment logs, or
include them in a frontend build. Any `VITE_` variable is public because it is
compiled into browser JavaScript.

Maintain a secure off-server copy of the values needed for recovery. Losing
the only copy of the database password or JWT secret turns an ordinary server
loss into an application recovery problem.

## 3. Preparing the Lightsail server

Initial server preparation creates a stable, restricted place where later
deployments can be routine.

### Create the instance and static IP

Choose a current Ubuntu LTS blueprint in a region that is reasonably close to
the users. One GB of memory is a sensible starting point for Nginx, one Node
process, and a small PostgreSQL instance. Monitor it rather than assuming it is
enough forever. A small swap file can reduce abrupt out-of-memory failures,
but it is not a substitute for RAM.

Attach a Lightsail static IP before configuring DNS. A default Lightsail public
IP can change when an instance is stopped and restarted; the static IP gives
DNS a durable target.

Create these DNS records:

```text
app.example.com  A  <LIGHTSAIL_STATIC_IPV4>
api.example.com  A  <LIGHTSAIL_STATIC_IPV4>
```

Only add `AAAA` records after IPv6 is intentionally configured in Lightsail,
UFW, and Nginx. A stale or partially working IPv6 record can make the site fail
for only some users, which is confusing to diagnose.

**Verify it:** query authoritative DNS with `dig` and confirm both names return
the static IP. DNS must resolve correctly before Certbot can validate the
hostnames.

### SSH users and permissions

Use SSH keys, not password authentication. Restrict port 22 in the Lightsail
firewall to your current public IP when practical. Keep one tested SSH session
open while changing SSH or UFW rules so a mistake does not immediately lock
you out.

Use a named deployment user instead of performing routine work as root. That
user can own the repository and release directories. Use `sudo` only for host
administration such as Nginx, `/etc`, firewall rules, and system packages.

Membership in the `docker` group effectively grants root-level control because
Docker can mount and modify host files. Either accept that trust boundary for
the deployment user or keep Docker commands behind `sudo`; do not treat Docker
group membership as an unprivileged permission.

Run the API container as a non-root image user. Nginx's worker processes run as
their configured service account, normally `www-data` on Ubuntu. Static files
need to be readable by Nginx, but they do not need to be writable by it.

### Updates and installed software

Update the package index and installed security fixes before adding services.
Install only the tools the deployment needs, typically:

- Git for obtaining the source;
- Nginx for public HTTP/TLS and static files;
- Docker Engine and the Compose plugin for API/PostgreSQL;
- Certbot with its Nginx integration for certificates;
- Node.js 24 and npm if builds will run directly on this server rather than in
  a build container or CI;
- optional PostgreSQL client and AWS CLI tools for backup operations.

Use Docker's supported Ubuntu repository rather than an abandoned standalone
Compose binary. Confirm Docker starts at boot and that `docker compose version`
works.

Decide how unattended security updates will be handled. Automatic security
updates reduce exposure, but occasionally require a reboot. For a hobby
application, enabling them and accepting a short maintenance window is usually
reasonable.

**Verify it:** check `systemctl status nginx docker`, inspect installed
versions, and reboot once during initial setup. A deployment that only works
until the first reboot is not finished.

### Two firewall layers

Configure Lightsail inbound rules as follows:

| Protocol | Port | Source |
| --- | --- | --- |
| TCP | `22` | Your trusted IP or range |
| TCP | `80` | Anywhere |
| TCP | `443` | Anywhere |

If IPv6 is enabled, configure its Lightsail firewall separately. AWS maintains
independent IPv4 and IPv6 rule sets.

Then configure UFW with the same intent: allow OpenSSH before enabling UFW,
allow Nginx HTTP/HTTPS, and deny other unsolicited inbound traffic. The order
matters because enabling UFW before allowing SSH can disconnect the
administrator.

Do not add Lightsail or UFW rules for 3000 or 5432. Docker-published ports can
interact unexpectedly with host firewall rules, which is another reason to
bind the API explicitly to loopback and not publish PostgreSQL at all.

**Verify it:** from another machine, ports 80 and 443 should respond, SSH
should work only from an allowed source, and connection attempts to 3000 and
5432 should fail.

### Directory layout

A simple host layout is:

```text
/srv/farm-bundle-tracker/
├── repository/                # Git checkout and Compose definition
└── backups/                   # short-lived local database dumps

/var/www/farm-bundle-tracker/
└── current/                   # deployed frontend dist contents

/etc/farm-bundle-tracker/
├── backend.env                # API secrets and runtime configuration
└── postgres.env               # database initialization credentials

/etc/nginx/sites-available/
└── farm-bundle-tracker        # Nginx virtual hosts
```

`/srv` holds application/operator data, `/var/www` holds files served by the
web server, and `/etc` holds host configuration. This separation makes
permissions, backups, and recovery easier to reason about.

Copy the frontend build into a temporary directory and then rename or switch a
symlink when possible. That avoids exposing a half-copied build where the new
`index.html` refers to assets that have not arrived yet. For a very small site,
copying into `current` is workable, but the atomic-release pattern is a useful
habit.

## 4. Choosing a deployment strategy

There are two reasonable ways to run this application on one VM.

### Native processes

```text
Ubuntu systemd
├── Nginx
├── Node.js / NestJS
└── PostgreSQL
```

Native installation has fewer layers. Linux users, files, systemd units, and
package management are visible, which is valuable when learning operating
system fundamentals. It can also use slightly less memory than containers.

The tradeoff is that the host now owns exact Node and PostgreSQL versions,
dependency installation, service units, database initialization, and upgrade
coordination. Reproducing the same setup on another VM requires carefully
repeating more host changes.

Systemd would be the natural Node process manager in this model. It can start
the API at boot, restart it after failure, inject an environment file, and send
logs to the journal. PM2 can do similar work, but it adds a Node-specific
process-management layer where systemd already exists.

### Docker-based application services

```text
Ubuntu
├── Nginx managed by systemd
└── Docker Compose
    ├── NestJS API
    └── PostgreSQL
```

Containers make the Node and PostgreSQL versions part of deployment
configuration. Compose supplies a private network, stable service names,
health checks, restart policies, and named volumes. Recreating the application
runtime on a fresh VM is mostly a matter of installing Docker, restoring the
configuration, and starting the same definition.

Containers do not remove operations work. The host still needs updates,
firewalling, disk monitoring, backups, and log inspection. PostgreSQL in a
container is still a stateful database; deleting its volume still deletes the
data.

### Recommended approach

Use **native Nginx plus Docker Compose for NestJS and PostgreSQL**.

This is a balanced learning deployment:

- Nginx, DNS, TLS, Linux permissions, and host logs remain easy to inspect.
- The stateful and application runtimes are reproducible.
- It builds on the repository's existing PostgreSQL Compose workflow.
- Docker restart policies replace PM2 or a custom API systemd unit.
- The system stays understandable on a 1 GB hobby VPS.

Nginx is intentionally outside Docker because Certbot integration, host ports,
static files, and Ubuntu service management are simpler that way. A fully
containerized Nginx is valid, but certificate volume sharing and renewal hooks
add little learning value for this project.

### Representative production Compose shape

The repository's development Compose file publishes PostgreSQL to the host.
Production should instead resemble:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    env_file:
      - /etc/farm-bundle-tracker/postgres.env
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test:
        ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 10

  api:
    build:
      context: .
      dockerfile: deploy/backend.Dockerfile
    restart: unless-stopped
    env_file:
      - /etc/farm-bundle-tracker/backend.env
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "127.0.0.1:3000:3000"

volumes:
  postgres_data:
```

The important ideas are more significant than the exact filename:

- PostgreSQL has a volume but no `ports` entry.
- The API reaches PostgreSQL as `postgres:5432` over the Compose network.
- The API's port is published only on host loopback for native Nginx.
- `restart: unless-stopped` asks Docker to restore the services after a crash
  or host reboot, unless an operator deliberately stopped them.
- `depends_on` helps with initial ordering; the application must still tolerate
  a database connection being interrupted later.
- Secrets are read at runtime from host files and are not built into images.

For this small deployment, keeping migration tooling in the backend image is a
reasonable simplicity tradeoff. A mature image would use multiple build stages
and contain only production runtime dependencies, with a separate migration
image or release job.

A deliberately simple backend Dockerfile could be:

```dockerfile
FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN npm ci

COPY apps/backend ./apps/backend
RUN npm run build -w backend

ENV NODE_ENV=production
ENV PORT=3000

USER node

CMD ["node", "apps/backend/dist/src/main.js"]
```

Copying package manifests before source lets Docker reuse the expensive
dependency layer until dependencies change. Both workspace manifests are
copied because the root lockfile describes the whole monorepo. This image keeps
development dependencies and backend source so it can run Drizzle migrations
and the TypeScript catalog seed. That is acceptable at this scale, but it is a
conscious size-versus-simplicity tradeoff rather than the smallest possible
runtime image.

Add a `.dockerignore` that excludes at least `.git`, local `node_modules`,
build output, coverage, logs, and `.env*` files. Excluding secrets is the
critical part; excluding generated files also keeps builds smaller and prevents
host artifacts from accidentally replacing container-built artifacts.

**Verify it:** run `docker compose config` interactively and do not share its
output because interpolated environment values can be sensitive.
`docker compose ps` should then show a healthy database and running API, and
restarting Docker should bring both back.

## 5. Frontend deployment

Vite turns the React source into ordinary HTML, CSS, JavaScript, and asset
files. There is no frontend Node server in production. Nginx reads those files
from disk and sends them directly to browsers.

Build with the production API URL present:

```bash
VITE_API_URL=https://api.example.com npm run build -w frontend
```

The output is `apps/frontend/dist`. Deploy the **contents** of that directory
to `/var/www/farm-bundle-tracker/current`, preserving `index.html` and the
`assets` directory.

The build can run on the server with Node.js 24, inside a temporary Node build
container, or in CI and be copied to the VM. That choice changes where build
tools live, not the resulting architecture. Building on the server is easy to
understand initially; CI-built artifacts become attractive when repeatability
and rollback matter more.

Set directories to executable/readable and files to readable by Nginx. The
Nginx worker should not own or write the frontend files.

### SPA routing

React Router handles routes such as `/farms/123` in the browser. If the user
loads that URL directly, Nginx first looks for a real file named
`/farms/123`. No such file exists, so Nginx must return `index.html`; React then
interprets the route.

That is the purpose of:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Do not use that fallback for missing JavaScript assets. If an old HTML page
requests a deleted asset and receives `index.html` with a JavaScript content
type expectation, the browser produces misleading syntax errors. The final
Nginx configuration gives `/assets/` a strict `404` fallback.

**Verify it:** open the home page, then directly load and refresh a nested
React route. Both should return the application. Requesting a nonexistent
asset under `/assets/` should return 404 rather than `index.html`.

## 6. Backend deployment and process management

The backend image compiles the NestJS TypeScript and starts the generated
JavaScript. It should not run `nest start --watch`, mount the source tree, or
install dependencies on every container start.

Conceptually, its image performs:

```text
copy dependency manifests
→ install locked dependencies
→ copy source
→ npm run build -w backend
→ start node apps/backend/dist/src/main.js
```

Pin the image to Node.js 24 to match the repository. Add a `.dockerignore` so
Git metadata, local `node_modules`, `.env` files, test output, and build output
are not sent into the Docker build context.

The API listens on port 3000 inside its container. Compose publishes that port
as `127.0.0.1:3000` on Ubuntu. Nginx can reach it, but a remote computer cannot
connect to it directly.

This separation provides several benefits:

- TLS and public protocol handling stay in Nginx.
- The API has one trusted upstream rather than every internet client.
- Nginx can enforce request-size, timeout, and rate limits.
- Replacing the Node process does not require changing public DNS or ports.

### Environment loading

Although the application imports `dotenv/config`, production does not need a
`.env` file inside the image. Compose reads the protected host environment file
and injects variables into the process. Existing process variables take
precedence over values a local dotenv file might provide.

Do not pass build-only `VITE_` variables to the API as secrets. Conversely, do
not expose `DATABASE_URL` or `JWT_SECRET` to the frontend build.

### Process management

Docker is the API process manager in this architecture:

- Docker starts the container from the image.
- `restart: unless-stopped` restarts it after a process failure and after boot.
- `docker compose logs` captures standard output and error.
- `docker compose up -d` replaces the container when its image or
  configuration changes.

Nginx is managed separately by systemd. There is no need to add PM2 or a custom
systemd unit for the same Node process; two process managers would make restart
behavior and logs harder to understand.

Containers receive a termination signal during replacement. Consider enabling
Nest shutdown hooks if the application later acquires resources that need
explicit graceful cleanup. The current short HTTP requests and database usage
keep this less urgent, but graceful shutdown is a reusable production concern.

**Verify it:** request the API directly from the server with
`curl http://127.0.0.1:3000`, then request it through
`https://api.example.com`. Stop the API container and confirm Nginx returns a
gateway error; start it and confirm recovery. This demonstrates the proxy
boundary.

## 7. PostgreSQL

PostgreSQL runs as one Compose service on the same Lightsail instance. That is
appropriate for a small personal application: it avoids a managed-database
bill while preserving the PostgreSQL behavior the application was written for.

The tradeoff is shared fate. If the VM or its disk disappears, both the
application and its primary database disappear. Backups therefore matter more
than they would with a separately managed database.

### Persistent storage

Container filesystems are replaceable. The named volume mounted at
`/var/lib/postgresql/data` is what keeps the database across image upgrades and
container replacement.

These operations are very different:

```text
docker compose down       → removes containers/network, retains named volume
docker compose down -v    → also removes named volume and database data
```

The production workflow should never use `down -v`. Treat any command that
removes volumes as destructive and verify the exact project and volume first.

The volume is persistent relative to containers, but it still resides on the
Lightsail disk. It is not an off-server backup.

### Network and connection string

Do not publish PostgreSQL's 5432 port. Compose's private network provides DNS
for the service name, so the API connects with:

```text
postgresql://USER:PASSWORD@postgres:5432/DATABASE
```

If administration from a workstation is occasionally necessary, use an SSH
tunnel rather than opening PostgreSQL to the internet. The tunnel temporarily
maps a local port through authenticated SSH to the server-side service.

**Verify it:** `docker compose exec postgres pg_isready` should report ready,
the API should resolve the hostname `postgres`, and an external port scan
should not find 5432.

### Safe migrations and seeds

Before applying a production migration:

1. Read the generated migration and understand whether it is additive,
   destructive, or long-running.
2. Create a fresh database dump.
3. Build the new API image before stopping the old API.
4. Stop the API for a maintenance window if old code cannot safely use the new
   schema.
5. Run exactly one migration process against the production database.
6. Start the new API and exercise affected behavior.

Run the catalog seed after initial migration and when catalog source data
changes. Application user data is not a seed and must never be replaced during
deployment.

### Backup and restore basics

For this database, a daily custom-format `pg_dump` is a good logical backup:

```bash
backup_file="/srv/farm-bundle-tracker/backups/farm-bundle-tracker-$(date -u +%Y%m%dT%H%M%SZ).dump"
docker compose exec -T postgres \
  pg_dump -U farm -d farm_bundle_tracker -Fc \
  > "$backup_file"
```

Custom format is compressed and restored with `pg_restore`. `pg_dump` makes a
consistent logical export while the database remains in use, which is suitable
for this application. Check the command's exit status and that the resulting
file is nonempty before declaring success.

Copy each successful dump off the instance, for example to a private S3 bucket
with restricted credentials, default encryption, and a retention policy. A
backup beside the database is useful for quick mistakes but does not protect
against loss of the VM.

A restore is a controlled, potentially destructive operation:

1. Stop the API so it does not write during the restore.
2. Create an empty target database or deliberately clear the chosen target.
3. Run `pg_restore` with the intended ownership and cleanup options.
4. Start the API and verify accounts, farms, and catalog data.
5. Preserve the source dump until the restored system has been accepted.

After confirming the exact target database, a representative restore into that
database is:

```bash
docker compose exec -T postgres \
  pg_restore -U farm -d farm_bundle_tracker \
    --clean --if-exists --no-owner \
  < /path/to/verified-backup.dump
```

`--clean` intentionally drops database objects before recreating them. Stop
the API first, confirm the target twice, and never test this command against the
only production copy.

Practice this on a disposable database. A backup strategy is only trustworthy
after a restore has succeeded.

## 8. Nginx in this deployment

Nginx uses configuration contexts to decide how to handle a request:

- A `server` block is a virtual web server.
- `listen` selects the local port and TLS mode.
- `server_name` selects a block based on the requested hostname.
- `location` selects behavior based on the request path.
- `root` and `try_files` serve files.
- `proxy_pass` sends a request to another HTTP server.
- `proxy_set_header` preserves information the upstream needs.

Because both DNS names point to one IP, Nginx uses the HTTP `Host` header and
TLS server name to distinguish the frontend from the API.

### Complete minimal production configuration

The following is the intended final state after Certbot has issued one
certificate covering both names. Confirm the actual certificate path with
Certbot; do not enable certificate paths before those files exist.

```nginx
# /etc/nginx/sites-available/farm-bundle-tracker

server {
    listen 80;
    listen [::]:80;
    server_name app.example.com api.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name app.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/farm-bundle-tracker/current;
    index index.html;

    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 1m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
}
```

Enable the site with a symlink from `sites-enabled`, disable Ubuntu's default
site if it is no longer needed, test the syntax, and then reload Nginx. A reload
asks Nginx to adopt valid new configuration without abruptly terminating
active connections; a restart stops and starts the service.

### Important directives

The port 80 block redirects while preserving the original hostname and URI.
Port 80 remains useful for HTTP-to-HTTPS behavior and the common Let's Encrypt
HTTP validation method.

The frontend block points `root` at the directory containing `index.html`.
Hashed Vite assets under `/assets/` receive a long immutable cache lifetime;
new deployments generate new filenames. All other missing frontend paths fall
back to `index.html` for React Router.

The API block sends every URI unchanged to `127.0.0.1:3000`. The absence of a
trailing URI in `proxy_pass` is intentional. Nginx's trailing-slash rules can
rewrite paths, so change that directive only after understanding the resulting
upstream URI.

The proxy headers tell NestJS the requested host, client-address chain, and
original scheme. If the application later makes security decisions using
forwarded addresses or `req.protocol`, configure Express's trusted-proxy policy
explicitly; forwarded headers should not be blindly trusted from arbitrary
clients.

`client_max_body_size` rejects unexpectedly large bodies before Node processes
them. One MiB is ample for the current JSON-only API and can be adjusted if a
real feature requires larger payloads.

Do not configure SPA fallback on the API host. A mistyped API URL should return
an API 404, not the React application.

**Verify it:** always run `nginx -t` before a reload. Then test the static home
page, a nested frontend route, a real API route, a missing asset, and a missing
API route. Check the Nginx access and error logs while testing.

## 9. HTTPS and certificate renewal

HTTPS protects credentials, cookies, bearer tokens, and application data from
passive network observers and modification in transit. It is also required by
the refresh cookie's production `Secure` flag.

TLS terminates at Nginx:

```text
browser -- encrypted HTTPS --> Nginx -- private HTTP --> NestJS
```

The second connection remains on the same host through loopback. Encrypting
that hop would add complexity without protecting against a meaningful network
boundary in this architecture.

### Issuing the certificate

First make both DNS names resolve to the static IP, allow ports 80 and 443, and
serve a valid HTTP Nginx configuration. Then use Certbot's Nginx integration to
request a certificate for both names:

```bash
sudo certbot --nginx -d app.example.com -d api.example.com
```

Let's Encrypt validates control of the names, Certbot obtains the certificate,
and the Nginx plugin can install the TLS directives. Review the generated
configuration rather than treating it as magic.

The certificate contains public identity information and an expiration date.
The private key remains on the server and must be readable only by the
privileged Nginx startup process.

Certbot installs a scheduled renewal mechanism. Test it safely with:

```bash
sudo certbot renew --dry-run
```

Renewal failure usually comes from broken DNS, blocked port 80, removed Nginx
configuration, or permissions. Monitor renewal rather than assuming the timer
will always work.

### What happens during an HTTPS request?

1. DNS returns the Lightsail IP.
2. The browser connects to port 443 and names the requested hostname during
   the TLS handshake.
3. Nginx selects the matching certificate and proves possession of its private
   key.
4. The browser verifies the certificate chain and hostname.
5. The encrypted HTTP request reaches the selected Nginx `server` block.
6. Nginx serves a file or proxies the now-decrypted HTTP request to NestJS.
7. Nginx encrypts the response on the way back to the browser.

**Verify it:** inspect the certificate names and expiration in the browser or
with a TLS client, request both HTTPS hostnames, confirm HTTP redirects, and
run the renewal dry-run.

## 10. Practical production security

Security here means removing avoidable exposure and making routine compromise
or mistakes less likely. It does not require an enterprise security platform.

- Use SSH keys and disable password/root login after confirming key access.
- Restrict Lightsail SSH ingress to trusted addresses when possible.
- Keep both Lightsail and UFW rules limited to 22, 80, and 443.
- Never publish PostgreSQL; use Compose networking and SSH tunnels.
- Bind the API's host port to `127.0.0.1`, not `0.0.0.0`.
- Keep production env files outside Git and set restrictive permissions.
- Run the API container and routine deployment work as non-root users.
- Use HTTPS everywhere; do not weaken `Secure` cookies to work around TLS.
- Install OS and container-image updates on a regular schedule.
- Back up before risky changes and keep copies off the VM.
- Review logs for repeated authentication failures or unexpected traffic.

Nginx rate limiting is optional but reasonable for public authentication
endpoints. Start with a modest per-IP API limit only after understanding normal
traffic. The board polls every 15 seconds, so a limit such as ten requests per
second with a short burst allowance should not affect ordinary use, while
still reducing obvious abuse:

```nginx
# This directive belongs in Nginx's http context.
limit_req_zone $binary_remote_addr zone=api_per_ip:10m rate=10r/s;

# This directive can be added to the API location.
limit_req zone=api_per_ip burst=30 nodelay;
```

Rate limiting is not a substitute for backend authorization, password hashing,
or account-level protections. Test it under realistic use and watch for `429`
responses before keeping it.

**Verify security boundaries:** perform an external port scan, inspect file
permissions without printing secret values, check the container's runtime
user, test HTTP-to-HTTPS redirects, and confirm the browser stores the refresh
cookie as HttpOnly and Secure.

## 11. Initial setup versus routine deployments

Some work establishes the server once; other work happens for every release.

### Initial server setup

These tasks are normally one-time or infrequent:

1. Create the Lightsail instance and attach a static IP.
2. Configure Lightsail firewall rules and DNS.
3. Create the deployment user and install SSH keys.
4. Update Ubuntu and install Nginx, Docker, Compose, and Certbot.
5. Create application directories and production environment files.
6. Add the production Dockerfile and Compose definition.
7. Configure and enable the Nginx site.
8. Obtain the TLS certificate and test renewal.
9. Start PostgreSQL, run initial migrations, and seed the catalog.
10. Configure off-server database backups and optional Lightsail snapshots.
11. Reboot and verify that Nginx and containers return automatically.

### A normal application deployment

After setup, the flow is:

```text
select the intended Git commit
           │
           ▼
fetch/pull source and install locked dependencies
           │
           ▼
run tests and build backend + frontend
           │
           ▼
build the new API image
           │
           ▼
take a database backup
           │
           ▼
run migrations once
           │
           ▼
publish the frontend build atomically
           │
           ▼
replace/restart the API container
           │
           ▼
smoke-test frontend, auth, API, and database behavior
```

Nginx does not need a reload when only frontend files or the API image change.
Reload it only when its configuration or certificate handling changes.

An illustrative operator sequence is:

```bash
git pull --ff-only
npm ci
npm test -w backend -- --runInBand
npm run build -w backend
VITE_API_URL=https://api.example.com npm run build -w frontend
docker compose -f compose.production.yml build api
# Create and verify a database dump here.
docker compose -f compose.production.yml run --rm api \
  npm run db:migrate -w backend
# Run the catalog seed only when required.
docker compose -f compose.production.yml up -d api
# Publish the frontend dist contents, then run smoke tests.
```

This is a workflow sketch, not a command to run blindly. In particular:

- Know which commit is being deployed.
- Stop if tests, builds, backup, or migration fail.
- Ensure the migration container receives the same production environment and
  Compose network as the API.
- Do not run two migration commands concurrently.
- Do not use `docker compose down -v`.
- Keep the previous image and frontend release long enough to roll back code.

Database rollback is different from code rollback. Once a migration changes
or removes data, starting an older API image may not be safe. Plan database
changes forward, and use the pre-deployment backup only when a deliberate
restore is necessary.

### Post-deployment verification

A useful smoke test checks boundaries in order:

1. Both domains resolve to the expected static IP.
2. HTTP redirects to HTTPS.
3. The frontend loads and a nested route survives refresh.
4. The API returns through Nginx.
5. Registration or sign-in works.
6. Refresh authentication works after reloading the page.
7. A database-backed farm view loads and can perform an authorized update.
8. Nginx and API logs contain no new unexpected errors.

## 12. Backups and disaster recovery

A lightweight responsible strategy uses two complementary backup types.

### Logical database backups

Create a `pg_dump -Fc` every day. Keep, for example, seven daily copies and
four weekly copies. Upload successful dumps to private off-server storage such
as S3, then expire old objects with a lifecycle policy.

Protect any S3 credential stored on the VM with a least-privilege policy that
only allows the necessary backup prefix. Better still, use a mechanism that
does not leave a broad AWS credential on the server. Never put access keys in
the repository or frontend environment.

Alert on backup failure or at least review the job's exit status and recent
object timestamps. A cron job that has silently failed for months is not a
backup system.

### Lightsail snapshots

Enable automatic Lightsail snapshots or take manual snapshots before major
host changes. Snapshots are useful for recreating the complete disk quickly,
while logical dumps are more portable and better for restoring only the
database.

Snapshots do not replace `pg_dump`:

- they represent an entire disk rather than a database-aware logical export;
- they can reproduce corrupted or unwanted state;
- automatic snapshots have a limited rolling retention;
- depending only on the same VM/account boundary is a weaker recovery plan.

### Restore testing

At least occasionally, restore a recent dump into a disposable PostgreSQL
database and start the application against it. Verify representative records
and application behavior. Record how long recovery takes and fix unclear steps
while there is no emergency.

### Recreating the whole server

If the instance disappeared, recovery requires:

- the Git repository and exact production commit;
- production Dockerfile, Compose, and Nginx configuration;
- a secure copy of production secrets and database credentials;
- the latest verified off-server database dump;
- access to DNS and the retained static IP, or the ability to update DNS;
- the server-setup decisions documented in this chapter;
- the ability to issue a new Let's Encrypt certificate.

The recovery sequence is to create a fresh Ubuntu instance, install the small
host toolset, restore configuration and secrets, start an empty PostgreSQL,
restore the dump, build/start the API, publish the frontend, configure Nginx,
attach/update networking, and verify the full request path.

A Lightsail snapshot can shorten that sequence by creating a new instance from
the captured disk. Recheck custom firewall rules after a snapshot restore;
AWS does not copy all custom firewall rules to a new instance created from a
snapshot.

## 13. Observability and troubleshooting

This deployment does not need a monitoring platform initially, but it does
need known places to inspect.

### Where to look

| Concern | Useful source |
| --- | --- |
| Browser requests and cookies | Browser developer tools: Network, Console, Storage |
| Nginx requests | `/var/log/nginx/access.log` |
| Nginx routing/TLS/upstream errors | `/var/log/nginx/error.log` |
| Nginx service state | `systemctl status nginx`, `journalctl -u nginx` |
| API output | `docker compose logs api` |
| PostgreSQL output | `docker compose logs postgres` |
| Container health/state | `docker compose ps`, `docker inspect`, `docker stats` |
| Open ports | `ss -lntp` |
| Disk usage | `df -h`, `du`, `docker system df` |
| Memory | `free -h`, `top`, `docker stats` |
| CPU/load | `uptime`, `top`, `docker stats` |
| Database readiness | `docker compose exec postgres pg_isready` |

Set Docker log rotation so one noisy container cannot consume the entire disk.
Also watch the PostgreSQL volume and local backup directory. Do not run broad
Docker cleanup commands without first identifying whether they can remove an
image, container, or volume needed for recovery.

The root API route can prove that Node is responding, but it does not prove a
database query works. A future `/health` endpoint can distinguish process
health from database readiness; until then, include a real database-backed
request in smoke tests.

### Troubleshooting flow

```text
Website unavailable
      │
      ▼
Does DNS resolve to the Lightsail static IP?
      │ no → fix DNS/static-IP records and wait for propagation
      │ yes
      ▼
Can the instance be reached on 80/443?
      │ no → inspect Lightsail IPv4/IPv6 rules and UFW
      │ yes
      ▼
Is Nginx running and is `nginx -t` valid?
      │ no → inspect systemd status and Nginx error log
      │ yes
      ▼
Does TLS succeed for the requested hostname?
      │ no → inspect certificate names, expiry, and Certbot renewal
      │ yes
      ▼
Does the frontend fail, or only API calls?
      │ frontend → inspect root path, file permissions, assets, try_files
      │ API
      ▼
Does `curl http://127.0.0.1:3000` work on the server?
      │ no → inspect API container state and logs
      │ yes
      ▼
Can the API resolve/reach `postgres:5432`?
      │ no → inspect Compose network, DATABASE_URL, database health/logs
      │ yes
      ▼
Inspect CORS, cookie attributes, authorization, schema, and application logs
```

Work from outside inward. DNS must work before Nginx can receive a request;
Nginx must work before proxying; the API must work before it can query the
database. Randomly restarting every service erases evidence and makes the
failure harder to understand.

Common symptom mappings are:

- **Nginx 502:** Nginx cannot connect to the API, often because the container
  is stopped or the loopback port is wrong.
- **Nginx 404 on frontend refresh:** SPA `try_files` fallback is missing or the
  wrong server block handled the request.
- **Browser CORS error:** `FRONTEND_URL` does not exactly match the frontend
  origin, or the request is not reaching the expected API.
- **Sign-in succeeds but refresh fails:** inspect Secure/SameSite/path cookie
  attributes and credentialed CORS.
- **API starts but database routes fail:** inspect `DATABASE_URL`, the Compose
  service hostname, migrations, and PostgreSQL readiness.
- **Intermittent failure for some networks:** inspect an incorrect `AAAA`
  record or separately configured IPv6 firewall.
- **No space left:** inspect logs, Docker images, database volume growth, and
  local backups before deleting anything.

## 14. Final mental model

The complete request lifecycle is:

```text
User enters https://app.example.com
→ DNS maps the name to the Lightsail static IP
→ Lightsail and UFW permit TCP 443
→ Nginx completes TLS using the app.example.com certificate
→ Nginx reads index.html or another Vite asset from /var/www
→ the browser executes the React application
→ React calls https://api.example.com
→ DNS returns the same Lightsail IP
→ Nginx selects the API server block from the hostname
→ Nginx terminates TLS and proxies the URI to 127.0.0.1:3000
→ Docker forwards the loopback connection to the NestJS container
→ NestJS validates/authenticates the request and runs application logic
→ Drizzle sends SQL to postgres:5432 on the private Compose network
→ PostgreSQL reads or changes data in its persistent volume
→ the JSON response returns through NestJS and Nginx
→ the browser receives it over the encrypted connection
→ React Query updates the user interface
```

Responsibility follows the same path:

- DNS owns naming.
- Firewalls own reachability.
- TLS owns transport identity and encryption.
- Nginx owns public HTTP, static files, and reverse proxying.
- Docker owns application-process isolation, networking, and restart policy.
- NestJS owns business rules and API security.
- PostgreSQL owns durable data.
- Backups own recovery when the primary copy is lost or damaged.

Once this model is clear, future deployments become variations on the same
questions: which component is public, where TLS ends, where processes run, how
configuration enters them, where state persists, how changes are released,
and how the system is recovered.

## Primary references

- [Create and attach a Lightsail static IP](https://docs.aws.amazon.com/lightsail/latest/userguide/lightsail-create-static-ip.html)
- [Control Lightsail traffic with firewalls](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-firewall-and-port-mappings-in-amazon-lightsail.html)
- [Lightsail snapshots](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-snapshots-in-amazon-lightsail.html)
- [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Install the Docker Compose plugin](https://docs.docker.com/compose/install/linux/)
- [Nginx reverse proxy guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy)
- [Certbot instructions for Nginx on Ubuntu](https://certbot.eff.org/instructions?ws=nginx&os=snap)
- [PostgreSQL `pg_dump`](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL `pg_restore`](https://www.postgresql.org/docs/current/app-pgrestore.html)
