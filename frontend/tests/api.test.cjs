const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const axios = require('axios')

// Compile the actual TS modules into an isolated browser-like context; all HTTP is mocked.
function harness(handle) {
  const requests = []
  const storage = () => {
    const values = new Map()
    return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
  }
  const adapter = async config => {
    const call = { url: config.url, method: config.method, params: config.params, body: config.data ? JSON.parse(config.data) : undefined, authorization: config.headers.get('Authorization'), credentials: config.withCredentials }
    requests.push(call)
    const reply = await handle(call)
    const response = { data: reply.body ?? { success: true, message: 'OK', data: reply.data }, status: reply.status ?? 200, statusText: '', headers: {}, config }
    if (response.status >= 400) throw new axios.AxiosError('HTTP error', 'ERR_BAD_REQUEST', config, {}, response)
    return response
  }
  const fakeAxios = { ...axios, create: config => axios.create({ ...config, adapter }) }
  const context = vm.createContext({ console, sessionStorage: storage(), localStorage: storage(), atob, Date, setTimeout, clearTimeout })
  const cache = new Map()
  function load(file) {
    const resolved = path.resolve(__dirname, '../src', file)
    if (cache.has(resolved)) return cache.get(resolved)
    const exports = {}; cache.set(resolved, exports)
    const source = fs.readFileSync(resolved, 'utf8').replaceAll('import.meta.env', '({})')
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText
    const localRequire = id => id === 'axios' ? fakeAxios : id.startsWith('.') ? load(path.resolve(path.dirname(resolved), id) + '.ts') : require(id)
    vm.runInContext(`(function(require, exports) { ${output}\n })`, context)(localRequire, exports)
    return exports
  }
  const auth = load('stores/auth.ts').authStore
  const token = exp => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`
  const session = (role = 'STUDENT', accessToken = token(Date.now() / 1000 + 3600)) => auth.getState().setSession({ accessToken, tokenType: 'Bearer', user: { id: 1, username: 'student', role } })
  return { load, auth, requests, session, token }
}

test('maps backend request bodies, response envelope and Bearer credentials', async () => {
  const h = harness(() => ({ data: { id: 7 } })); h.session()
  const registration = h.load('service/registrations.ts').registrationService
  assert.equal((await registration.create({ graduationTermId: 2, lecturerId: 3, categoryId: 4, topicId: 5 })).id, 7)
  await registration.mine(); await registration.pending(); await registration.updateStatus(7, 'APPROVED')
  await h.load('service/topics.ts').topicService.list(2, 4)
  await h.load('service/dashboard.ts').dashboardService.lecturers(2)
  assert.deepEqual(h.requests.map(r => [r.method, r.url]), [['post', '/registrations'], ['get', '/registrations/topic'], ['get', '/registrations/lecturer/pending'], ['put', '/registrations/7/status'], ['get', '/topics'], ['get', '/dashboard/lecturers']])
  assert.deepEqual(h.requests[0].body, { graduationTermId: 2, lecturerId: 3, categoryId: 4, topicId: 5 })
  assert.deepEqual(h.requests[3].body, { status: 'APPROVED' })
  assert.equal(h.requests[4].params.graduationTermId, 2)
  assert.equal(h.requests[4].params.categoryId, 4)
  assert.ok(h.requests[0].authorization.startsWith('Bearer ')); assert.equal(h.requests[0].credentials, true)
})

test('OTP login stores backend identity and logout clears it', async () => {
  const h = harness(call => ({ data: call.url === '/auth/login-otp' ? { accessToken: 'new-token', tokenType: 'Bearer', user: { id: 4, username: 'teacher', role: 'LECTURER' } } : { message: 'OK' } }))
  const service = h.load('service/auth.ts').authService
  await service.sendOtp('teacher@example.test'); await service.login('teacher@example.test', '654321')
  assert.equal(h.auth.getState().user.role, 'LECTURER')
  assert.deepEqual(h.requests[1].body, { email: 'teacher@example.test', otp: '654321' })
  assert.equal(h.requests[1].authorization, undefined)
  await service.logout(); assert.equal(h.auth.getState().user, null)
})

test('concurrent unauthorized requests refresh once and retry with the new token', async () => {
  const h = harness(async call => {
    if (call.url === '/auth/refresh-token') { await new Promise(resolve => setTimeout(resolve, 10)); return { data: { accessToken: 'fresh', tokenType: 'Bearer' } } }
    return call.authorization === 'Bearer fresh' ? { data: [] } : { status: 401 }
  }); h.session()
  const service = h.load('service/categories.ts').categoryService
  await Promise.all([service.list(), service.list()])
  assert.equal(h.requests.filter(r => r.url === '/auth/refresh-token').length, 1)
  assert.equal(h.auth.getState().accessToken, 'fresh')
})

test('expired JWT is refreshed before sending a protected request', async () => {
  const h = harness(call => ({ data: call.url === '/auth/refresh-token' ? { accessToken: 'fresh', tokenType: 'Bearer' } : [] }))
  h.session('STUDENT', h.token(Date.now() / 1000 - 60))
  await h.load('service/categories.ts').categoryService.list()
  assert.equal(h.requests[0].url, '/auth/refresh-token')
  assert.equal(h.requests[1].authorization, 'Bearer fresh')
})

test('permission errors are not retried and backend messages are preserved', async () => {
  const h = harness(() => ({ status: 403, body: { success: false, message: 'Permission denied', data: null } })); h.session()
  await assert.rejects(h.load('service/categories.ts').categoryService.list(), /Permission denied/)
  assert.equal(h.requests.length, 1); assert.ok(h.auth.getState().user)
})

test('refresh failure clears the session without retry loops', async () => {
  const h = harness(() => ({ status: 401 })); h.session()
  await assert.rejects(h.load('service/categories.ts').categoryService.list())
  assert.equal(h.requests.length, 2); assert.equal(h.auth.getState().user, null)
})

test('student data loading does not call the administrator-only dashboard', async () => {
  const h = harness(call => ({ data: call.url === '/graduation-terms/active' ? [{ id: 2, active: true }] : [] })); h.session()
  const portal = h.load('stores/portal.ts').portalStore
  await portal.getState().load()
  assert.equal(portal.getState().error, null)
  assert.equal(portal.getState().selectedTermId, 2)
  assert.ok(h.requests.some(r => r.url === '/registrations/topic'))
  assert.ok(!h.requests.some(r => r.url === '/dashboard/lecturers'))
})

test('late responses cannot overwrite a newer term selection', async () => {
  const h = harness(async call => {
    if (call.url === '/graduation-terms') return { data: [{ id: 2, active: true }, { id: 3, active: true }] }
    if (call.url === '/topics' && call.params.graduationTermId === 2) await new Promise(resolve => setTimeout(resolve, 20))
    return { data: [] }
  }); h.session('FACULTY_LEADER')
  const portal = h.load('stores/portal.ts').portalStore
  await Promise.all([portal.getState().load(2), portal.getState().load(3)])
  assert.equal(portal.getState().selectedTermId, 3)
})

test('a registration failure retains loaded terms and identifies the failing resource', async () => {
  const h = harness(call => {
    if (call.url === '/graduation-terms/active') return { data: [{ id: 9, active: true }] }
    if (call.url === '/registrations/topic') return { status: 500, body: { success: false, message: 'server-failure', data: null } }
    return { data: [] }
  }); h.session()
  const portal = h.load('stores/portal.ts').portalStore
  await portal.getState().load()
  assert.equal(portal.getState().selectedTermId, 9)
  assert.equal(portal.getState().termsLoaded, true)
  assert.equal(portal.getState().terms.length, 1)
  assert.ok(portal.getState().error.endsWith(': server-failure'))
  assert.notEqual(portal.getState().error, 'server-failure')
  assert.equal(portal.getState().loading, false)
})

test('student can choose a lecturer even when the term has no suggested topics', async () => {
  const h = harness(call => ({ data: call.url === '/graduation-terms/active'
    ? [{ id: 2, name: 'Current term', active: true, startDate: '2026-01-01', endDate: '2099-12-31', registrationDeadline: '2099-12-01' }]
    : call.url === '/lecturers' ? [{ lecturerId: 42, lecturerName: 'Available teacher', department: 'IT', academicDegree: null, maxStudents: 8, availableSlots: 6 }]
      : [] })); h.session()
  const portal = h.load('stores/portal.ts').portalStore
  await portal.getState().load()
  assert.equal(portal.getState().error, null)
  assert.equal(portal.getState().topics.length, 0)
  assert.equal(portal.getState().lecturerOptions[0].lecturerId, 42)
  assert.equal(h.requests.find(r => r.url === '/lecturers').params.graduationTermId, 2)
  const html = h.load('pages/portal.ts').renderPortal(h.auth.getState().user)
  assert.match(html, /<option value="42"[^>]*>Available teacher/)
  assert.ok(!h.requests.some(r => r.url === '/dashboard/lecturers'))
})

test('lecturer approval moves a student from pending to accepted and respects the selected term', async () => {
  const records = [
    { id: 10, studentName: 'Pending student', title: 'Pending thesis', categoryName: 'AI', graduationTermId: 2, status: 'PENDING' },
    { id: 11, studentName: 'Accepted student', title: 'Accepted thesis', categoryName: 'AI', graduationTermId: 2, status: 'APPROVED' },
    { id: 12, studentName: 'Rejected student', title: 'Rejected thesis', categoryName: 'AI', graduationTermId: 2, status: 'REJECTED' },
  ]
  const h = harness(call => {
    if (call.url === '/graduation-terms') return { data: [2, 3].map(id => ({ id, active: true, name: 'Term', startDate: '2026-01-01', endDate: '2099-01-01' })) }
    if (call.url === '/registrations/lecturer') return { data: records.filter(item => item.graduationTermId === call.params.graduationTermId) }
    if (call.url === '/registrations/10/status') { records[0].status = call.body.status; return { data: records[0] } }
    return { data: [] }
  }); h.session('LECTURER')
  const portal = h.load('stores/portal.ts').portalStore
  const { renderLecturerStudents } = h.load('components/lecturer-students.ts')
  await portal.getState().load(2)
  let html = renderLecturerStudents(portal.getState().registrations)
  assert.match(html, /data-registration="10" data-status="APPROVED"/)
  assert.doesNotMatch(html, /data-registration="11"/)
  assert.doesNotMatch(html, /Rejected student/)
  assert.ok(html.indexOf('Pending student') < html.indexOf('id="students-approved"'))
  assert.ok(html.indexOf('Accepted student') > html.indexOf('id="students-approved"'))
  await h.load('service/registrations.ts').registrationService.updateStatus(10, 'APPROVED')
  await portal.getState().load()
  html = renderLecturerStudents(portal.getState().registrations)
  assert.ok(html.indexOf('Pending student') > html.indexOf('id="students-approved"'))
  assert.doesNotMatch(html, /data-status="APPROVED"/)
  assert.match(html, />0 hồ sơ</)
  assert.match(html, />2 hồ sơ</)
  await portal.getState().load(3)
  assert.equal(portal.getState().registrations.length, 0)
  assert.equal(h.requests.filter(r => r.url === '/registrations/lecturer').at(-1).params.graduationTermId, 3)
})
