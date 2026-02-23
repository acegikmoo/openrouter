# OpenRouter

A self-hosted LLM routing API that proxies requests across multiple AI providers — OpenAI, Anthropic, Google Gemini — through a single OpenAI-compatible endpoint. Built with Bun, Elysia, Prisma, and React.

## What it does

- Routes chat completion requests to the cheapest or most available provider for a given model
- Tracks per-key credit usage and deducts based on token cost per provider
- Lets users manage API keys, top up credits, and browse available models through a dashboard

## Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Runtime       | Bun                                  |
| API framework | Elysia                               |
| Database ORM  | Prisma (PostgreSQL)                  |
| Frontend      | React 19, Tailwind CSS v4, shadcn/ui |
| Monorepo      | Turborepo                            |

**Apps**

- `apps/backend` — auth, API key management, model catalog, payments (port 3000)
- `apps/api` — the actual LLM proxy endpoint (port 4000)
- `apps/frontend` — dashboard UI (port 3001)
- `packages/db` — shared Prisma client

## Prerequisites

- [Bun](https://bun.sh) >= 1.2
- PostgreSQL database
- API keys for the providers you want to support (OpenAI, Anthropic, Google)

## Getting started

```bash
git clone https://github.com/your-username/openrouter
cd openrouter
bun install
```

Set up environment variables. Create `.env` files in `apps/backend`, `apps/api`, and `packages/db`:

```env
# packages/db/.env
DATABASE_URL=postgresql://user:password@localhost:5432/openrouter

# apps/backend/.env
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost:5432/openrouter

# apps/api/.env
DATABASE_URL=postgresql://user:password@localhost:5432/openrouter
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

Run database migrations:

```bash
cd packages/db
bunx prisma migrate deploy
```

Start all services:

```bash
bun dev
```

Or run a specific app:

```bash
turbo dev --filter=backend
turbo dev --filter=frontend
turbo dev --filter=api
```

## API usage

The proxy is OpenAI-compatible. Point your existing client at `http://localhost:4000`:

```bash
curl http://localhost:4000/api/v1/chat/completions \
  -H "Authorization: Bearer sk-or-v1-yourkey" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-3-5-sonnet",
    "messages": [{ "role": "user", "content": "Hello" }]
  }'
```

The `model` field follows the format `company/model-name`. The backend resolves which provider to use and handles billing automatically.

## Database schema overview

- `User` — email/password auth, credit balance
- `ApiKey` — per-user keys with credit tracking and enable/disable toggle
- `Model` + `Company` — model catalog
- `Provider` + `ModelProviderMapping` — maps models to providers with per-token pricing
- `OnrampTransaction` — credit top-up history
- `Conversation` — request logs

## Project structure

```
.
├── apps/
│   ├── api/          # LLM proxy (Elysia, port 4000)
│   ├── backend/      # REST API (Elysia, port 3000)
│   └── frontend/     # Dashboard (React, port 3001)
└── packages/
    ├── db/           # Prisma schema + client
    └── ui/           # Shared React components
```

## Development notes

- The frontend uses Eden Treaty for end-to-end type-safe API calls — no manual type definitions needed for client-server communication
- Provider selection for a model is currently random across all mapped providers. You can extend `apps/api/src/index.ts` to implement cost-based or latency-based routing
- Credits are stored as integers. The current formula is `(inputTokens * inputCost + outputTokens * outputCost) / 10`

## License

MIT
