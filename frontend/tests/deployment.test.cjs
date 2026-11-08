const test = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

function configuration(target) {
  return spawnSync(process.execPath, ['--input-type=module', '-e',
    "import { config } from './vercel.mjs'; console.log(JSON.stringify(config))"], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, API_PROXY_TARGET: target },
    encoding: 'utf8',
  })
}

test('Vercel forwards API paths to backend before the SPA fallback', () => {
  const result = configuration('https://backend.example.com/')
  assert.equal(result.status, 0, result.stderr)
  const config = JSON.parse(result.stdout)
  assert.deepEqual(config.rewrites, [
    { source: '/api/:path*', destination: 'https://backend.example.com/api/:path*' },
    { source: '/(.*)', destination: '/index.html' },
  ])
})

test('Vercel uses the deployed Render backend by default', () => {
  const result = configuration('')
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).rewrites[0].destination,
    'https://project-management-3-15e9.onrender.com/api/:path*')
})

test('Vercel rejects frontend URL and invalid backend origins', () => {
  for (const target of ['https://projectmanagement1-six.vercel.app/',
    'http://localhost:8080', 'https://backend.example.com/api',
    'https://user:password@backend.example.com', 'https://backend.example.com?x=1']) {
    const result = configuration(target)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /API_PROXY_TARGET/)
  }
})
