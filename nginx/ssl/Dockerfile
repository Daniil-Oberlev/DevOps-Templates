FROM nginx:1.25-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/
COPY ssl/ /etc/nginx/ssl/

EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f https://localhost/ || curl -f http://localhost/ || exit 1
