FROM nginx:1.25-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY index.html /usr/share/nginx/html/
COPY 50x.html /usr/share/nginx/html/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
