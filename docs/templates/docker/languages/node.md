# Node.js

Этот раздел предоставляет шаблоны для контейнеризации Node.js приложений с использованием пакетных менеджеров `npm`, `pnpm` или `yarn`, а также файл .dockerignore для оптимизации Docker-образов.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Node.js приложение с `package.json`
- Файлы проекта находятся в корневой директории.

## 🐳 Dockerfile

::: code-group

```Dockerfile [npm]
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -S appuser

COPY --from=builder --chown=appuser:appgroup /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser

ENV NODE_ENV=production \
    PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```Dockerfile [yarn]
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine AS production

WORKDIR /app
RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -S appuser

COPY --from=builder --chown=appuser:appgroup /app/package.json /app/yarn.lock ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser

ENV NODE_ENV=production \
    PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```Dockerfile [pnpm]
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS production

WORKDIR /app
RUN addgroup -g 1000 appgroup && adduser -u 1000 -G appgroup -S appuser

COPY --from=builder --chown=appuser:appgroup /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser

ENV NODE_ENV=production \
    PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

:::

## 🚫 .dockerignore

Файл .dockerignore исключает ненужные файлы из контекста сборки, уменьшая размер образа.

```dockerignore
.vscode
.idea

node_modules
build
dist

.env
.env.local
.env.development
.env.test
.env.production

.git
.github
.gitignore
.gitattributes

*.log
*.cache

tests
__tests__
coverage

*.md
```

## 🚀 Использование

1. Выберите Dockerfile:
   - Скопируйте нужный Dockerfile (npm, pnpm или yarn) в корень проекта как `Dockerfile`
2. Создайте .dockerignore:
   - Сохраните .dockerignore в корне проекта
3. Соберите образ:

::: code-group

```bash [bash]
docker build -t my-node-app:latest .
```

```bash [just]
just build
```

:::

4. Запустите контейнер:

::: code-group

```bash [bash]
docker run -p 3000:3000 my-node-app

# Сборка с аргументами
docker run -p 3000:3000 -e PORT=3000 -e NODE_ENV=production my-node-app
```

```bash [just]
just run
```

:::

5. Откройте приложение:

- Перейдите по адресу `http://localhost:3000`
- Проверьте healthcheck: `curl http://localhost:8080/health`

## ⚙️ Переменные окружения

| Переменная | По умолчанию | Описание                    |
| ---------- | ------------ | --------------------------- |
| NODE_ENV   | production   | Окружение выполнения        |
| PORT       | 3000         | Порт для запуска приложения |

## 🔧 Кастомизация

### Изменение пути запуска

```Dockerfile
# Для Express.js
CMD ["node", "dist/app.js"]

# Для NestJS
CMD ["node", "dist/main.js"]

# Для приложений с точкой входа index.js
CMD ["node", "dist/index.js"]
```

### Добавление дополнительных переменных

```Dockerfile
ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_URL=postgresql://user:pass@db:5432/mydb \
    REDIS_URL=redis://redis:6379
```

### Использование docker-compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    # ... конфигурация базы данных

  redis:
    image: redis:6-alpine
    # ... конфигурация redis
```

## 💡 Дополнительные рекомендации

- **Пакетный менеджер**: Используйте pnpm для скорости и эффективности
- **Healthcheck**: Настройте endpoint `/health` в вашем приложении
