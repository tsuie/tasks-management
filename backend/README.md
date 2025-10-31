# Task Management - Backend

NestJS + TypeORM (PostgreSQL) backend for managing tasks.

- Runtime: Node.js + NestJS
- ORM: TypeORM
- DB: PostgreSQL

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+

## Environment variables

Create a `.env` file in this folder with at least:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/task_management
DB_SSL=false
PORT=3000
```

- `DATABASE_URL` is used by TypeORM for both app and CLI.
- `DB_SSL` optional; set to `true` when connecting to cloud Postgres with SSL.
- `PORT` optional; defaults to 3000.

## Installation

```bash
npm install
```

## Database migration

Migrations use TypeORM CLI with the configured data source (`src/database/data-source.ts`).

- Run migrations

```bash
npm run migration:run
```

- Revert last migration

```bash
npm run migration:revert
```

- Generate a new migration

```bash
npm run typeorm -- migration:generate src/migrations/<name>
```

> Existing migrations live in `src/migrations/`.

## Seeding

Seeding is implemented as TypeORM migrations executed against a dedicated seed data source (`src/database/seed-data-source.ts`). Seed files are in `src/seeds/`.

- Run seeds

```bash
npm run seed:run
```

- Revert last seed

```bash
npm run seed:revert
```

- Show pending/applied seeds

```bash
npm run seed:show
```

## Running the app

- Development (watch mode)

```bash
npm run start:dev
```

- Production

```bash
npm run build && npm run start:prod
```

CORS is enabled for `http://localhost:3001`. The API listens on `PORT` (default 3000).

## API usage

Base URL: `http://localhost:3000`

Entity: Task

```json
{
  "id": 1,
  "title": "Write docs",
  "description": "Draft API documentation",
  "status": "pending",           // one of: pending | in_progress | done
  "priority": "medium",          // one of: low | medium | high
  "dueDate": "2025-12-31T23:59:59.000Z",
  "createdAt": "2025-10-31T00:00:00.000Z",
  "updatedAt": "2025-10-31T00:00:00.000Z"
}
```

### Endpoints

- List tasks

```bash
curl -s http://localhost:3000/tasks
```

- Get a task by id

```bash
curl -s http://localhost:3000/tasks/1
```

- Create a task

```bash
curl -s -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Write docs",
    "description": "Draft API documentation",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2025-12-31T23:59:59.000Z"
  }'
```

- Update a task (partial)

```bash
curl -s -X PATCH http://localhost:3000/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{ "status": "in_progress", "title": "Write docs (updated)" }'
```

- Delete a task

```bash
curl -s -X DELETE http://localhost:3000/tasks/1
```

You can also use the ready-made REST client file `rest-api.http` in this folder.

## Testing

```bash
npm test       # unit
npm run test:e2e
npm run test:cov
```

## Project structure (high level)

```
src/
  database/
    data-source.ts          # TypeORM data source for app/migrations
    seed-data-source.ts     # Data source for seeds
  migrations/               # DB migrations
  seeds/                    # Seed migrations
  tasks/                    # Tasks module (controller/service/entity)
```

## Notes

- `synchronize` is disabled; schema changes must be managed via migrations.
- When using SSL-enabled Postgres, set `DB_SSL=true` (client is configured to not reject self-signed certs).
