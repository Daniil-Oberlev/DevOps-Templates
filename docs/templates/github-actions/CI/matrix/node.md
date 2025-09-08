# Матричный CI для Node.js-проектов

Автоматизированный workflow для проверки качества кода Node.js-проектов.

## ⚙️ GitHub Action

```yaml
# .github/workflows/ci-nodejs.yml
name: CI Node.js

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
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint with ESLint
        run: npm run lint
      - name: Run tests
        run: npm test
```

## 📋 Overview

Этот CI workflow выполняет:

- 🔍 Статический анализ (`ESLint`)
- 🧪 Запуск unit-тестов
- 🔄 Кэширование зависимостей

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   └── workflows/
│       └── ci-nodejs.yml  # Этот workflow
├── package.json           # Зависимости и скрипты
├── package-lock.json      # Lock-файл
├── .eslintrc.js           # Конфигурация ESLint
└── src/                   # Исходный код
```

### Конфигурация package.json (обязательные скрипты):

```json
{
  "scripts": {
    "lint": "eslint src/",
    "test": "jest --coverage"
  }
}
```

### ⚙️ Настройка Secrets

Не требуются - workflow работает из коробки.
