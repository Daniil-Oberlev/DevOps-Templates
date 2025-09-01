import { defineConfig } from 'vitepress'

import { getCopyright } from '../utils/constants'

export default defineConfig({
  base: '/DevOps-Templates/',
  title: 'DevOps Templates',
  description:
    'Набор шаблонов, скриптов и конфигураций для ускорения развертывания, обеспечения безопасности и стандартизации DevOps-процессов',
  head: [
    ['link', { rel: 'apple-touch-icon', href: '/favicons/apple-icon.png' }],
    ['link', { rel: 'icon', href: '/favicons/icon.svg' }]
  ],
  lang: 'ru-RU',
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Примеры', link: '/templates/' }
    ],
    sidebar: [
      {
        text: 'Docker',
        items: [
          {
            text: 'Frontend',
            items: [
              {
                text: 'React',
                link: '/templates/docker/frontend/react'
              },
              {
                text: 'Next.js',
                link: '/templates/docker/frontend/next'
              }
            ]
          },
          {
            text: 'Languages',
            items: [
              {
                text: 'Go',
                link: '/templates/docker/languages/go'
              },
              {
                text: 'Node.js',
                link: '/templates/docker/languages/node'
              },
              {
                text: 'Python',
                link: '/templates/docker/languages/python'
              }
            ]
          }
        ]
      },
      {
        text: 'Kubernetes'
      },
      {
        text: 'GitHub Actions'
      },
      {
        text: 'Jenkins'
      },
      {
        text: 'Nginx'
      },
      {
        text: 'Scripts'
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/Daniil-Oberlev/DevOps-Templates' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: getCopyright()
    }
  }
})
