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
        collapsed: false,
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
                text: 'C#',
                link: '/templates/docker/languages/csharp'
              },
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
              },
              {
                text: 'Rust',
                link: '/templates/docker/languages/rust'
              }
            ]
          }
        ]
      },
      {
        text: 'GitHub Actions',
        collapsed: false,
        items: [
          {
            text: 'CI',
            items: [
              {
                text: 'Languages',
                items: [
                  {
                    text: 'Go',
                    link: '/templates/github-actions/CI/languages/go'
                  },
                  {
                    text: 'Node.js',
                    link: '/templates/github-actions/CI/languages/node'
                  },
                  {
                    text: 'Python',
                    link: '/templates/github-actions/CI/languages/python'
                  }
                ]
              },
              {
                text: 'Matrices',
                items: [
                  {
                    text: 'Go',
                    link: '/templates/github-actions/CI/matrices/go'
                  },
                  {
                    text: 'Node.js',
                    link: '/templates/github-actions/CI/matrices/node'
                  },
                  {
                    text: 'Python',
                    link: '/templates/github-actions/CI/matrices/python'
                  }
                ]
              }
            ]
          },
          {
            text: 'Security',
            items: [
              {
                text: 'Containers',
                items: [
                  {
                    text: 'Docker',
                    link: '/templates/github-actions/security/containers/docker'
                  },
                  {
                    text: 'Trivy',
                    link: '/templates/github-actions/security/containers/trivy'
                  }
                ]
              },
              {
                text: 'SAST',
                items: [
                  {
                    text: 'CodeQL',
                    link: '/templates/github-actions/security/sast/codeql'
                  },
                  {
                    text: 'Semgrep',
                    link: '/templates/github-actions/security/sast/semgrep'
                  }
                ]
              },
              {
                text: 'SCA',
                items: [
                  {
                    text: 'Dependabot',
                    link: '/templates/github-actions/security/sca/dependabot'
                  },
                  {
                    text: 'Snyk',
                    link: '/templates/github-actions/security/sca/snyk'
                  }
                ]
              },
              {
                text: 'Utilities',
                items: [
                  {
                    text: 'Notifications',
                    items: [
                      {
                        text: 'Email',
                        link: '/templates/github-actions/utilities/notifications/email'
                      },
                      {
                        text: 'Slack',
                        link: '/templates/github-actions/utilities/notifications/slack'
                      }
                    ]
                  },
                  {
                    text: 'Reports',
                    items: [
                      {
                        text: 'Coverage',
                        link: '/templates/github-actions/utilities/reports/coverage'
                      },
                      {
                        text: 'Test',
                        link: '/templates/github-actions/utilities/reports/test'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        text: 'Kubernetes'
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
