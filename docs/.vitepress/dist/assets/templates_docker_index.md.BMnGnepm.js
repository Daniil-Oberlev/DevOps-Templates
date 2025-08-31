import { _ as i, c as a, o as n, af as e } from './chunks/framework.Cm3tdt7z.js'
const o = JSON.parse(
    '{"title":"🐳 Docker Templates","description":"","frontmatter":{},"headers":[],"relativePath":"templates/docker/index.md","filePath":"templates/docker/index.md"}'
  ),
  l = { name: 'templates/docker/index.md' }
function t(h, s, k, p, r, F) {
  return (
    n(),
    a('div', null, [
      ...(s[0] ||
        (s[0] = [
          e(
            `<h1 id="🐳-docker-templates" tabindex="-1">🐳 Docker Templates <a class="header-anchor" href="#🐳-docker-templates" aria-label="Permalink to “🐳 Docker Templates”">​</a></h1><p>Здесь собраны оптимизированные Dockerfile для различных языков и фреймворков.</p><h2 id="📋-доступные-шаблоны" tabindex="-1">📋 Доступные шаблоны <a class="header-anchor" href="#📋-доступные-шаблоны" aria-label="Permalink to “📋 Доступные шаблоны”">​</a></h2><ul><li><strong>Node.js</strong> - Многоступенчатый сборка для Vue/React/Node приложений</li><li><strong>Python</strong> - Оптимизированные образы для Django и FastAPI</li><li><strong>Nginx</strong> - Базовые образы с оптимизированной конфигурацией</li></ul><h2 id="🛠️-пример-использования" tabindex="-1">🛠️ Пример использования <a class="header-anchor" href="#🛠️-пример-использования" aria-label="Permalink to “🛠️ Пример использования”">​</a></h2><ol><li>Скопируйте подходящий <code>Dockerfile</code> в корень вашего проекта, переименовав его в <code>Dockerfile</code></li><li>Перенесите и обновите файл <code>.dockerignore</code> по необходимости, чтобы исключить ненужные файлы</li><li>Для удобства используйте предоставленный <code>justfile</code> для сборки, запуска, проверки и остановки Docker-контейнера</li></ol><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">image-name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> :=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;myimage&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">container-name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> :=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;mycontainer&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">host_port</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> :=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;3000&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">internal_port</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> :=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;3000&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">build:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{image-name}}:latest</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  .</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">run:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{container-name}}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{host_port}}:{{internal_port}}</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{image-name}}:latest</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">check:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    sleep</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ps</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -a</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> logs</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{container-name}}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> http://localhost:{{host_port}}/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> inspect</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --format=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;{{{{json .State.Health.Status}}}}&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{container-name}}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">stop:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> stop</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{container-name}}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {{container-name}}</span></span></code></pre></div>`,
            7
          )
        ]))
    ])
  )
}
const c = i(l, [['render', t]])
export { o as __pageData, c as default }
