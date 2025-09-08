# Простой CI для Python проектов

Автоматизированный workflow для проверки качества кода Python-проектов.

## ⚙️ GitHub Action

```yaml
# .github/workflows/ci-python.yml
name: CI Python

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install flake8 pytest
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
      - name: Lint with flake8
        run: flake8 . --max-line-length=120
      - name: Run tests with pytest
        run: pytest
```

## 📋 Overview

Этот CI workflow выполняет:

- 🔍 Статический анализ (`flake8`)
- 🧪 Запуск unit-тестов

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   └── workflows/
│       └── ci-python.yml  # Этот workflow
├── requirements.txt       # Зависимости (опционально)
├── pyproject.toml         # Конфигурация проекта
└── src/                   # Исходный код
```

### Поддерживаемые файлы зависимостей

- **requirements.txt** - классический формат
- **pyproject.toml** - современный формат (Poetry)
- **setup.py** - для пакетов

### ⚙️ Настройка Secrets

Не требуются - workflow работает из коробки.
