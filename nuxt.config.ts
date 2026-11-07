// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 3,
  },
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],

  app: {
    head: {
      title: 'ระบบประเมินคุณภาพอาคารและการปฏิบัติงานบุคลากร - BRU FQ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#4f46e5' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'BRU FQ' },
        { name: 'description', content: 'ระบบประเมินคุณภาพอาคารและการปฏิบัติงานของบุคลากร มหาวิทยาลัยราชภัฏบุรีรัมย์' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  pwa: {
    registerType: 'prompt',
    manifest: {
      name: 'ระบบประเมินคุณภาพอาคารและการปฏิบัติงานบุคลากร',
      short_name: 'BRU FQ',
      description: 'ระบบประเมินคุณภาพอาคารและการปฏิบัติงานของบุคลากร มหาวิทยาลัยราชภัฏบุรีรัมย์',
      theme_color: '#4f46e5',
      background_color: '#f8fafc',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        }
      ]
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      type: 'module'
    }
  },

  runtimeConfig: {
    bruSsoBaseUrl: process.env.BRU_SSO_BASE_URL || 'https://sso.bru.ac.th',
    bruSsoApiKey: process.env.BRU_SSO_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'bru-facility-evaluation-secret-key-2026',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    public: {
      appName: 'ระบบประเมินคุณภาพอาคารและการปฏิบัติงานบุคลากร (BRU FQ)'
    }
  }
})
