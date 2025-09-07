# Go

Этот раздел предоставляет шаблоны для контейнеризации Go-приложений с использованием многоступенчатой сборки, а также файл .dockerignore для оптимизации Docker-образов.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Go-приложение с модульной структурой (go.mod)
- Файлы проекта находятся в корневой директории.

## 🐳 Dockerfile

```Dockerfile
FROM golang:1.21-alpine AS builder

RUN apk add --no-cache git make && \
    adduser -D -u 1000 -G builder builder

WORKDIR /app
COPY --chown=builder:builder go.mod go.sum ./
RUN go mod download

COPY --chown=builder:builder . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build \
    -ldflags="-w -s -X main.version=${VERSION:-dev} -X main.buildTime=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    -o /app/bin/main ./cmd/app

FROM alpine:3.18 AS production

RUN apk add --no-cache ca-certificates tzdata && \
    adduser -D -u 1000 appuser && \
    mkdir -p /app && \
    chown appuser:appuser /app

ENV TZ=UTC \
    PORT=8080
WORKDIR /app
COPY --from=builder --chown=appuser:appuser /app/bin/main /app/main
USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["/app/main","healthcheck"]
EXPOSE 8080
ENTRYPOINT ["/app/main"]
```

## 🚫 .dockerignore

Файл .dockerignore исключает ненужные файлы из контекста сборки, уменьшая размер образа.

```dockeignore
.vscode
.idea

.git
.github
.gitignore
.gitattributes

bin
dist
tests

.env

*.md
*.log
```

## 🚀 Использование

1. Выберите Dockerfile:
   - Скопируйте нужный Dockerfile (npm, pnpm или yarn) в корень проекта как `Dockerfile`
   - Убедитесь, что путь к main package правильный (`./cmd/app`)
2. Создайте .dockerignore:
   - Сохраните .dockerignore в корне проекта
3. Соберите образ:

::: code-group

```bash [bash]
docker build -t my-go-app:latest .

# Сборка с аргументами
docker build --build-arg VERSION=1.0.0 -t my-go-app:1.0.0 .
```

```bash [just]
just build
```

:::

4. Запустите контейнер

::: code-group

```bash [bash]
docker run -p 8080:8080 my-go-app
```

```bash [just]
just run
```

:::

5. Проверка работы:

- Откройте браузер и перейдите по адресу `http://localhost:8080`
- Проверьте healthcheck: curl `http://localhost:8080/health`

## ⚙️ Переменные окружения

| Переменная | По умолчанию | Описание                    |
| ---------- | ------------ | --------------------------- |
| PORT       | 8080         | Порт для запуска приложения |
| TZ         | UTC          | Часовой пояс                |

## 🔧 Кастомизация

### Изменение пути к main package

```Dockerfile
# Замените ./cmd/app на ваш путь
-o /app/bin/main ./your/package/path
```

### Добавление дополнительных флагов сборки

```Dockerfile
-ldflags="-w -s -X main.version=${VERSION} -X main.commit=${COMMIT_HASH}"
```

## 💡 Дополнительные рекомендации

- `Версионирование`: Используйте `--build-arg VERSION` для передачи версии
- `Healthcheck`: Настройте endpoint `/health` в вашем приложении
