# 🛡️ Nginx для Load Balancer

Этот раздел предоставляет шаблон для контейнеризации Nginx в роли load balancer, распределяющего запросы между несколькими backend-серверами. В будущем будут добавлены шаблоны для reverse proxy, SPA и SSL.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Backend-серверы (например, `backend1:3000`, `backend2:3000`, `backend3:3000`) доступны в Docker-сети.
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
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend1:3000;
        server backend2:3000;
        server backend3:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            proxy_pass http://backend/health;
            proxy_set_header Host $host;
        }
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
- Убедитесь, что upstream-серверы (например, `backend1:3000`) доступны в Docker-сети.

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

- Откройте браузер и перейдите по адресу `http://localhost:8080`.
- Проверьте healthcheck: `curl http://localhost:8080/`.

## ⚙️ Переменные окружения

| Переменная | По умолчанию | Описание               |
| ---------- | ------------ | ---------------------- |
| NGINX_PORT | 80           | Порт для запуска Nginx |

## 🔧 Кастомизация

### Изменение upstream-серверов

```nginx
# default.conf
upstream backend {
    server app1:3000;
    server app2:3001;
}
```
