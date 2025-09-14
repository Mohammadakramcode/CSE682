## Game Achievement Tracker – Quick Start

Simple full‑stack app to track games and achievements.

### Prerequisites
- Node 18+

### Setup
```bash
cd web
npm install

# create local SQLite DB and Prisma client
npx prisma migrate dev --name init
```

### Run
```bash
npm run dev
```
Open http://localhost:3000

### What’s included
- Next.js (App Router, TypeScript) + TailwindCSS
- Auth with JWT (HTTP‑only cookie) and bcrypt password hashing
- Prisma ORM with SQLite
- Features: signup/login, add/list games, add/toggle/delete achievements, action log, settings

### Environment
The app works out of the box with SQLite. Optional:
- `JWT_SECRET` in `.env` (defaults to a dev value)

### Scripts
- `npm run dev` – start dev server
- `npx prisma studio` – inspect the DB

### Notes
- Data is stored in `prisma/dev.db` (SQLite). Delete the file to reset.
