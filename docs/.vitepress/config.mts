import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader
} from 'vitepress-plugin-group-icons'

import { getCopyright } from '../utils/constants'

export default defineConfig({
  base: '/DevOps-Templates/',
  title: 'DevOps Templates',
  description:
    'Набор шаблонов, скриптов и конфигураций для ускорения развертывания, обеспечения безопасности и стандартизации DevOps-процессов',
  head: [
    ['link', { rel: 'apple-touch-icon', href: '/DevOps-Templates/favicons/apple-icon.png' }],
    ['link', { rel: 'icon', href: '/DevOps-Templates/favicons/icon.svg' }]
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
    },
    editLink: {
      pattern: ({ filePath }) => {
        return `https://github.com/Daniil-Oberlev/DevOps-Templates/edit/main/docs/${filePath}`
      }
    }
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          'bash': localIconLoader(import.meta.url, './assets/bash.svg'),
          'poetry': localIconLoader(import.meta.url, './assets/poetry.svg'),
          'uv': localIconLoader(import.meta.url, './assets/uv.svg'),
          'requirements.txt': 'vscode-icons:file-type-python'
        }
      })
    ]
  },
  ignoreDeadLinks: false,
  lastUpdated: true
})
