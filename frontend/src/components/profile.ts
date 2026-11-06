import { escapeHtml as esc } from '../lib/html'
import { profileService } from '../service/profile'
import { apiError } from '../service/errors'
import { authStore } from '../stores/auth'
import type { UserProfile, UserRole, UpdateProfile } from '../types/api'
import { portalStore } from '../stores/portal'

const roles: Record<UserRole, string> = {
  STUDENT: 'Sinh viên', LECTURER: 'Giảng viên', HEAD_OF_DEPARTMENT: 'Trưởng bộ môn', FACULTY_LEADER: 'Lãnh đạo khoa',
}
const date = (value: string | null) => value ? value.slice(0, 10).split('-').reverse().join('/') : null

export function renderProfile(profile: UserProfile): string {
  const fields: [string, string | null][] = [
    ['Tên đăng nhập', profile.username], ['Email', profile.email], ['Vai trò', roles[profile.role]],
    ['Trạng thái', profile.active ? 'Đang hoạt động' : 'Đã khóa'], ['Ngày tạo tài khoản', date(profile.createdAt)],
  ]
  if (profile.student) {
    const student = profile.student
    fields.push(['Họ và tên', student.fullName], ['Mã sinh viên', student.studentCode],
      ['Ngày sinh', date(student.dateOfBirth)], ['Lớp', student.classCode],
      ['Năm học', student.academicYear], ['Số điện thoại', student.phone])
  }
  if (profile.lecturer) fields.push(['Học vị', profile.lecturer.academicDegree])
  return `<dl class="profile-fields">${fields.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value?.trim() || 'Chưa cập nhật')}</dd></div>`).join('')}</dl>`
}

export function renderProfileForm(profile: UserProfile): string {
  const input = (label: string, name: string, value: string | null, attributes = '') =>
    `<label>${label}<input name="${name}" value="${esc(value ?? '')}" ${attributes}></label>`
  return `<form class="api-form" id="profile-edit-form">
    ${input('Email đăng nhập', 'email', profile.email, 'type="email" required maxlength="100"')}
    <p class="text-secondary text-sm">Lần đăng nhập bằng OTP tiếp theo sẽ sử dụng email này.</p>
    ${profile.student ? `${input('Họ và tên đệm', 'lastName', profile.student.lastName, 'required maxlength="100"')}
      ${input('Tên', 'firstName', profile.student.firstName, 'required maxlength="50"')}
      ${input('Ngày sinh', 'dateOfBirth', profile.student.dateOfBirth, 'type="date"')}
      ${input('Lớp', 'classCode', profile.student.classCode, 'maxlength="50"')}
      ${input('Năm học', 'academicYear', profile.student.academicYear, 'required maxlength="20"')}
      ${input('Số điện thoại', 'phone', profile.student.phone, 'type="tel" maxlength="20"')}` : ''}
    ${profile.lecturer ? input('Học vị', 'academicDegree', profile.lecturer.academicDegree, 'maxlength="100"') : ''}
    <p data-save-error class="text-error" role="alert"></p>
    <div class="profile-actions"><button type="button" data-cancel>Hủy</button><button type="submit">Lưu thay đổi</button></div>
  </form>`
}

export function showProfile() {
  if (document.querySelector('#profile-dialog')) return
  const user = authStore.getState().user
  if (!user) return
  const dialog = document.createElement('dialog')
  dialog.id = 'profile-dialog'; dialog.className = 'detail-dialog'; dialog.setAttribute('aria-labelledby', 'profile-title')
  dialog.innerHTML = '<h2 id="profile-title">Thông tin cá nhân</h2><div data-profile-body aria-live="polite"></div><div class="profile-actions mt-6"><button type="button" data-edit hidden>Chỉnh sửa thông tin</button><button type="button" data-close>Đóng</button></div>'
  const body = dialog.querySelector<HTMLElement>('[data-profile-body]')!
  const editButton = dialog.querySelector<HTMLButtonElement>('[data-edit]')!
  dialog.querySelector<HTMLButtonElement>('[data-close]')!.onclick = () => dialog.close()
  const unsubscribe = authStore.subscribe(state => { if (state.user !== user) dialog.close() })
  dialog.addEventListener('close', () => { unsubscribe(); dialog.remove() }, { once: true })
  function show(profile: UserProfile, saved = false) {
    body.innerHTML = `${saved ? '<p role="status">Đã cập nhật thông tin cá nhân.</p>' : ''}${renderProfile(profile)}`
    editButton.hidden = false
    editButton.onclick = () => edit(profile)
  }
  function edit(profile: UserProfile) {
    editButton.hidden = true
    body.innerHTML = renderProfileForm(profile)
    const form = body.querySelector<HTMLFormElement>('form')!
    form.querySelector<HTMLButtonElement>('[data-cancel]')!.onclick = () => show(profile)
    form.querySelector<HTMLInputElement>('input')!.focus()
    form.onsubmit = async event => {
      event.preventDefault()
      if (form.dataset.pending || !form.reportValidity()) return
      const data = new FormData(form)
      const value = (key: string) => String(data.get(key) ?? '').trim()
      const request: UpdateProfile = { email: value('email') }
      if (profile.student) request.student = { lastName: value('lastName'), firstName: value('firstName'),
        dateOfBirth: value('dateOfBirth') || null, classCode: value('classCode') || null,
        academicYear: value('academicYear'), phone: value('phone') || null }
      if (profile.lecturer) request.lecturer = { academicDegree: value('academicDegree') || null }
      form.dataset.pending = 'true'
      form.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = true })
      const errorLine = form.querySelector<HTMLElement>('[data-save-error]')!
      errorLine.textContent = ''
      try {
        const updated = await profileService.update(request)
        if (authStore.getState().user !== user) return
        if (dialog.open) show(updated, true)
        void portalStore.getState().load()
      } catch (error) {
        if (dialog.open && authStore.getState().user === user) errorLine.textContent = apiError(error).message
      } finally {
        delete form.dataset.pending
        form.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = false })
      }
    }
  }
  async function load() {
    body.textContent = 'Đang tải thông tin cá nhân…'
    try {
      const profile = await profileService.me()
      if (dialog.open && authStore.getState().user === user) show(profile)
    } catch (error) {
      if (!dialog.open || authStore.getState().user !== user) return
      const text = document.createElement('p'); text.className = 'text-error'; text.setAttribute('role', 'alert'); text.textContent = apiError(error).message
      const retry = document.createElement('button'); retry.textContent = 'Thử lại'; retry.onclick = () => void load()
      body.replaceChildren(text, retry)
    }
  }
  document.body.append(dialog); dialog.showModal(); void load()
}
