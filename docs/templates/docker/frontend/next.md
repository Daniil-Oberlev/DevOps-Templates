# Next.js

Этот раздел предоставляет шаблоны для контейнеризации Next-приложений с использованием пакетных менеджеров `npm`, `pnpm` или `yarn`, а также файл .dockerignore для оптимизации Docker-образов.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- React-приложение, созданное с помощью `Vite` или другой CLI.
- Файлы проекта находятся в корневой директории.

## 🚨 Предупреждение

> _Работает только с standalone-mode._

```typescript
//next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone'
}
```

## 🐳 Dockerfile

::: code-group

```Dockerfile [npm]
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD pgrep node || exit 1
ENV NODE_ENV=production
CMD ["node","server.js"]
```

```Dockerfile [yarn]
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:18-alpine AS runner

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD pgrep node || exit 1
ENV NODE_ENV=production
CMD ["node","server.js"]
```

```Dockerfile [pnpm]
FROM node:18-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:18-alpine AS runner

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD pgrep node || exit 1
ENV NODE_ENV=production
CMD ["node","server.js"]
```

:::

## 🚫 .dockerignore

Файл .dockerignore исключает ненужные файлы из контекста сборки, уменьшая размер образа.

```dockeignore
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
docker build -t my-next-app:latest .
```

```bash [just]
just build
```

:::

4. Запустите контейнер

::: code-group

```bash [bash]
docker run -p 3000:3000 my-next-app
```

```bash [just]
just run
```

:::

5. Откройте приложение:

- Перейдите по адресу `http://localhost:3000`

## 💡 Дополнительные рекомендации

- **Пакетный менеджер**: Используйте pnpm для скорости и эффективности
- **Nginx**: Настройте кэширование и сжатие в Nginx
- **CI/CD**: Интегрируйте сборку в GitHub Actions
