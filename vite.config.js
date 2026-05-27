import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function localDataPlugin() {
  return {
    name: 'local-data',
    configureServer(server) {
      const dataDir = path.join(process.cwd(), 'data')
      const contentFile = path.join(dataDir, 'content.json')

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      if (!fs.existsSync(contentFile)) {
        fs.writeFileSync(contentFile, JSON.stringify({ items: [] }, null, 2))
      }

      server.middlewares.use((req, res, next) => {
        if (req.url === '/config.json' && req.method === 'GET') {
          const configFile = path.join(process.cwd(), 'config.json')
          if (fs.existsSync(configFile)) {
            res.setHeader('Content-Type', 'application/json')
            res.end(fs.readFileSync(configFile, 'utf-8'))
          } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              error: 'config.json not found',
              message: 'Copy config.example.json to config.json and fill in your details.'
            }))
          }
          return
        }

        if (req.url === '/api/content') {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            res.end(fs.readFileSync(contentFile, 'utf-8'))
            return
          }

          if (req.method === 'PUT') {
            let body = ''
            req.on('data', (chunk) => { body += chunk.toString() })
            req.on('end', () => {
              try {
                JSON.parse(body)
                fs.writeFileSync(contentFile, body)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: true }))
              } catch {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
              }
            })
            return
          }
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), localDataPlugin()],
  server: {
    proxy: {
      '/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/anthropic/, '')
      }
    }
  }
})
