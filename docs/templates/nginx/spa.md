# Nginx для SPA

Этот раздел предоставляет шаблон для контейнеризации одностраничного приложения (SPA) с использованием Nginx и многоступенчатой сборки для сборки фронтенда.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Проект SPA (например, React, Vue, Vite) с файлами `package.json` и сборкой в папку `dist`.
- Конфигурация Nginx (`default.conf`) настроена для проекта.

## 🐳 Dockerfile

```Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.28-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fs http://localhost/ || exit 1
```

## 🛡️ Nginx Configuration

```nginx
# nginx/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(json|xml)$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Опционально: проксирование API-запросов к backend
    # location /api/ {
    #     proxy_pass http://backend:3000/;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    # }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss text/javascript;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## 🚫 .dockerignore

Файл `.dockerignore` исключает ненужные файлы из контекста сборки, уменьшая размер образа.

```dockerignore
.vscode
.idea

.git
.github
.gitignore
.gitattributes

*.log
```

## 🚀 Использование

1. Скопируйте файлы:

- Скопируйте `Dockerfile`, `default.conf`, `package.json` и файлы проекта в папку `nginx/` проекта.
- Убедитесь, что `npm run build` создаёт папку `dist`.

2. Создайте `.dockerignore`:

- Сохраните `.dockerignore` в корне проекта.

3. Соберите образ:

::: code-group

```bash [bash]
docker build -t my-nginx:latest .
```

```bash [just]
just build
```

:::

4. Запустите контейнер:

::: code-group

```bash [bash]
docker run -p 8080:80 my-nginx:latest
```

```bash [just]
just run
```

5. Проверка работы:

- Откройте браузер и перейдите по адресу `http://localhost:8080`.
- Проверьте healthcheck: `curl http://localhost:8080/`.

| Переменная | По умолчанию | Описание               |
| ---------- | ------------ | ---------------------- |
| NGINX_PORT | 80           | Порт для запуска Nginx |

## 🔧 Кастомизация

### Изменение пути к собранным файлам

```Dockerfile
# Dockerfile
COPY --from=builder /app/build /usr/share/nginx/html  # Если сборка создаёт папку build
```

### Проксирование API

```nginx
# default.conf
location /api/ {
    proxy_pass http://backend:3000/;
}
```
