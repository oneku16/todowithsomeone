# Meer Task

A minimal, cozy task-sharing web app for two friends. Share things to watch, places to go, and small tasks to do — assign them to each other, track progress, and mark them done.

## Features

- Login for two predefined users (no public registration)
- Create tasks with category: **To Watch**, **To Go**, or **To Do**
- Assign tasks to yourself or your friend
- Filter by category and status
- Mark tasks done or reopen them
- Delete tasks
- Mobile-first responsive UI

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) + SQLite
- [iron-session](https://github.com/vvo/iron-session) for cookie sessions
- [Zod](https://zod.dev/) for validation

## Prerequisites

- Node.js 20+
- npm

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy the example env file and edit credentials:

   ```bash
   cp .env.example .env
   ```

   Important variables:

   - `SESSION_SECRET` — use a long random string (32+ characters)
   - `USER1_*` / `USER2_*` — usernames, passwords, and display names for the two accounts

3. **Set up the database**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Default seeded users

After seeding with default `.env.example` values:

| Username | Password   | Display name |
|----------|------------|--------------|
| `alex`   | `changeme` | Alex         |
| `sam`    | `changeme` | Sam          |

Change these in `.env` before seeding in production.

## Scripts

| Command            | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Start development server       |
| `npm run build`    | Production build               |
| `npm run start`    | Start production server        |
| `npm run lint`     | Run ESLint                     |
| `npm run db:migrate` | Apply database migrations    |
| `npm run db:seed`  | Seed the two users             |
| `npm run db:reset` | Reset DB, migrate, and seed    |

## Project structure

```
src/
  app/           # Pages and API routes
  components/    # UI components
  lib/           # Prisma client, session, validation
  types/         # Shared TypeScript types
prisma/
  schema.prisma  # Database schema
  seed.ts        # User seed script
```

## Deploying to Vercel

Vercel’s serverless runtime **cannot open a local SQLite file** (`file:./prisma/dev.db`). The database file is not on disk at runtime, and the filesystem is not suitable for SQLite. You need a **remote** SQLite-compatible database.

This project supports [Turso](https://turso.tech/) (libSQL) for production.

### 1. Create a Turso database

```bash
# Install Turso CLI: https://docs.turso.tech/cli
turso auth login
turso db create meer-task
turso db show meer-task --url
turso db tokens create meer-task
```

### 2. Apply the schema to Turso

```bash
turso db shell meer-task < prisma/migrations/20260528194528_init/migration.sql
```

(Use your actual DB name if different.)

### 3. Seed users on Turso

Set Turso env vars locally (or in your shell), then:

```bash
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
npm run db:seed
```

Use the same `USER1_*` / `USER2_*` values you want in production.

### 4. Configure Vercel environment variables

In the Vercel project → **Settings → Environment Variables**, add:

| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | `libsql://...` from `turso db show` |
| `TURSO_AUTH_TOKEN` | Token from `turso db tokens create` |
| `SESSION_SECRET` | Long random string (32+ chars) |
| `USER1_USERNAME`, `USER1_PASSWORD`, `USER1_DISPLAY_NAME` | First account (for reference; seed already ran) |
| `USER2_USERNAME`, `USER2_PASSWORD`, `USER2_DISPLAY_NAME` | Second account |

Do **not** set `DATABASE_URL` to `file:./prisma/dev.db` on Vercel.

Redeploy after saving env vars.

## Notes

- This app is intentionally scoped for **two users only**.
- There is no signup flow — accounts are created via the seed script.
- Local dev: SQLite in `prisma/dev.db` (gitignored).
- Production (Vercel): Turso via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.
