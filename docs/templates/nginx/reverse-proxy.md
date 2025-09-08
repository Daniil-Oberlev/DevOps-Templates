# 🛡️ Nginx для Reverse Proxy

Этот раздел предоставляет шаблон для контейнеризации Nginx в роли reverse proxy, перенаправляющего запросы к frontend (например, порт 5173) и backend (например, API на порту 3000).

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Frontend-сервер (например, `frontend:5173`) и backend-сервер (например, `backend:3000`) доступны в Docker-сети.
- Конфигурация Nginx (`default.conf`) настроена для проекта.

## 🐳 Dockerfile

```Dockerfile
# nginx/Dockerfile
FROM nginx:1.28-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fs http://localhost/health || exit 1
```

## 🛡️ Nginx Configuration

```nginx
# nginx/default.conf
server {
    listen 80;
    server_name localhost;

    location /health {
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://frontend:5173/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
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

- Скопируйте `Dockerfile` и `default.conf` в папку `nginx/` проекта.
- Убедитесь, что frontend (`frontend:5173`) и backend (`backend:3000`) доступны в Docker-сети.

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

:::

5. Проверка работы:

- Проверьте reverse proxy: `curl http://localhost:8080/` (должен ответить frontend).
- Проверьте API: `curl http://localhost:8080/api/` (должен ответить backend).
- Проверьте healthcheck: `curl http://localhost:8080/health` (должен вернуть healthy).

| Переменная | По умолчанию | Описание               |
| ---------- | ------------ | ---------------------- |
| NGINX_PORT | 80           | Порт для запуска Nginx |

## 🔧 Кастомизация

### Изменение backend или frontend адресов

```nginx
# default.conf
location /api/ {
    proxy_pass http://my-api:8080/;
}
location / {
    proxy_pass http://my-frontend:3000/;
}
```
