# OpenRouter

Self-hosted LLM routing API. OpenAI-compatible `/chat/completions` endpoint that routes across OpenAI, Anthropic, and Google Gemini. Includes a user dashboard for API key management and credit tracking.

## Stack

- **Runtime:** Bun
- **API:** Elysia (single process — auth, management, and LLM proxy on one port)
- **Database:** PostgreSQL + Prisma 7
- **Frontend:** React 19 + Tailwind CSS v4 + shadcn/ui (built to static files, served by Elysia)
- **Monorepo:** Turborepo

## Quick start

```bash
bun install
```

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/openrouter
JWT_SECRET=generate-a-random-secret
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

```bash
bun run --cwd packages/db prisma migrate deploy
bun run packages/db/seed.ts
bun dev
```

Open http://localhost:3001 — the frontend, backend API, and LLM proxy all run on the same server.

## Deploy (Fly.io + Neon)

```bash
fly launch --no-deploy
fly postgres create --name openrouter-db
fly postgres attach openrouter-db
fly secrets set JWT_SECRET=<random> OPENAI_API_KEY=... ANTHROPIC_API_KEY=... GOOGLE_API_KEY=...
fly deploy --build-arg DATABASE_URL="<internal-db-url>"
fly ssh console -C "bun run --cwd packages/db prisma migrate deploy"
fly ssh console -C "bun run packages/db/seed.ts"
```

The free tier (3 shared VMs + 1GB Postgres) handles this comfortably.

## API

```
POST /api/v1/chat/completions
Authorization: Bearer <api-key>
```

### Non-streaming

```json
{
  "model": "openai/gpt-4o",
  "messages": [{"role": "user", "content": "Hello"}]
}
```

### Streaming

```json
{
  "model": "openai/gpt-4o",
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": true
}
```

Model format: `company/model-name` (e.g. `openai/gpt-4o`, `anthropic/claude-3.5-sonnet`, `google/gemini-1.5-pro`). Provider is selected randomly from mapped providers.

## Credits

```
credits = (inputTokens * inputTokenCost + outputTokens * outputTokenCost) / 10
```

New users start with 1,000 credits. Credits are consumed per-request and tracked per API key.

## License

MIT
