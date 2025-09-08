# Semgrep SAST-анализ

Автоматизированный workflow для статического анализа кода (SAST) с использованием Semgrep для выявления уязвимостей, багов и проблем качества.

## ⚙️ GitHub Action

```yaml
# .github/workflows/semgrep-scan.yml
name: Semgrep Code Scan
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

permissions:
  contents: read
  security-events: write # Для загрузки SARIF в Security tab

jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python # Требуется для запуска Semgrep
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install Semgrep
        run: pip install semgrep
      - name: Run Semgrep
        run: |
          semgrep ci --sarif > semgrep.sarif
        env:
          SEMGREP_RULES: p/default # Встроенные правила (default, security, ci и т.д.)
          # SEMGREP_RULES: .github/semgrep-rules.yml  # Раскомментируй для кастомных правил
        continue-on-error: true # Продолжить для загрузки SARIF даже при ошибке
      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: semgrep.sarif
```

## 📋 Overview

Этот CI workflow выполняет:

- ✅ Установку Semgrep для анализа кода
- 🔍 Статический анализ (SAST) на уязвимости, баги и проблемы качества
- 🚨 Генерацию SARIF-отчетов для интеграции с GitHub Security tab
- 🔄 Поддержку встроенных и кастомных правил анализа

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   ├── semgrep-rules.yml                         # Кастомные правила Semgrep (опционально)
│   └── workflows/
│       └── semgrep-scan.yml                      # Этот workflow
├── **/*.js, **/*.py, **/*.java, **/*.go          # Исходный код
└── go.mod, package.json, requirements.txt, etc.  # Манифесты зависимостей (опционально)
```

### Конфигурация Semgrep (рекомендуется):

Создайте файл `.github/semgrep-rules.yml` для кастомизации правил:

```yaml
# .github/semgrep-rules.yml
rules:
  - id: no-hardcoded-credentials
    patterns:
      - pattern: password = "..."
    message: Hardcoded credentials detected
    severity: ERROR
    languages: [python]
```

### ⚙️ Настройка Secrets

Не требуются - workflow работает из коробки.
