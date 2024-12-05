import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'vite:svg-raw',
      transform(code, id) {
        if (id.endsWith('.svg?raw')) {
          return `export default ${JSON.stringify(code)}`
        }
      }
    }
  ]
}) 