# Just

`Just` - это удобный инструмент для выполнения команд, написанный на Rust. Он служит современной альтернативой традиционным `Makefiles`, предлагая простой синтаксис и кроссплатформенную совместимость.

## 🛠️ Установка

Следуйте инструкциям https://just.systems/man/en/

## 🚀 Использование

Создайте файл `justfile` в корне вашего проекта:

```justfile
image-name := "myimage"
container-name := "mycontainer"
host_port := "3000"
internal_port := "3000"

build:
    docker build -t {{image-name}}:latest  .

run:
  docker run -d \
    --name {{container-name}} \
    -p {{host_port}}:{{internal_port}} \
    {{image-name}}:latest

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

Запуск команд:

```bash
just           # запускает рецепт по умолчанию
just build     # запускает рецепт 'build'
just --list    # показывает все доступные рецепты
```
