import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    env: loadEnv('test', process.cwd(), ''),
    exclude: ['**/node_modules/**', '**/.claude/**'],
  },
})
