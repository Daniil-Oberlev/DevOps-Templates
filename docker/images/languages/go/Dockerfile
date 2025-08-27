FROM golang:1.21-alpine AS builder

RUN apk add --no-cache git make \
    && rm -rf /var/cache/apk/* \
    && addgroup -g 1000 builder \
    && adduser -D -u 1000 -G builder builder

WORKDIR /app
COPY --chown=builder:builder go.mod go.sum ./
RUN go mod download

COPY --chown=builder:builder . .
RUN go version \
    && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build \
    -ldflags="-w -s -X main.version=${VERSION:-dev} -X main.buildTime=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    -o /app/bin/main ./cmd/app

FROM alpine:3.18 AS production

RUN apk add --no-cache ca-certificates tzdata \
    && update-ca-certificates \
    && rm -rf /var/cache/apk/* \
    && addgroup -g 1000 appgroup \
    && adduser -D -u 1000 -G appgroup appuser \
    && mkdir -p /app \
    && chown appuser:appgroup /app

ENV TZ=UTC \
    PORT=8080
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app/bin/main /app/main
USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["/app/main","healthcheck"]
EXPOSE 8080
ENTRYPOINT ["/app/main"]
