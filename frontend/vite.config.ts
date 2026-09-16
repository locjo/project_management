import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// The HTML document is generated here; application source is entirely TypeScript/CSS.
function documentShell(script: string, styles = ''): string {
  return `<!doctype html><html lang="vi"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý đồ án tốt nghiệp HUMG</title>${styles}</head>
    <body><div id="app"></div><script type="module" src="${script}"></script></body></html>`
}

function typescriptEntry(): Plugin {
  return {
    name: 'typescript-document-entry',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/' && path !== '/index.html') return next()
        try {
          const html = await server.transformIndexHtml('/', documentShell('/src/main.ts'))
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (error) { next(error) }
      })
    },
    generateBundle(_, bundle) {
      const entry = Object.values(bundle).find(item => item.type === 'chunk' && item.isEntry)
      if (!entry) throw new Error('Missing application entry')
      const styles = Object.values(bundle)
        .filter(item => item.type === 'asset' && item.fileName.endsWith('.css'))
        .map(item => `<link rel="stylesheet" href="./${item.fileName}">`).join('')
      this.emitFile({ type: 'asset', fileName: 'index.html', source: documentShell(`./${entry.fileName}`, styles) })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = { '/api': { target: env.API_PROXY_TARGET || 'http://localhost:8080', changeOrigin: true } }
  return {
  plugins: [tailwindcss(), typescriptEntry()],
  build: { rollupOptions: { input: 'src/main.ts' } },
  server: { proxy },
  preview: { proxy },
  }
})
