# CI для Go-проектов

Автоматизированный workflow для проверки качества кода Go-проектов.

## ⚙️ GitHub Action

```yaml
# .github/workflows/ci-go.yml
name: CI Go

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
      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.21'
          cache: true
      - name: Check formatting
        run: test -z "$(gofmt -l .)"
      - name: Run golangci-lint
        uses: golangci/golangci-lint-action@v6
        with:
          version: latest
      - name: Run tests
        run: go test -v ./...
```

## 📋 Overview

Этот CI workflow выполняет:

- ✅ Проверку форматирования кода (`gofmt`)
- 🔍 Статический анализ (`golangci-lint`)
- 🧪 Запуск unit-тестов
- 🔄 Кэширование зависимостей

## 🛠️ Требования

### Файлы в репозитории

```bash
.
├── .github/
│   └── workflows/
│       └── ci-go.yml   # Этот workflow
├── .golangci.yml       # Конфигурация linter (опционально)
├── go.mod              # Go modules
├── go.sum              # Зависимости
└── **/*.go             # Исходный код
```

### Конфигурация golangci-lint (рекомендуется):

```yml
# .golangci.yml
linters:
  enable:
    - govet
    - errcheck
    - staticcheck
    - gosec
    - revive

issues:
  exclude-use-default: false
  max-issues-per-linter: 0
  max-same-issues: 0
```

### ⚙️ Настройка Secrets

Не требуются - workflow работает из коробки.
