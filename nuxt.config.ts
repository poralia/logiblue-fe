// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/autoComplete.min.js',
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/css/autoComplete.min.css'
        }
      ]
    }
  },
  $production: {
    runtimeConfig: {
      public: {
        baseApiUrl: 'http://localhost:8000/api'
      }
    }
  },
  $development: {
    runtimeConfig: {
      public: {
        baseApiUrl: 'http://localhost:8000/api'
      }
    }
  },
})
