import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DevOps Templates',
  description:
    'Набор шаблонов, скриптов и конфигураций для ускорения развертывания, обеспечения безопасности и стандартизации DevOps-процессов',
  head: [
    ['link', { rel: 'apple-touch-icon', href: '/assets/favicons/apple-icon.png' }],
    ['link', { rel: 'icon', href: '/assets/favicons/icon.svg' }]
  ],
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Примеры', link: '/templates/' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/Daniil-Oberlev/DevOps-Templates' }]
  }
})
