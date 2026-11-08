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

test('quick login uses backend sessions for all four roles without OTP requests', async () => {
  for (const role of ['STUDENT', 'LECTURER', 'HEAD_OF_DEPARTMENT', 'FACULTY_LEADER']) {
    const h = harness(call => ({ data: { accessToken: 'quick-token', tokenType: 'Bearer', user: { id: 42, username: 'account', role: call.body.role } } }))
    await h.load('service/auth.ts').authService.quickLogin(role)
    assert.equal(h.auth.getState().user.role, role)
    assert.equal(h.auth.getState().user.id, 42)
    assert.equal(h.auth.getState().accessToken, 'quick-token')
    assert.equal(h.requests.length, 1)
    assert.equal(h.requests[0].url, '/auth/quick-login')
    assert.equal(h.requests[0].method, 'post')
    assert.deepEqual(h.requests[0].body, { role })
  }
})

test('failed quick login does not create a session', async () => {
  const h = harness(() => ({ status: 403, body: { success: false, message: 'Quick login disabled', data: null } }))
  await assert.rejects(h.load('service/auth.ts').authService.quickLogin('FACULTY_LEADER'), /Quick login disabled/)
  assert.equal(h.auth.getState().user, null)
  assert.equal(h.auth.getState().accessToken, null)
})

test('quick-login controls are hidden by default and shown only when explicitly enabled', () => {
  const renderLogin = harness(() => ({ data: null })).load('pages/login.ts').renderLogin
  assert.ok(!renderLogin().includes('data-quick-role='))
  assert.ok(renderLogin(true).includes('data-quick-role="STUDENT"'))
})

test('personal profile loads the authenticated endpoint and escapes user content', async () => {
  const profile = { id: 1, username: '<script>alert(1)</script>', email: 'student@example.test', role: 'STUDENT', active: true, createdAt: null,
    student: { studentCode: 'SV01', fullName: 'Nguyễn An', dateOfBirth: '2004-08-13', classCode: null, academicYear: '2026', phone: null }, lecturer: null }
  const h = harness(() => ({ data: profile })); h.session()
  const data = await h.load('service/profile.ts').profileService.me()
  assert.equal(h.requests[0].url, '/users/me')
  assert.ok(h.requests[0].authorization.startsWith('Bearer '))
  const html = h.load('components/profile.ts').renderProfile(data)
  assert.ok(html.includes('&lt;script&gt;'))
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('13/08/2004'))
  assert.ok(html.includes('Chưa cập nhật'))
  for (const role of ['STUDENT', 'LECTURER', 'HEAD_OF_DEPARTMENT', 'FACULTY_LEADER']) {
    h.session(role)
    assert.ok(h.load('pages/portal.ts').renderPortal(h.auth.getState().user).includes('data-path="thong-tin-ca-nhan"'))
  }
})

test('profile edits use the current-user endpoint and render only editable fields', async () => {
  const h = harness(call => ({ data: { id: 1, username: 'an', role: 'STUDENT', ...call.body } })); h.session()
  const changes = { email: 'new@example.test', student: { lastName: 'Nguyễn', firstName: 'An', dateOfBirth: null, classCode: null, academicYear: '2026', phone: null } }
  const result = await h.load('service/profile.ts').profileService.update(changes)
  assert.equal(result.email, changes.email)
  assert.equal(h.requests[0].method, 'put')
  assert.equal(h.requests[0].url, '/users/me')
  assert.deepEqual(h.requests[0].body, changes)
  const html = h.load('components/profile.ts').renderProfileForm({ ...result, lecturer: null })
  assert.ok(html.includes('name="firstName"'))
  assert.ok(!html.includes('name="role"'))
  assert.ok(!html.includes('name="studentCode"'))
  assert.ok(!html.includes('name="username"'))
})

test('department head can add a lecturer from the lecturer tab without an existing term', async () => {
  const h = harness(call => ({ data: { lecturerId: 10, userId: 20, ...call.body } })); h.session('HEAD_OF_DEPARTMENT')
  const data = { username: 'teacher', email: 'teacher@example.test', academicDegree: 'Tiến sĩ' }
  await h.load('service/lecturers.ts').lecturerService.create(data)
  assert.equal(h.requests[0].method, 'post')
  assert.equal(h.requests[0].url, '/lecturers')
  assert.deepEqual(h.requests[0].body, data)
  const portal = h.load('pages/portal.ts')
  assert.ok(portal.renderPortal(h.auth.getState().user).includes('id="lecturer-form"'))
  const tab = h.load('lib/portal-tabs.ts').getPortalTab('HEAD_OF_DEPARTMENT', 'giang-vien-huong-dan')
  assert.ok(tab.sections.includes('create-lecturer'))
  for (const role of ['STUDENT', 'LECTURER', 'FACULTY_LEADER']) {
    h.session(role)
    assert.ok(!portal.renderPortal(h.auth.getState().user).includes('id="lecturer-form"'))
  }
})

test('head loads account management without a term and can call update/delete APIs', async () => {
  const lecturer = { lecturerId: 3, userId: 7, username: 'Teacher', email: 't@example.test', academicDegree: 'Master' }
  const student = { id: 4, userId: 8, username: 'student', email: 's@example.test', studentCode: 'SV01', lastName: 'Nguyễn Văn', firstName: 'An', fullName: 'Nguyễn Văn An', academicYear: '2026', classCode: null }
  const h = harness(call => ({ data: call.url === '/lecturers/accounts' ? [lecturer] : call.url === '/students' ? [student] : [] }))
  h.session('HEAD_OF_DEPARTMENT')
  await h.load('stores/portal.ts').portalStore.getState().load()
  const html = h.load('pages/portal.ts').renderPortal(h.auth.getState().user)
  for (const attr of ['data-edit-lecturer="3"', 'data-delete-lecturer="3"', 'data-edit-student="4"', 'data-delete-student="4"']) assert.ok(html.includes(attr))
  const lecturers = h.load('service/lecturers.ts').lecturerService
  const students = h.load('service/students.ts').studentService
  await lecturers.update(3, { username: 'Changed', email: 'new@example.test' })
  await lecturers.remove(3)
  await students.update(4, { ...student, firstName: 'Bình' })
  await students.remove(4)
  assert.deepEqual(h.requests.slice(-4).map(call => [call.method, call.url]), [['put', '/lecturers/3'], ['delete', '/lecturers/3'], ['put', '/students/4'], ['delete', '/students/4']])
  assert.equal(h.requests.at(-2).body.firstName, 'Bình')
  h.session('FACULTY_LEADER')
  const faculty = h.load('pages/portal.ts').renderPortal(h.auth.getState().user)
  assert.ok(!faculty.includes('data-delete-lecturer'))
  assert.ok(!faculty.includes('data-delete-student'))
})

test('managers get topic and category editors with all category states', async () => {
  for (const role of ['HEAD_OF_DEPARTMENT', 'FACULTY_LEADER']) {
    const h = harness(call => ({ data: call.url === '/graduation-terms' ? [{ id: 2, name: 'Term', active: true, startDate: '2026-01-01', endDate: '2099-01-01', registerDate: '2099-01-01' }]
      : call.url === '/categories' ? [{ id: 4, code: 'AI', name: 'AI', description: '<script>', isActive: false }]
      : call.url === '/topics/department' ? [{ id: 5, title: 'Topic', status: 'PENDING', lecturerName: 'Teacher', categoryName: 'AI', categoryId: 4, lecturerId: 8 }]
      : call.url === '/lecturers' ? [{ lecturerId: 8, lecturerName: 'Teacher' }] : [] }))
    h.session(role)
    await h.load('stores/portal.ts').portalStore.getState().load()
    const html = h.load('pages/portal.ts').renderPortal(h.auth.getState().user)
    for (const marker of ['data-edit-topic="5"', 'data-delete-topic="5"', 'data-edit-category="4"', 'data-delete-category="4"', 'id="topic-form"', 'id="category-form"', 'name="lecturerId"']) assert.ok(html.includes(marker))
    assert.ok(html.includes('&lt;script&gt;'))
    assert.equal(h.requests.find(call => call.url === '/categories').params.activeOnly, false)
    assert.equal(h.load('lib/portal-tabs.ts').getPortalTab(role, 'manage-topics').sections.includes('create-topic'), true)
    const input = { graduationTermId: 2, categoryId: 4, title: 'Changed', lecturerId: 8 }
    await h.load('service/topics.ts').topicService.update(5, input)
    await h.load('service/topics.ts').topicService.remove(5)
    await h.load('service/categories.ts').categoryService.update(4, { code: 'AI', name: 'AI', description: null, isActive: true })
    await h.load('service/categories.ts').categoryService.remove(4)
    assert.deepEqual(h.requests.slice(-4).map(call => [call.method, call.url]), [['put', '/topics/5'], ['delete', '/topics/5'], ['put', '/categories/4'], ['delete', '/categories/4']])
    assert.equal(h.requests.at(-4).body.lecturerId, 8)
  }
})

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
    ? [{ id: 2, name: 'Current term', active: true, startDate: '2026-01-01', endDate: '2099-12-31', registerDate: '2099-12-31' }]
    : call.url === '/lecturers' ? [{ lecturerId: 42, lecturerName: 'Available teacher', academicDegree: null, studentLimit: 5, availableSlots: 3 }]
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
    if (call.url === '/graduation-terms') return { data: [2, 3].map(id => ({ id, active: true, name: 'Term', startDate: '2026-01-01', endDate: '2099-01-01', registerDate: '2099-01-01' })) }
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

for (const role of ['HEAD_OF_DEPARTMENT', 'FACULTY_LEADER']) test(`${role} can load and approve pending topics`, async () => {
  const topic = { id: 7, lecturerId: 3, title: 'Awaiting review', lecturerName: 'Teacher', categoryName: 'AI', status: 'PENDING', graduationTermId: 2 }
  const h = harness(call => {
    if (call.url === '/graduation-terms') return { data: [{ id: 2, active: true }] }
    if (call.url === '/topics/department') return { data: [topic] }
    if (call.url === '/topics') return { data: topic.status === 'APPROVED' ? [topic] : [] }
    if (call.url === '/topics/7/review') { topic.status = call.body.status; return { data: topic } }
    return { data: [] }
  }); h.session(role)
  const store = h.load('stores/portal.ts').portalStore
  await store.getState().load()
  assert.equal(store.getState().departmentTopics[0].status, 'PENDING')
  assert.equal(store.getState().topics.length, 0)
  const html = h.load('components/topic-approval.ts').renderTopicApproval(store.getState().departmentTopics, true)
  assert.match(html, /data-topic-review="7" data-decision="APPROVED"/)
  await h.load('service/topics.ts').topicService.review(7, 'APPROVED')
  await store.getState().load()
  assert.equal(store.getState().departmentTopics[0].status, 'APPROVED')
  assert.ok(!h.requests.some(call => call.url === '/topics'))
  assert.deepEqual(h.requests.find(r => r.url === '/topics/7/review').body, { status: 'APPROVED' })
})

test('lecturer sees their own pending topics without access to department review', async () => {
  const h = harness(call => ({ data: call.url === '/graduation-terms' ? [{ id: 2, active: true }]
    : call.url === '/topics/mine' ? [{ id: 7, status: 'PENDING', title: 'My proposal', lecturerName: 'Teacher', categoryName: 'AI' }] : [] }))
  h.session('LECTURER')
  const store = h.load('stores/portal.ts').portalStore
  await store.getState().load()
  assert.equal(store.getState().ownTopics[0].status, 'PENDING')
  assert.equal(store.getState().topics.length, 0)
  assert.ok(!h.requests.some(r => r.url === '/topics/pending'))
  const html = h.load('components/topic-approval.ts').renderTopicApproval(store.getState().ownTopics, false)
  assert.doesNotMatch(html, /data-topic-review/)
})

test('registration form is available only within an active term date range', () => {
  const h = harness(() => ({ data: [] })); h.session()
  const store = h.load('stores/portal.ts').portalStore
  const render = h.load('pages/portal.ts').renderPortal
  const term = { id: 2, name: 'Term', active: true, startDate: '2000-01-01', endDate: '2099-01-01', registerDate: '2099-01-01' }
  for (const [changes, open] of [
    [{}, true],
    [{ registerDate: '2001-01-01' }, false],
    [{ startDate: '2098-01-01' }, false],
    [{ endDate: '2001-01-01', registerDate: '2001-01-01' }, false],
    [{ active: false }, false],
  ]) {
    store.setState({ terms: [{ ...term, ...changes }], selectedTermId: 2, loading: false })
    assert.equal(render(h.auth.getState().user).includes('id="registration-form"'), open)
  }
})

test('tabs switch without fetching data and stay selected after reloading or changing terms', async () => {
  const h = harness(call => ({ data: call.url === '/graduation-terms'
    ? [2, 3].map(id => ({ id, active: true, name: 'Term', startDate: '2026-01-01', endDate: '2099-01-01', registerDate: '2099-01-01' })) : [] }))
  h.session('HEAD_OF_DEPARTMENT')
  const store = h.load('stores/portal.ts').portalStore
  await store.getState().load(2)
  const count = h.requests.length
  store.getState().setActiveTab('topic-approval')
  assert.equal(h.requests.length, count)
  const state = store.getState()
  store.getState().setActiveTab('topic-approval')
  assert.equal(store.getState(), state)
  await store.getState().load(3)
  assert.equal(store.getState().activeTab, 'topic-approval')
  const html = h.load('pages/portal.ts').renderPortal(h.auth.getState().user)
  assert.match(html, /data-path="topic-approval" aria-current="page"/)
  assert.doesNotMatch(html, /class="portal-tabs"/)
  const { getPortalTab } = h.load('lib/portal-tabs.ts')
  assert.equal(getPortalTab('HEAD_OF_DEPARTMENT', 'topic-approval').sections[0], 'topic-approval')
  assert.equal(getPortalTab('STUDENT', 'topic-approval').path, 'item-0')
  store.getState().reset()
  assert.equal(store.getState().activeTab, null)
})

test('student defaults to an open registration term while preserving manual selections', async () => {
  const terms = [
    { id: 4, active: true, startDate: '2098-01-01', registerDate: '2099-01-01' },
    { id: 2, active: true, startDate: '2000-01-01', registerDate: '2001-01-01' },
    { id: 1, active: true, startDate: '2000-01-01', registerDate: '2099-01-01' },
  ]
  const h = harness(call => ({ data: call.url === '/graduation-terms/active' ? terms : [] })); h.session()
  const store = h.load('stores/portal.ts').portalStore
  await store.getState().load()
  assert.equal(store.getState().selectedTermId, 1)
  assert.equal(h.requests.find(call => call.url === '/topics').params.graduationTermId, 1)
  await store.getState().load(4)
  assert.equal(store.getState().selectedTermId, 4)
  await store.getState().load()
  assert.equal(store.getState().selectedTermId, 4)
  store.getState().reset()
  terms[2].active = false
  await store.getState().load()
  assert.equal(store.getState().selectedTermId, 4)
})

test('faculty statistics show selected-term data and refresh when switching terms', async () => {
  const h = harness(call => {
    if (call.url === '/graduation-terms') return { data: [2, 3].map(id => ({ id, active: true, name: `Term ${id}`, startDate: '2026-01-01', endDate: '2099-01-01', registerDate: '2099-01-01' })) }
    if (call.url === '/dashboard/lecturers') return { data: call.params.graduationTermId === 2 ? [
      { lecturerId: 1, lecturerName: 'A', studentLimit: 5, approvedStudents: 3, availableSlots: 2, pendingRequests: 1 },
      { lecturerId: 2, lecturerName: 'B', studentLimit: 5, approvedStudents: 2, availableSlots: 3, pendingRequests: 2 },
    ] : [] }
    if (call.url === '/topics/department') return { data: call.params.graduationTermId === 2 ? ['APPROVED', 'PENDING', 'REJECTED'].map((status, id) => ({ id, status, graduationTermId: 2, title: 'Topic', lecturerName: 'A', categoryName: 'Web' })) : [] }
    return { data: [] }
  })
  h.session('FACULTY_LEADER')
  const store = h.load('stores/portal.ts').portalStore
  const render = () => h.load('pages/portal.ts').renderPortal(h.auth.getState().user)
  const stats = () => render().match(/<section class="api-card" id="faculty-statistics">[\s\S]*?<\/section>/)[0]
  const metric = (label, value) => assert.ok(stats().includes(`${label}</dt><dd class="text-2xl font-bold mt-2">${value}</dd>`))
  assert.ok(stats().includes('Chưa có đợt đồ án'))
  await store.getState().load(2)
  const tab = h.load('lib/portal-tabs.ts').getPortalTab('FACULTY_LEADER', null)
  assert.equal(tab.path, 'thong-ke-khoa')
  for (const id of tab.sections) assert.ok(render().includes(`id="${id}"`))
  metric('Tổng đề tài', 3)
  for (const label of ['Đề tài đã duyệt', 'Đề tài chờ duyệt', 'Đề tài đã từ chối']) metric(label, 1)
  metric('Sinh viên đã nhận', 5)
  metric('Yêu cầu đăng ký chờ duyệt', 3)
  metric('Tổng chỉ tiêu sinh viên', 10)
  metric('Chỗ hướng dẫn còn trống', 5)
  await store.getState().load(3)
  assert.ok(stats().includes('Term 3'))
  metric('Tổng đề tài', 0)
  metric('Sinh viên đã nhận', 0)
  for (const role of ['STUDENT', 'LECTURER', 'HEAD_OF_DEPARTMENT']) {
    h.session(role)
    assert.ok(!render().includes('id="faculty-statistics"'))
  }
})

test('faculty sidebar has logout and review links; only faculty has the term creation form', async () => {
  for (const role of ['FACULTY_LEADER', 'HEAD_OF_DEPARTMENT']) {
    const h = harness(call => ({ data: call.url === '/graduation-terms'
      ? [{ id: 2, active: true, name: 'Term', startDate: '2026-01-01', endDate: '2099-01-01', registerDate: '2099-01-01' }] : [] }))
    h.session(role)
    await h.load('stores/portal.ts').portalStore.getState().load()
    const html = h.load('pages/portal.ts').renderPortal(h.auth.getState().user)
    assert.match(html, /data-path="dang-xuat"/)
    assert.match(html, /data-path="topic-approval"/)
    assert.equal(html.includes('id="term-form"'), role === 'FACULTY_LEADER')
    assert.equal(html.includes('data-path="item-3"'), role === 'FACULTY_LEADER')
    await h.load('service/auth.ts').authService.logout()
    assert.equal(h.auth.getState().user, null)
    assert.ok(h.requests.some(call => call.url === '/auth/logout'))
  }
})
