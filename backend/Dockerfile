FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

RUN npm ci --workspace=@uptimesys/backend --include-workspace-root=false

COPY backend/src ./backend/src

ENV NODE_ENV=production
ENV PORTA_API=4001
ENV ENDERECO_API=0.0.0.0

EXPOSE 4001

CMD ["npm", "run", "start", "--workspace=@uptimesys/backend"]
