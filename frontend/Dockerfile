FROM node:22-alpine AS dependencias

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci --workspace=@uptimesys/frontend --include-workspace-root=false

FROM node:22-alpine AS compilacao

WORKDIR /app

COPY --from=dependencias /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
COPY frontend ./frontend

ARG URL_API=http://backend:4001
ENV URL_API=${URL_API}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build --workspace=@uptimesys/frontend

FROM node:22-alpine AS execucao

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=compilacao /app/node_modules ./node_modules
COPY --from=compilacao /app/package.json ./package.json
COPY --from=compilacao /app/package-lock.json ./package-lock.json
COPY --from=compilacao /app/backend/package.json ./backend/package.json
COPY --from=compilacao /app/frontend ./frontend

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@uptimesys/frontend"]
