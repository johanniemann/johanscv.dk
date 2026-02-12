import { defineConfig } from 'vite'

const repoNameFromEnv = process.env.GITHUB_REPOSITORY?.split('/')[1]
const repoName = repoNameFromEnv || 'johanscv'
const useCustomDomain = process.env.CUSTOM_DOMAIN === 'true'

export default defineConfig({
  base: useCustomDomain ? '/' : `/${repoName}/`,
})
