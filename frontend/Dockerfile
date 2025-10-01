# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.11.1
ARG PNPM_VERSION=10.14.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION

# Set working directory for all build stages.
WORKDIR /app

# Install pnpm.
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

# Copy the rest of the source files into the image.
COPY . .

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
RUN pnpm config set registry https://registry.npmjs.org/ && \
    pnpm install --no-frozen-lockfile

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Run the build script.
RUN pnpm run build

################################################################################
# Production stage using Nginz to serve the static files
FROM nginx:stable-alpine AS final

WORKDIR /usr/share/nginx/html

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' >/etc/timezone \
    && rm /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/ .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
