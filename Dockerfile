FROM node:22.11.0-slim AS base


ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install --global corepack@latest

RUN corepack enable pnpm
WORKDIR /usr/src/app
COPY . .


FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


FROM nginx:alpine
COPY conf /etc/nginx/conf.d
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
ENV NODE_ENV=production
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
