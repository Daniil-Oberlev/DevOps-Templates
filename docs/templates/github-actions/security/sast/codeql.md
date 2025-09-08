# CodeQL SART-анализ

Автоматизированный workflow для статического анализа кода (SAST) с использованием GitHub CodeQL для выявления уязвимостей и багов.

## ⚙️ GitHub Action

```yaml
# .github/workflows/codeql-analysis.yml
name: CodeQL Analysis
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0' # Каждое воскресенье в 00:00 UTC
  workflow_dispatch:

permissions:
  actions: read
  contents: read
  security-events: write # Для загрузки SARIF в Security tab

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }} # Языки определяются в матрице
          # queries: +security-and-quality  # Раскомментируй для включения дополнительных запросов
          # config-file: .github/codeql-config.yml  # Раскомментируй для кастомной конфигурации
      - name: Autobuild # Автоматическая сборка для компилируемых языков (C/C++, Java, Go)
        uses: github/codeql-action/autobuild@v3
        # Замени на custom build для специфичных проектов, например:
        # run: |
        #   npm ci && npm run build  # Для Node.js
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: 'codeql/${{ matrix.language }}'
    strategy:
      fail-fast: false
      matrix:
        language: ['javascript', 'python', 'java', 'go']
        # Добавь другие языки: cpp, csharp, ruby, etc.
```

## 📋 Overview

Этот CI workflow выполняет:

- ✅ Инициализацию CodeQL для анализа кода
- 🔍 Статический анализ (SAST) на уязвимости, баги и проблемы качества
- 🚨 Генерацию SARIF-отчетов для интеграции с GitHub Security tab
- 🔄 Автоматическую сборку для компилируемых языков (C/C++, Java, Go)

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   └── workflows/
│       └── codeql-analysis.yml           # Этот workflow
├── .github/
│   └── codeql-config.yml                 # Конфигурация CodeQL (опционально)
├── **/*.js, **/*.py, **/*.java, **/*.go  # Исходный код
└── go.mod, package.json, pom.xml, etc.   # Манифесты зависимостей (опционально)
```

### Конфигурация CodeQL (рекомендуется):

Создайте файл `.github/codeql-config.yml` для кастомизации анализа:

```yaml
# .github/codeql-config.yml
name: Custom CodeQL Config
paths:
  - 'src/**' # Сканировать только папку src
paths-ignore:
  - 'tests/**' # Игнорировать тесты
  - 'vendor/**' # Игнорировать зависимости
queries:
  - uses: security-and-quality # Стандартные запросы
  - uses: ./custom-queries/my-rule.ql # Кастомные запросы
disable-default-queries: false
```

### ⚙️ Настройка Secrets

Не требуются - workflow работает из коробки.
