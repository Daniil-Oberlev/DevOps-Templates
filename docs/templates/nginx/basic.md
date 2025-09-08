# 🛡️ Nginx для статического сайта

Этот раздел предоставляет шаблон для контейнеризации статического сайта с использованием Nginx.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Статические файлы (`index.html`, `50x.html`) находятся в папке `nginx/`.
- Конфигурация Nginx (`default.conf`) настроена для проекта.

## 🐳 Dockerfile

```Dockerfile
# nginx/Dockerfile
FROM nginx:1.28-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/index.html /usr/share/nginx/html/
COPY nginx/50x.html /usr/share/nginx/html/

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -fs http://localhost/ || exit 1
```

## 🛡️ Nginx Configuration

```nginx
# nginx/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
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

- Скопируйте `Dockerfile`, `default.conf`, `index.html`, `50x.html` в папку `nginx/` проекта.
- Убедитесь, что пути к файлам в `Dockerfile` и `default.conf` корректны.

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

### Изменение путей к статическим файлам

```Dockerfile
# Замените nginx/index.html на ваш путь
COPY path/to/your/static/index.html /usr/share/nginx/html/
```

### Настройка порта

```nginx
# default.conf
listen 8080;  # Измените порт, если требуется
```
