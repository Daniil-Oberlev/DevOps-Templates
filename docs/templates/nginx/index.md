# 🛡️ Nginx Templates

Здесь собраны оптимизированные конфигурации для веб-сервера Nginx, подходящие для различных сценариев, таких как статические/spa сайты, reverse proxy или балансировка нагрузки.

## 🛠️ Пример использования

1. Скопируйте подходящий файл конфигурации (`nginx.conf`) в папку `nginx/` вашего проекта.
2. Перенесите и обновите файл `.dockerignore` по необходимости, чтобы исключить ненужные файлы.
3. Для удобства используйте предоставленный `justfile` для сборки, запуска, проверки и остановки Nginx-контейнера.

```just
image-name := "my-nginx"
container-name := "my-nginx-container"
host_port := "8080"
internal_port := "80"

build:
    docker build -t {{image-name}}:latest .

run:
    docker run -d --name {{container-name}} -p {{host_port}}:{{internal_port}} {{image-name}}:latest

check:
    sleep 5
    docker ps -a
    docker logs {{container-name}}
    curl -f http://localhost:{{host_port}}/
    docker inspect --format='{{{{json .State.Health.Status}}}}' {{container-name}}

stop:
    docker stop {{container-name}}
    docker rm {{container-name}}
```
