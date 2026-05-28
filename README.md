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

## Notes

- This app is intentionally scoped for **two users only**.
- There is no signup flow — accounts are created via the seed script.
- SQLite stores data in `prisma/dev.db` (gitignored).
