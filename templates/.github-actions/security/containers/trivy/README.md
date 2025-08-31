# Trivy

Папка `trivy` содержит шаблон `trivy-scan.yml` для сканирования Docker-образов на уязвимости с помощью Trivy. Workflow проверяет образы на известные `CVE` и интегрируется с GitHub Security tab через SARIF-отчеты.

## Примечания

- Trivy поддерживает сканирование локальных образов, реестров (Docker Hub, ECR) и файловых систем.

> Для private реестров добавьте credentials в GitHub Secrets.
