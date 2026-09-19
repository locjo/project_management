import './style.css'
import { message } from './components/dialog'
import { renderLogin } from './pages/login'
import { renderPortal, roleScreens } from './pages/portal'
import { authStore } from './stores/auth'
import { portalStore } from './stores/portal'
import { authService } from './service/auth'
import { registrationService } from './service/registrations'
import { topicService } from './service/topics'
import { categoryService } from './service/categories'
import { graduationTermService } from './service/graduation-terms'
import { apiError } from './service/errors'
import { getPortalTab, portalTabs } from './lib/portal-tabs'

const app = document.querySelector<HTMLDivElement>('#app')!
let disposeLogin: (() => void) | undefined

function render() {
  disposeLogin?.(); disposeLogin = undefined
  const user = authStore.getState().user
  const role = user && roleScreens[user.role]
  document.body.className = role ? `screen-${role} connected` : 'screen-otp connected'
  document.title = 'Quản lý đồ án tốt nghiệp HUMG'
  if (!user || !role) {
    app.innerHTML = renderLogin()
    setupLogin()
  } else {
    app.innerHTML = renderPortal(user)
    setupPortal()
  }
  app.querySelectorAll<HTMLImageElement>('img').forEach(img => {
    img.onerror = () => { const fallback = document.createElement('span'); fallback.className = 'logo-fallback'; fallback.textContent = 'HUMG'; img.replaceWith(fallback) }
  })
}

function setupLogin() {
  const emailForm = document.querySelector<HTMLFormElement>('#email-form')!
  const verifyForm = document.querySelector<HTMLFormElement>('#verify-form')!
  const resend = document.querySelector<HTMLButtonElement>('#resend-otp')!
  const errorLine = document.querySelector<HTMLElement>('#login-error')!
  let email = ''
  let expiresAt = 0
  let resendAt = 0
  let pending = false
  let active = true
  const tick = () => {
    if (!active) return
    const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
    const wait = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000))
    document.querySelector('#otp-expiry')!.textContent = remaining ? `Mã có hiệu lực trong ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : 'Mã đã hết hạn. Vui lòng gửi lại mã.'
    resend.disabled = pending || wait > 0
    resend.textContent = wait ? `Gửi lại sau ${wait}s` : 'Gửi lại mã'
  }
  const interval = setInterval(tick, 1000)
  disposeLogin = () => { active = false; clearInterval(interval) }
  async function run(action: () => Promise<void>) {
    if (pending) return
    pending = true; errorLine.textContent = ''
    app.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = true })
    try { await action() } catch (error) { if (active) errorLine.textContent = apiError(error).message }
    finally {
      pending = false
      if (active) { app.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = false }); tick() }
    }
  }
  async function sendCode() {
    await authService.sendOtp(email)
    if (!active) return
    expiresAt = Date.now() + 180000; resendAt = Date.now() + 60000
    emailForm.hidden = true; verifyForm.hidden = false
    document.querySelector('#otp-email')!.textContent = email
    verifyForm.reset(); verifyForm.querySelector<HTMLInputElement>('input')!.focus(); tick()
  }
  emailForm.onsubmit = event => {
    event.preventDefault()
    if (!emailForm.reportValidity()) return
    email = String(new FormData(emailForm).get('email')).trim()
    void run(sendCode)
  }
  resend.onclick = () => { if (Date.now() >= resendAt) void run(sendCode) }
  document.querySelector<HTMLButtonElement>('#change-email')!.onclick = () => {
    verifyForm.hidden = true; emailForm.hidden = false; errorLine.textContent = ''
    emailForm.querySelector<HTMLInputElement>('input')!.focus()
  }
  verifyForm.onsubmit = event => {
    event.preventDefault()
    if (!verifyForm.reportValidity()) return
    if (Date.now() >= expiresAt) { errorLine.textContent = 'Mã đã hết hạn. Vui lòng gửi lại mã.'; return }
    void run(async () => { await authService.login(email, String(new FormData(verifyForm).get('otp'))) })
  }
}

async function mutate(form: HTMLFormElement, action: (data: FormData) => Promise<unknown>, success: string) {
  if (!form.reportValidity() || form.dataset.pending) return
  const data = new FormData(form)
  form.dataset.pending = 'true'
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!
  submit.disabled = true
  try {
    await action(data)
    message('Thành công', success)
    await portalStore.getState().load()
  } catch (error) { message('Không thể thực hiện', apiError(error).message) }
  finally { delete form.dataset.pending; submit.disabled = false }
}

function syncPortalTab() {
  const user = authStore.getState().user
  if (!user) return
  const tab = getPortalTab(user.role, portalStore.getState().activeTab)
  const content = document.querySelector<HTMLElement>('#portal-content')
  if (!content) return
  const selected = tab.sections.map(id => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node))
  content.querySelectorAll<HTMLElement>(':scope > [id], :scope > #topics > section[id], :scope > #registrations > section[id]').forEach(panel => {
    panel.hidden = !selected.some(node => panel === node || panel.contains(node) || node.contains(panel))
  })
  app.querySelectorAll<HTMLElement>('[data-path]').forEach(link => {
    const active = link.dataset.path === tab.path
    if (active) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
    if (link.closest('[data-component="sidebar"]') && !link.classList.contains('text-error')) {
      for (const name of ['bg-primary/10', 'text-primary', 'font-semibold']) link.classList.toggle(name, active)
      link.classList.toggle('text-on-surface-variant', !active)
    }
  })
  content.querySelectorAll<HTMLInputElement>('[data-topic-filter]').forEach(input => input.dispatchEvent(new Event('input')))
}

function setupPortal() {
  document.querySelector<HTMLSelectElement>('#term-select')!.onchange = event => {
    void portalStore.getState().load(Number((event.target as HTMLSelectElement).value))
  }
  document.querySelectorAll<HTMLInputElement>('[data-topic-filter]').forEach(search => { search.oninput = () => {
    const list = search.closest<HTMLElement>('[data-topic-list]')!
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()
    let visible = 0
    list.querySelectorAll<HTMLElement>('[data-topic-search]').forEach(card => {
      card.hidden = !normalize(card.dataset.topicSearch!).includes(normalize(search.value))
      if (!card.hidden && !card.parentElement?.closest('[hidden]')) visible++
    })
    list.querySelector<HTMLElement>('[data-topic-empty]')!.hidden = visible > 0 || !search.value
  } })
  const registrationForm = document.querySelector<HTMLFormElement>('#registration-form')
  if (registrationForm) {
    registrationForm.querySelector<HTMLSelectElement>('[name="mode"]')!.onchange = event => {
      const custom = (event.target as HTMLSelectElement).value === 'custom'
      const fields = document.querySelector<HTMLFieldSetElement>('#custom-fields')!
      fields.hidden = !custom; fields.disabled = !custom
      document.querySelector<HTMLElement>('#suggested-field')!.hidden = custom
      registrationForm.querySelector<HTMLSelectElement>('[name="topicId"]')!.disabled = custom
    }
    registrationForm.onsubmit = event => {
      event.preventDefault()
      void mutate(registrationForm, data => {
        const graduationTermId = portalStore.getState().selectedTermId!
        if (data.get('mode') === 'custom') return registrationService.create({ graduationTermId, lecturerId: Number(data.get('lecturerId')), categoryId: Number(data.get('categoryId')), title: String(data.get('title')).trim() })
        const topic = portalStore.getState().topics.find(item => item.id === Number(data.get('topicId')))
        if (!topic) throw new Error('Vui lòng chọn đề tài hợp lệ.')
        return registrationService.create({ graduationTermId, lecturerId: topic.lecturerId, categoryId: topic.categoryId, topicId: topic.id })
      }, 'Đăng ký đã được gửi đến giảng viên hướng dẫn.')
    }
  }
  const bind = (id: string, action: (data: FormData) => Promise<unknown>, success: string) => {
    const form = document.querySelector<HTMLFormElement>(`#${id}`)
    if (form) form.onsubmit = event => { event.preventDefault(); void mutate(form, action, success) }
  }
  bind('topic-form', data => topicService.create({ graduationTermId: portalStore.getState().selectedTermId!, categoryId: Number(data.get('categoryId')), title: String(data.get('title')).trim(), description: String(data.get('description')).trim() }), 'Đề tài đã được gửi tới trưởng bộ môn và đang chờ phê duyệt.')
  bind('category-form', data => categoryService.create({ code: String(data.get('code')).trim(), name: String(data.get('name')).trim(), description: String(data.get('description')).trim(), isActive: true }), 'Đã thêm lĩnh vực.')
  bind('term-form', data => {
    const startDate = String(data.get('startDate')), endDate = String(data.get('endDate'))
    const registerDate = String(data.get('registerDate'))
    if (startDate > endDate) throw new Error('Ngày kết thúc phải từ ngày bắt đầu trở đi.')
    if (registerDate < startDate || registerDate > endDate) throw new Error('Hạn đăng ký phải từ ngày bắt đầu đến ngày kết thúc của đợt.')
    return graduationTermService.create({ code: String(data.get('code')).trim(), name: String(data.get('name')).trim(), academicYear: String(data.get('academicYear')).trim(), semester: String(data.get('semester')).trim(), startDate, endDate, registerDate, isActive: true })
  }, 'Đã tạo đợt đồ án.')
  syncPortalTab()
}

app.addEventListener('click', async event => {
  const target = (event.target as Element).closest<HTMLButtonElement | HTMLAnchorElement>('button, a')
  if (!target || target.closest('#email-form, #verify-form')) return
  if (target.tagName === 'A') event.preventDefault()
  if (target.dataset.action === 'reload') { void portalStore.getState().load(); return }
  const path = target.dataset.path
  const user = authStore.getState().user
  if (path && user && portalTabs[user.role].some(tab => tab.path === path)) {
    portalStore.getState().setActiveTab(path)
    return
  }
  if (path === 'dang-xuat') {
    if (target.dataset.pending) return
    target.dataset.pending = 'true'
    try { await authService.logout() } catch (error) { message('Không thể đăng xuất', apiError(error).message) }
    finally { delete target.dataset.pending }
    return
  }
  if (path === 'thiet-lap-tai-khoan') { message('Tài khoản', 'Backend hiện chưa cung cấp chức năng cập nhật tài khoản.'); return }
  if (target.dataset.selectTopic) {
    const select = document.querySelector<HTMLSelectElement>('#registration-form [name="topicId"]')
    const mode = document.querySelector<HTMLSelectElement>('#registration-form [name="mode"]')
    if (select && mode) { mode.value = 'suggested'; mode.dispatchEvent(new Event('change')); select.value = target.dataset.selectTopic; document.getElementById('registration')!.scrollIntoView({ behavior: 'smooth' }) }
  }
  if (target.dataset.registration && (target.dataset.status === 'APPROVED' || target.dataset.status === 'REJECTED')) {
    const buttons = target.parentElement!.querySelectorAll<HTMLButtonElement>('button')
    buttons.forEach(button => { button.disabled = true })
    try {
      await registrationService.updateStatus(Number(target.dataset.registration), target.dataset.status)
      await portalStore.getState().load()
    } catch (error) { message('Không thể cập nhật', apiError(error).message) }
    finally { buttons.forEach(button => { button.disabled = false }) }
  }
  if (target.dataset.topicReview && (target.dataset.decision === 'APPROVED' || target.dataset.decision === 'REJECTED')) {
    const buttons = target.parentElement!.querySelectorAll<HTMLButtonElement>('button')
    buttons.forEach(button => { button.disabled = true })
    try {
      await topicService.review(Number(target.dataset.topicReview), target.dataset.decision)
      await portalStore.getState().load()
    } catch (error) { message('Không thể duyệt đề tài', apiError(error).message) }
    finally { buttons.forEach(button => { button.disabled = false }) }
  }
})

authStore.subscribe((state, previous) => {
  if (state.user !== previous.user) {
    portalStore.getState().reset()
    location.hash = state.user ? roleScreens[state.user.role] : 'otp'
    render()
    if (state.user) void portalStore.getState().load()
  }
})
portalStore.subscribe((state, previous) => {
  if (!authStore.getState().user) return
  // Switching tabs only hides panels, preserving unsent form inputs and focus.
  if (state.activeTab !== previous.activeTab) syncPortalTab()
  else render()
})
render()
if (authStore.getState().user) void portalStore.getState().load()
