import { escapeHtml as esc } from '../lib/html'
import type { RegistrationResponse } from '../types/api'

function renderStudent(registration: RegistrationResponse, pending: boolean): string {
  return `<article class="api-topic mt-4" data-student-registration="${registration.id}">
    <div class="flex items-start justify-between gap-3">
      <div><h3 class="font-semibold">${esc(registration.studentName)}</h3><p class="text-sm text-secondary mt-1">Hồ sơ #${registration.id}</p></div>
      <span class="api-badge">${pending ? 'Chờ duyệt' : 'Đã nhận'}</span>
    </div>
    <p class="font-medium mt-3">${esc(registration.title)}</p>
    <p class="text-secondary text-sm mt-2">${esc(registration.categoryName ?? 'Chưa phân loại')}</p>
    ${pending ? `<div class="flex flex-wrap gap-3 mt-4">
      <button type="button" class="api-button" data-registration="${registration.id}" data-status="APPROVED">Đồng ý tiếp nhận</button>
      <button type="button" class="api-button secondary" data-registration="${registration.id}" data-status="REJECTED">Từ chối</button>
    </div>` : ''}
  </article>`
}

export function renderLecturerStudents(registrations: RegistrationResponse[]): string {
  const pending = registrations.filter(item => item.status === 'PENDING')
  const approved = registrations.filter(item => item.status === 'APPROVED')
  return `<div id="registrations" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <section class="api-card" id="students-pending" aria-labelledby="students-pending-title">
      <div class="flex items-center justify-between gap-3"><h2 id="students-pending-title">Đang chờ duyệt</h2><span class="api-badge">${pending.length} hồ sơ</span></div>
      <p class="text-secondary text-sm mt-2">Xét duyệt sinh viên đăng ký hướng dẫn trong đợt.</p>
      ${pending.map(item => renderStudent(item, true)).join('') || '<p class="text-secondary py-5">Không có hồ sơ đang chờ duyệt trong đợt này.</p>'}
    </section>
    <section class="api-card" id="students-approved" aria-labelledby="students-approved-title">
      <div class="flex items-center justify-between gap-3"><h2 id="students-approved-title">Sinh viên đã nhận</h2><span class="api-badge">${approved.length} hồ sơ</span></div>
      <p class="text-secondary text-sm mt-2">Sinh viên đã được bạn đồng ý hướng dẫn trong đợt.</p>
      ${approved.map(item => renderStudent(item, false)).join('') || '<p class="text-secondary py-5">Bạn chưa tiếp nhận sinh viên trong đợt này.</p>'}
    </section>
  </div>`
}
