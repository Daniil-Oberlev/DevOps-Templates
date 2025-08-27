#!/usr/bin/env bash
set -e

ROOT_DIR=$(pwd)
NEXT_DIR="$ROOT_DIR/docker/images/frontend/next"

cleanup() {
    echo "Запуск очистки..."

    cd "$NEXT_DIR"

    if docker ps -a --format '{{.Names}}' | grep -q "^next-app$"; then
        echo "Останавливаем и удаляем контейнер next-app..."
        docker stop next-app >/dev/null 2>&1 || true
        docker rm next-app >/dev/null 2>&1 || true
    fi

    if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^next-app:latest$"; then
        echo "Удаляем образ next-app:latest..."
        docker rmi next-app:latest >/dev/null 2>&1 || true
    fi

    if [ -d "next-app" ]; then
        echo "Удаляем директорию next-app..."
        rm -rf next-app
    fi

    echo "Очистка завершена!"
}

trap cleanup EXIT

cd "$NEXT_DIR"
npx create-next-app@latest next-app --yes
cd next-app

cat > next.config.ts << 'EOL'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone'
};

export default nextConfig;
EOL

cp ../Dockerfile.npm ./Dockerfile

docker build -t next-app:latest .
docker run -d --name next-app -p 3000:3000 next-app:latest

echo "Ждем запуска..."
sleep 3

echo "Проверяем работу сервиса..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ Сервис работает (HTTP $STATUS_CODE)"
else
    echo "❌ Сервис не отвечает (HTTP $STATUS_CODE)"
    exit 1
fi

