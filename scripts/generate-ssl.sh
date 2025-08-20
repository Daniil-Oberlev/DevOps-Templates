#!/usr/bin/env bash
set -euo pipefail

SSL_DIR="./ssl"
mkdir -p $SSL_DIR

openssl genrsa -out $SSL_DIR/dummy.key 2048

openssl req -new -x509 -key $SSL_DIR/dummy.key \
    -out $SSL_DIR/dummy.crt \
    -days 3650 \
    -subj "//CN=localhost"

openssl dhparam -out $SSL_DIR/dhparam.pem 2048

echo "SSL сертификаты сгенерированы в папке $SSL_DIR/"
echo "Файлы:"
echo "  - dummy.key    : Приватный ключ"
echo "  - dummy.crt    : Сертификат"
echo "  - dhparam.pem  : DH параметры"
