# AI Prompt Builder — Backend

Production-ready Express + TypeScript + Prisma + PostgreSQL backend for the
AI Prompt Builder SaaS.

## Stack

- **Runtime**: Node.js 18+ / TypeScript
- **HTTP**: Express 4
- **ORM**: Prisma 5 + PostgreSQL
- **Auth**: JWT access tokens + httpOnly refresh-token cookies
- **Validation**: Zod
- **Security**: Helmet, CORS, express-rate-limit, bcrypt

## Why Express (not NestJS)?

The architecture doc weighed both. We chose Express here because:
- Lower cold-start time on Render's free tier
- Smaller dependency surface, faster builds
- The modular structure below already gives us controllers / services /
  routes separation — Nest's DI is overkill at this scale.
- Easy to migrate later: every module is self-contained.

## Quick start

```bash
cp .env.example .env
npm install
npm run prisma:migrate -- --name init
npm run db:seed
npm run dev
```

The API will be available on `http://localhost:4000`.

## Scripts

| Script                | Purpose                                    |
| --------------------- | ------------------------------------------ |
| `npm run dev`         | Start dev server with hot reload (tsx)     |
| `npm run build`       | Compile TypeScript to `dist/`              |
| `npm start`           | Run compiled server (production)           |
| `npm run prisma:migrate` | Create + apply a new migration          |
| `npm run prisma:deploy`  | Apply existing migrations (CI / Render) |
| `npm run db:seed`        | Insert sample templates                 |
| `npm run prisma:studio`  | Open Prisma Studio UI                   |

## Folder structure

```
backend/
├── prisma/
│   ├── schema.prisma         # Full data model
│   └── seed.ts               # Sample templates
├── src/
│   ├── config/               # env loading + typed config
│   ├── core/                 # Pure domain logic (no Express, no Prisma)
│   │   ├── prompt-engine/    # Rule-based prompt generation
│   │   └── scoring/          # Prompt quality scoring
│   ├── infrastructure/
│   │   └── prisma.ts         # Prisma client singleton
│   ├── middleware/           # auth, errors, rate limit, validate
│   ├── modules/              # Feature modules
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── prompts/
│   │   ├── templates/
│   │   ├── sessions/         # PromptSession (questionnaire runs)
│   │   └── preferences/
│   ├── utils/                # AppError, jwt, cookies, async handler
│   ├── routes.ts             # Mounts all module routers
│   ├── app.ts                # Express app factory
│   └── server.ts             # HTTP bootstrap
└── package.json
```

Each module follows the same shape:

```
modules/<name>/
├── <name>.controller.ts   # HTTP layer — request/response only
├── <name>.service.ts      # Business logic — calls Prisma + core/
├── <name>.routes.ts       # Router + middleware wiring
└── <name>.schema.ts       # Zod input schemas
```

## Render deployment

1. Create a **PostgreSQL** instance on Render. Copy its **Internal Database URL**.
2. Create a **Web Service** pointing at this `backend/` directory.
   - Build command: `npm install && npm run build && npm run prisma:deploy`
   - Start command: `npm start`
3. Set environment variables from `.env.example` (use the Internal DB URL).
4. (One-off) `npm run db:seed` from the Render shell to load templates.
