# Dependabot автоматизация обновления зависимостей

Конфигурация для автоматического мониторинга и обновления зависимостей в проекте с использованием Dependabot.

## ⚙️ GitHub Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  # Конфигурация для npm (JavaScript/TypeScript)
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'daily'
    open-pull-requests-limit: 10
    target-branch: 'develop'
    labels: ['dependencies', 'javascript']
    # ignore:  # Игнорировать определенные зависимости
    #   - dependency-name: "express"
    #     versions: ["4.x"]

  # Конфигурация для pip (Python)
  - package-ecosystem: 'pip'
    directory: '/' # Путь к requirements.txt или pyproject.toml
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
    target-branch: 'develop'
    labels: ['dependencies', 'python']

  # Конфигурация для Docker
  - package-ecosystem: 'docker'
    directory: '/' # Путь к Dockerfile или docker-compose.yml
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
    target-branch: 'develop'
    labels: ['dependencies', 'docker']

  # Конфигурация для GitHub Actions
  - package-ecosystem: 'github-actions'
    directory: '/' # Путь к .github/workflows
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
    target-branch: 'develop'
    labels: ['dependencies', 'github-actions']
```

## 📋 Overview

Эта конфигурация Dependabot выполняет:

- ✅ Автоматическую проверку обновлений зависимостей для npm, pip, Docker и GitHub Actions
- 🔄 Создание pull request'ов с обновлениями в ветку `develop`
- 📊 Применение меток для удобной фильтрации PR
- 🕒 Периодические проверки (ежедневно для npm, еженедельно для pip, Docker, GitHub Actions)

## 🛠️ Требования

### Структура проекта

```bash
.
├── .github/
│   └── dependabot.yml         # Эта конфигурация
├── package.json               # Для npm (опционально)
├── requirements.txt           # Для pip (опционально)
├── Dockerfile                 # Для Docker (опционально)
├── docker-compose.yml         # Для Docker (опционально)
└── **/*.js, **/*.py, **/*.go  # Исходный код
```

### Настройка Dependabot

1. Поместите `dependabot.yml` в `.github/`.
2. Активируйте Dependabot в `Settings` > `Code security and analysis` > `Dependency graph` и `Dependabot alerts`.
3. Настройте `directory` и `target-branch` под структуру проекта.
4. (Опционально) Добавьте секцию `ignore` для исключения зависимостей.

### ⚙️ Настройка Secrets

Не требуются - Dependabot работает из коробки.
