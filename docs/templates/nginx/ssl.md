# Nginx для SSL

Этот раздел предоставляет шаблон для контейнеризации Nginx с поддержкой HTTPS для статического сайта, используя SSL-сертификаты.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Статические файлы (например, `index.html`) находятся в папке `nginx/` или другой указанной директории.
- SSL-сертификаты (`dummy.crt`, `dummy.key`) находятся в папке `nginx/ssl/`. Для продакшена замените на реальные сертификаты.

## 🐳 Dockerfile

```Dockerfile
FROM nginx:1.28-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/ssl/ /etc/nginx/ssl/

USER nginx

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fs --insecure https://localhost/ || exit 1
```

## 🛡️ Nginx Configuration

```nginx
# nginx/default.conf
server {
    listen 80;
    server_name localhost;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate /etc/nginx/ssl/dummy.crt;
    ssl_certificate_key /etc/nginx/ssl/dummy.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
    }

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

- Скопируйте `Dockerfile`, `default.conf` и папку `ssl/`(с `dummy.crt`, `dummy.key`) в папку `nginx/` проекта.
- Добавьте статические файлы (например, `index.html`) в `nginx/` или настройте путь в `default.conf`.

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

- Откройте браузер и перейдите по адресу `https://localhost:8443` (игнорируйте предупреждение о самоподписанном сертификате).
- Проверьте healthcheck: `curl --insecure https://localhost:8443/`.
- Проверьте перенаправление: `curl http://localhost:8080/` (должен вернуть 301).

## ⚙️ Переменные окружения

| Переменная | По умолчанию | Описание              |
| ---------- | ------------ | --------------------- |
| NGINX_PORT | 80, 443      | Порт для HTTP и HTTPS |

## 🔧 Кастомизация

### Замена сертификатов

```Dockerfile
# Dockerfile
COPY path/to/real/ssl/ /etc/nginx/ssl/
```

```nginx
# default.conf
ssl_certificate /etc/nginx/ssl/real.crt;
ssl_certificate_key /etc/nginx/ssl/real.key;
```

### Изменение пути к статическим файлам

```nginx
# default.conf
location / {
    root /path/to/your/html;
}
```
