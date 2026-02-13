import { defineConfig } from 'vite'

const useCustomDomain = process.env.CUSTOM_DOMAIN === 'true'

export default defineConfig({
  base: useCustomDomain ? '/' : '/johanscv.dk/',
})
