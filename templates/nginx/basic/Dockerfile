FROM nginx:1.28-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/index.html /usr/share/nginx/html/
COPY nginx/50x.html /usr/share/nginx/html/

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -fs http://localhost/ || exit 1
