# Dockerfile Линтинг

Автоматизированный workflow для проверки `Dockerfile` на соответствие лучшим практикам с использованием Hadolint.

## ⚙️ GitHub Action

```yaml
# .github/workflows/dockerfile-lint.yml
name: Dockerfile Lint

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Hadolint
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: Dockerfile # Путь к Dockerfile
          # config: .hadolint.yaml  # Раскомментируй для кастомных правил
          failure-threshold: warning # Фейл CI на warning и выше (info, warning, error)
```

## 📋 Overview

Этот CI workflow выполняет:

- ✅ Линтинг `Dockerfile` с помощью Hadolint
- 🔍 Проверку на best practices (например, избегание `latest` тегов, минимизация слоев)
- 🚨 Фейл CI при предупреждениях или ошибках (настраиваемый порог)
- 🔄 Поддержка кастомных правил через .hadolint.yaml

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   └── workflows/
│       └── dockerfile-lint.yml  # Этот workflow
├── .hadolint.yaml               # Конфигурация Hadolint (опционально)
└── Dockerfile                   # Файл для линтинга
```

### Конфигурация Hadolint (рекомендуется)

Создайте файл `.hadolint.yaml` в корне репозитория для настройки правил:

```yaml
# .hadolint.yaml
ignored:
  - DL3007 # Игнорировать правило "Using latest tag"
  - DL3006 # Игнорировать правило о явном указании версии образа
```

### ⚙️ Настройка Secrets

Не требуются - workflow работает из коробки.
