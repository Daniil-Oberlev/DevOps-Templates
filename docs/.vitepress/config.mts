import { defineConfig } from 'vitepress'

import { getCopyright } from '../utils/constants'

export default defineConfig({
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/Daniil-Oberlev/DevOps-Templates' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: getCopyright()
    }
  }
})
