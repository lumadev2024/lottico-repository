# Builds and runs only apps/backend from this pnpm monorepo. Build context is
# the repo root (not apps/backend) so this can see pnpm-workspace.yaml and the
# root lockfile — losing that visibility is exactly what broke the Railway
# Railpack build earlier (ERR_PNPM_IGNORED_BUILDS).
#
# A single stage (no separate slim "runner" stage) is used deliberately: the
# earlier Railpack build/deploy split silently dropped `.medusa` (Medusa's own
# build output directory, not a convention Railpack recognizes) between its
# build and run images, which crashed `medusa start` with "Could not find
# index.html in the admin build directory". Docker's own COPY semantics don't
# have that ambiguity, but a multi-stage copy could reintroduce the same class
# of bug if something is missed — staying in one stage removes the question
# entirely. Trimming the image is a later optimization, not a correctness fix.
FROM node:22

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.11.2 --activate

# Only the files pnpm needs to resolve the workspace and install dependencies
# with cache-friendly layering, before the rest of the source invalidates it.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/storefront/package.json apps/storefront/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @dtc/backend build

ENV NODE_ENV=production
WORKDIR /app/apps/backend

EXPOSE 9000

CMD ["pnpm", "start"]
