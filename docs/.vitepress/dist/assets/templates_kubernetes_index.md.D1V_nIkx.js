import { _ as a, c as r, o as s, j as t, a as n } from './chunks/framework.Cm3tdt7z.js'
const b = JSON.parse(
    '{"title":"Kubernetes","description":"","frontmatter":{},"headers":[],"relativePath":"templates/kubernetes/index.md","filePath":"templates/kubernetes/index.md"}'
  ),
  o = { name: 'templates/kubernetes/index.md' }
function d(i, e, l, c, p, m) {
  return (
    s(),
    r('div', null, [
      ...(e[0] ||
        (e[0] = [
          t(
            'h1',
            { id: 'kubernetes', tabindex: '-1' },
            [
              n('Kubernetes '),
              t(
                'a',
                {
                  'class': 'header-anchor',
                  'href': '#kubernetes',
                  'aria-label': 'Permalink to “Kubernetes”'
                },
                '​'
              )
            ],
            -1
          )
        ]))
    ])
  )
}
const f = a(o, [['render', d]])
export { b as __pageData, f as default }
