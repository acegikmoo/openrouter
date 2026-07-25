FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lock .npmrc turbo.json ./
COPY apps/api/package.json apps/api/
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY packages/ packages/
RUN bun install --frozen-lockfile

FROM base AS build-frontend
COPY apps/frontend/ apps/frontend/
RUN bun run --cwd apps/frontend build.ts --outdir=../api/public

FROM base AS build-db
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
COPY apps/api/ apps/api/
COPY packages/db/prisma/ packages/db/prisma/
RUN bun run --cwd packages/db prisma generate

FROM oven/bun:1 AS release
WORKDIR /app
COPY --from=build-frontend /app/apps/api/public /app/apps/api/public
COPY --from=build-db /app/packages/db/generated /app/packages/db/generated
COPY --from=build-db /app/packages/db/prisma /app/packages/db/prisma
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/packages /app/packages
COPY apps/api/ apps/api/
COPY apps/backend/ apps/backend/

ENV NODE_ENV=production
EXPOSE 8080
CMD ["bun", "run", "apps/api/src/index.ts"]