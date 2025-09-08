# 🐳 Docker Templates

Здесь собраны оптимизированные Dockerfile для различных языков и фреймворков.

## 🛠️ Пример использования

1. Скопируйте подходящий `Dockerfile` в корень вашего проекта, переименовав его в `Dockerfile`
2. Перенесите и обновите файл `.dockerignore` по необходимости, чтобы исключить ненужные файлы
3. Для удобства используйте предоставленный `justfile` для сборки, запуска, проверки и остановки Docker-контейнера

```just
image-name := "myimage"
container-name := "mycontainer"
host_port := "3000"
internal_port := "3000"

build:
    docker build -t {{image-name}}:latest  .

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
