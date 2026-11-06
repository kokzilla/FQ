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
  ],

  app: {
    head: {
      title: 'ระบบประเมินผลการปฏิบัติงานบุคลากรประจำอาคาร - BRU',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'description', content: 'ระบบประเมินผลการปฏิบัติงานของบุคลากรประจำอาคาร (แม่บ้าน) มหาวิทยาลัยราชภัฏบุรีรัมย์' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    bruSsoBaseUrl: process.env.BRU_SSO_BASE_URL || 'https://sso.bru.ac.th',
    bruSsoApiKey: process.env.BRU_SSO_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'bru-facility-evaluation-secret-key-2026',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    public: {
      appName: 'BRU Facility Evaluation'
    }
  }
})
