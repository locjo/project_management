// Vercel evaluates this configuration at deployment time, before the Vite build.
const target = process.env.API_PROXY_TARGET?.trim()
  || 'https://project-management-3-15e9.onrender.com'

const backend = new URL(target)
if (backend.protocol !== 'https:' || backend.username || backend.password
  || backend.pathname !== '/' || backend.search || backend.hash
  || backend.hostname === 'localhost' || backend.hostname.endsWith('.vercel.app')) {
  throw new Error('API_PROXY_TARGET must be the HTTPS backend origin (for example https://your-backend.onrender.com), without /api. Do not use the frontend URL.')
}

export const config = {
  framework: 'vite',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  rewrites: [
    { source: '/api/:path*', destination: `${backend.origin}/api/:path*` },
    { source: '/(.*)', destination: '/index.html' },
  ],
  headers: [{
    source: '/api/:path*',
    headers: [{ key: 'Cache-Control', value: 'private, no-store' }],
  }],
}
