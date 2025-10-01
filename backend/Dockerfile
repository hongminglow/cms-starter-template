# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.11.1
ARG PNPM_VERSION=10.14.0

FROM node:${NODE_VERSION}-alpine AS deps
ARG PNPM_VERSION
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm config set registry https://registry.npmjs.org/
RUN pnpm install --no-frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm prisma:generate && pnpm build

FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
# Copy built application and node_modules from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/apps/base-system/src/main.js"]
