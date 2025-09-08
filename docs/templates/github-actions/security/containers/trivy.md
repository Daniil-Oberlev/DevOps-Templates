# Trivy-сканирование контейнеров

Автоматизированный workflow для сканирования Docker-образов на уязвимости с использованием Trivy.

## ⚙️ GitHub Action

```yaml
# .github/workflows/trivy-scan.yml
name: Trivy Container Scan

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
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image # Опционально: сборка образа
        run: |
          docker build -t my-app:latest .
        # Раскомментируй, если образ нужно собрать
        # Замени my-app:latest на имя твоего образа
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'my-app:latest' # Укажи образ (локальный или в реестре, например, docker.io/my-app:latest)
          format: 'sarif' # Формат отчета для GitHub
          output: 'trivy.sarif'
          severity: 'HIGH,CRITICAL' # Фейл CI на уязвимости HIGH и CRITICAL
        # Для private реестров добавь:
        # env:
        #   DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
        #   DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy.sarif
```

## 📋 Overview

Этот CI workflow выполняет:

- ✅ Сборку Docker-образа (опционально)
- 🔍 Сканирование образа на уязвимости (`CVE`) с помощью Trivy
- 🚨 Фейл CI при обнаружении уязвимостей уровня `HIGH` или `CRITICAL`
- 📊 Генерацию SARIF-отчета для интеграции с GitHub Security tab

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   └── workflows/
│       └── trivy-scan.yml  # Этот workflow
├── Dockerfile              # Файл для сборки образа
├── .trivyignore            # Конфигурация trivy (опционально)
└── **/*.go, **/*.py, etc.  # Исходный код (опционально)
```

### Конфигурация Trivy (опционально)

Для кастомизации добавьте параметры в шаг `Run Trivy vulnerability scanner`, например:

- `ignore-unfixed: true` - игнорировать уязвимости без исправлений.
  `vuln-type: os,library` - сканировать пакеты ОС и библиотеки.

> Игнор уязвимостей: Создай файл `.trivyignore` в корне репозитория для исключения конкретных CVE

```bash
# .trivyignore
CVE-2023-12345
```

### ⚙️ Настройка Secrets

- Для private реестров:
  - `DOCKER_USERNAME`: Имя пользователя реестра (например, Docker Hub, AWS ECR).
  - `DOCKER_PASSWORD`: Пароль или токен доступа.
  - Добавьте в GitHub Secrets (`Settings` > `Secrets and variables` > `Actions`).

> Если образ локальный или в публичном реестре, секреты не требуются.
