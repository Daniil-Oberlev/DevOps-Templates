# Docker для Python

Этот раздел предоставляет шаблоны для контейнеризации Python-приложений с использованием `pip`, `uv` или `poetry`, а также файл .dockerignore для оптимизации Docker-образов.

## 📋 Предварительные требования

- Установлен [Docker](https://www.docker.com/get-started).
- Python-приложение с `requirements.txt`, `pyproject.toml` или `poetry.lock`
- Файлы проекта находятся в корневой директории.

## 🐳 Dockerfile

::: code-group

```Dockerfile [requirements.txt]
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

COPY . .

FROM python:3.11-slim AS production

WORKDIR /app

RUN groupadd -g 1000 appgroup && \
    useradd -u 1000 -g appgroup -s /bin/bash -m appuser && \
    chown appuser:appgroup /app

RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder --chown=appuser:appgroup /root/.local /home/appuser/.local
COPY --from=builder --chown=appuser:appgroup /app .

USER appuser

ENV PATH="/home/appuser/.local/bin:${PATH}" \
    PYTHONPATH="/app" \
    PYTHONUNBUFFERED=1 \
    PORT=8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 8000
CMD ["python", "-m", "app.main"]
```

```Dockerfile [uv]
FROM python:3.11-slim AS builder

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock .

RUN uv pip install --system -r pyproject.toml

COPY . .

FROM python:3.11-slim AS production

WORKDIR /app

RUN groupadd -g 1000 appgroup && \
    useradd -u 1000 -g appgroup -s /bin/bash -m appuser && \
    chown appuser:appgroup /app

COPY --from=builder --chown=appuser:appgroup /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder --chown=appuser:appgroup /app .

USER appuser

ENV PYTHONPATH="/app" \
    PYTHONUNBUFFERED=1 \
    PORT=8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 8000
CMD ["python", "-m", "app.main"]
```

```Dockerfile [poetry]
FROM python:3.11-slim AS builder

WORKDIR /app

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock .

RUN poetry config virtualenvs.create false && \
    poetry install --only main --no-interaction --no-ansi

COPY . .

FROM python:3.11-slim AS production

WORKDIR /app

RUN groupadd -g 1000 appgroup && \
    useradd -u 1000 -g appgroup -s /bin/bash -m appuser && \
    chown appuser:appgroup /app

COPY --from=builder --chown=appuser:appgroup /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder --chown=appuser:appgroup /app .

USER appuser

ENV PYTHONPATH="/app" \
    PYTHONUNBUFFERED=1 \
    PORT=8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

EXPOSE 8000
CMD ["python", "-m", "app.main"]
```

:::

## 🚫 .dockerignore

Файл .dockerignore исключает ненужные файлы из контекста сборки, уменьшая размер образа.

```dockerignore
.vscode
.idea

venv
.venv

__pycache__
*.pyc
*.pyo
*.pyd

.env
.env.local
.env.production
.env.development

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

*.ipynb
.ipynb_checkpoints/
```

## 🚀 Использование

1. Выберите Dockerfile:
   - Скопируйте нужный Dockerfile (pip, uv или poetry) в корень проекта
2. Создайте .dockerignore:
   - Сохраните .dockerignore в корне проекта
3. Соберите образ:

::: code-group

```bash [bash]
docker build -t my-python-app:latest .
```

```bash [just]
just build
```

:::

4. Запустите контейнер:

::: code-group

```bash [bash]
docker run -p 8000:8000 my-python-app

# Сборка с аргументами
docker run -p 8000:8000 -e PORT=8000 -e DEBUG=0 my-python-app
```

```bash [just]
just run
```

:::

5. Откройте приложение:

- Перейдите по адресу `http://localhost:8000`
- Проверьте healthcheck: `curl http://localhost:8080/health`
- Откройте в браузере: `open http://localhost:8000`

## ⚙️ Переменные окружения

| Переменная       | По умолчанию | Описание                        |
| ---------------- | ------------ | ------------------------------- |
| PORT             | 3000         | Порт для запуска приложения     |
| PYTHONUNBUFFERED | 1            | Не буферизовать stdout/stderr   |
| PYTHONPATH       | /app         | Путь для импорта модулей Python |
| DEBUG            | 0            | Режим отладки (0/1)             |

## 🔧 Кастомизация

### Изменение точки входа

```bash
# Для FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Для Django
CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]

# Для Flask
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

### Добавление дополнительных переменных

```Dockerfile
ENV PYTHONPATH="/app" \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    DATABASE_URL=postgresql://user:pass@db:5432/mydb \
    REDIS_URL=redis://redis:6379/0 \
    DEBUG=0
```

## 💡 Дополнительные рекомендации

- **uv**: Рекомендуется для скорости установки зависимостей
- **PYTHONUNBUFFERED=1**: Для immediate вывода логов
- **Healthcheck**: Настройте endpoint `/health` в вашем приложении
