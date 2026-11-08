const test = require('node:test')
const assert = require('node:assert/strict')
const config = require('../vercel.json')

test('Vercel forwards API paths to Render before the SPA fallback', () => {
  assert.deepEqual(config.rewrites, [
    { source: '/api/:path*', destination: 'https://project-management-3-15e9.onrender.com/api/:path*' },
    { source: '/(.*)', destination: '/index.html' },
  ])
})
