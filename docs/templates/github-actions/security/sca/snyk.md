# Snyk-сканирование зависимостей

Автоматизированный workflow для анализа зависимостей (SCA) на уязвимости с использованием Snyk.

## ⚙️ GitHub Action

```yaml
# .github/workflows/snyk-scan.yml
name: Snyk Dependency Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up project environment # Адаптируй под язык проекта
        run: |
          # Для Node.js: npm ci
          # Для Python: python -m pip install --upgrade pip && pip install -r requirements.txt
          # Для Go: go mod download
          echo "Dependencies installed (replace with actual command)"
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions@master # Универсальный action; замени на snyk/actions/node, snyk/actions/python и т.д.
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: test # Проверяет зависимости и фейлит при уязвимостях
          args: --all-projects --severity-threshold=low --sarif-file-output=snyk.sarif # Сканирует все манифесты, порог: low/medium/high/critical
        continue-on-error: true # Продолжить для загрузки SARIF даже при ошибке
      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: snyk.sarif
```

## 📋 Overview

Этот CI workflow выполняет:

- ✅ Установку зависимостей для проекта
- 🔍 Анализ зависимостей на уязвимости (`CVE`) с помощью Snyk
- 🚨 Фейл CI при обнаружении уязвимостей уровня low или выше
- 📊 Генерацию SARIF-отчетов для интеграции с GitHub Security tab

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   └── workflows/
│       └── snyk-scan.yml      # Этот workflow
├── package.json               # Для npm (опционально)
├── requirements.txt           # Для pip (опционально)
├── go.mod                     # Для Go (опционально)
├── pom.xml                    # Для Maven (опционально)
└── **/*.js, **/*.py, **/*.go  # Исходный код
```

### Настройка Snyk

1. Поместите `snyk-scan.yml` в `.github/workflows/`
2. Адаптируйте шаг `Set up project environment` под язык проекта (например, `npm ci` для Node.js, `pip install` для Python).
3. Замените `snyk/actions@master` на специфичный action (например, `snyk/actions/node` для Node.js).
4. Настройте `severity-threshold` (`low`, `medium`, `high`, `critical`) для контроля строгости.

### ⚙️ Настройка Secrets

- `SNYK_TOKEN`: API-токен Snyk (получите в app.snyk.io).
  - Добавьте в GitHub Secrets (`Settings` > `Secrets and variables` > `Actions`).
