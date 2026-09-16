import { renderHeader } from '../components/header'
import { renderSidebar } from '../components/sidebar'
import { renderLecturerStudents } from '../components/lecturer-students'
import { portalLayouts } from '../lib/portal-layouts'
import { escapeHtml as esc } from '../lib/html'
import { portalStore } from '../stores/portal'
import type { UserInfo, UserRole, RegistrationStatus } from '../types/api'
import type { PortalRole } from '../types/layout'

export const roleScreens: Record<UserRole, PortalRole> = {
  STUDENT: 'student', LECTURER: 'lecturer', HEAD_OF_DEPARTMENT: 'department', FACULTY_LEADER: 'faculty',
}
export const roleLabels: Record<UserRole, string> = {
  STUDENT: 'Sinh viên', LECTURER: 'Giảng viên hướng dẫn', HEAD_OF_DEPARTMENT: 'Trưởng bộ môn', FACULTY_LEADER: 'Lãnh đạo khoa',
}
const statuses: Record<RegistrationStatus, string> = { PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' }
const empty = (text: string) => `<p class="text-secondary py-5">${esc(text)}</p>`

export function renderPortal(user: UserInfo): string {
  const state = portalStore.getState()
  const role = roleScreens[user.role]
  const term = state.terms.find(item => item.id === state.selectedTermId)
  const sidebar = { ...portalLayouts[role].sidebar,
    period: { title: term?.name ?? 'Chưa chọn đợt đồ án', dates: term ? `${term.startDate.slice(0, 10)} – ${term.endDate.slice(0, 10)}` : '', status: term ? term.active ? 'Đang mở' : 'Đã đóng' : '' },
  }
  if (user.role === 'HEAD_OF_DEPARTMENT') {
    sidebar.items = [
      { path: 'giang-vien-huong-dan', icon: 'school', label: 'Định mức giảng viên' },
      { path: 'de-tai-cua-toi', icon: 'lightbulb', label: 'Đề tài trong đợt' },
      { path: 'item-3', icon: 'calendar_month', label: 'Thiết lập đợt đồ án' },
    ]
    sidebar.activePath = undefined
  }
  if (user.role === 'LECTURER') {
    sidebar.items = [
      { path: 'students-pending', icon: 'pending_actions', label: 'Đang chờ duyệt' },
      { path: 'students-approved', icon: 'how_to_reg', label: 'Sinh viên đã nhận' },
      { path: 'de-tai-cua-toi', icon: 'lightbulb', label: 'Đề tài trong đợt' },
    ]
    sidebar.activePath = undefined
  }
  const options = state.categories.map(category => `<option value="${category.id}">${esc(category.name)}</option>`).join('')
  const lecturers = state.lecturerOptions
  const canRegister = Boolean(term?.active && new Date(term.registrationDeadline).getTime() > Date.now())
  const registrations = state.registrations.filter(item => item.graduationTermId === state.selectedTermId)
  const content = state.loading ? '<div class="api-card" role="status">Đang tải dữ liệu…</div>' : state.error
    ? `<div class="api-card" role="alert"><p class="text-error">${esc(state.error)}</p><button class="api-button mt-4" data-action="reload">Thử lại</button></div>`
    : `<section class="api-card" id="topics"><h2>Đề tài trong đợt <span class="text-secondary">(${state.topics.length})</span></h2>
      <label class="block my-3">Tìm đề tài<input id="topic-search" class="api-input" placeholder="Tên đề tài, giảng viên hoặc lĩnh vực"></label>
      <div class="api-grid">${state.topics.map(topic => `<article class="api-topic" data-topic-search="${esc(`${topic.title} ${topic.lecturerName} ${topic.categoryName}`)}">
        <span class="api-badge">${esc(topic.categoryName)}</span><h3 class="font-semibold my-3">${esc(topic.title)}</h3><p class="text-secondary text-sm">${esc(topic.lecturerName)}</p><p class="mt-2 text-sm">${esc(topic.description ?? '')}</p>
        ${user.role === 'STUDENT' && canRegister ? `<button class="api-button mt-4" data-select-topic="${topic.id}">Chọn đề tài</button>` : ''}</article>`).join('') || empty('Chưa có đề tài trong đợt này.')}</div><p id="topic-no-results" hidden>Không có đề tài phù hợp.</p>
    </section>
    ${user.role === 'STUDENT' ? `<section class="api-card" id="registration"><h2>Đăng ký đề tài</h2>
      ${!canRegister ? empty('Chưa có đợt đang mở hoặc đã hết hạn đăng ký.') : `<form id="registration-form" class="api-form">
        <label>Hình thức<select name="mode"><option value="suggested">Đề tài có sẵn</option><option value="custom">Tự đề xuất tên đề tài</option></select></label>
        <label id="suggested-field">Đề tài<select name="topicId" required><option value="">Chọn đề tài</option>${state.topics.map(topic => `<option value="${topic.id}">${esc(topic.title)} — ${esc(topic.lecturerName)}</option>`).join('')}</select></label>
        <fieldset id="custom-fields" disabled hidden class="api-form"><label>Giảng viên<select name="lecturerId" required aria-describedby="lecturer-help"><option value="">Chọn giảng viên</option>${lecturers.map(lecturer => `<option value="${lecturer.lecturerId}" ${lecturer.availableSlots <= 0 ? 'disabled' : ''}>${esc(lecturer.lecturerName)}${lecturer.department ? ` — ${esc(lecturer.department)}` : ''} · ${lecturer.availableSlots > 0 ? `Còn ${lecturer.availableSlots} chỗ` : 'Đã đủ chỉ tiêu'}</option>`).join('')}</select></label>
          <p id="lecturer-help" class="text-secondary text-sm">${lecturers.length === 0 ? 'Chưa có tài khoản giảng viên đang hoạt động. Vui lòng liên hệ khoa để bổ sung.' : lecturers.every(lecturer => lecturer.availableSlots <= 0) ? 'Các giảng viên đã đủ chỉ tiêu trong đợt. Vui lòng liên hệ khoa.' : 'Chọn giảng viên còn chỉ tiêu trong đợt, kể cả giảng viên chưa đăng đề tài gợi ý.'}</p>
          <label>Lĩnh vực<select name="categoryId" required><option value="">Chọn lĩnh vực</option>${options}</select></label>
          <label>Tên đề tài<input name="title" required maxlength="500"></label>
        </fieldset>
        <label class="api-checkbox"><input type="checkbox" name="commitment" required><span>Tôi xác nhận thông tin đăng ký chính xác.</span></label>
        <button type="submit" class="api-button">Gửi đăng ký</button>
      </form>`}</section>` : ''}
    ${user.role === 'LECTURER' ? renderLecturerStudents(registrations) : ''}
    ${user.role === 'STUDENT' ? `<section class="api-card" id="registrations"><h2>Hồ sơ đăng ký của tôi</h2>
      ${registrations.map(item => `<article class="api-topic mt-4"><div class="flex justify-between gap-3"><h3 class="font-semibold">${esc(item.title)}</h3><span class="api-badge">${statuses[item.status]}</span></div>
        <p class="mt-2 text-secondary">${esc(item.studentName)} · ${esc(item.lecturerName)} · ${esc(item.categoryName)}</p>
        </article>`).join('') || empty('Chưa có hồ sơ trong đợt này.')}</section>` : ''}
    ${user.role === 'LECTURER' && term ? `<section class="api-card"><h2>Đề xuất đề tài mới</h2><form id="topic-form" class="api-form"><label>Tên đề tài<input name="title" required></label><label>Lĩnh vực<select name="categoryId" required><option value="">Chọn lĩnh vực</option>${options}</select></label><label>Mô tả<textarea name="description" rows="3"></textarea></label><button class="api-button" type="submit">Tạo đề tài</button></form></section>` : ''}
    <section class="api-card" id="categories"><h2>Lĩnh vực đề tài</h2><div class="flex flex-wrap gap-2 mt-4">${state.categories.map(category => `<span class="api-badge">${esc(category.name)}</span>`).join('') || empty('Chưa có lĩnh vực.')}</div>
      ${user.role === 'FACULTY_LEADER' ? '<form id="category-form" class="api-form mt-5"><label>Mã lĩnh vực<input name="code" required></label><label>Tên lĩnh vực<input name="name" required></label><label>Mô tả<textarea name="description"></textarea></label><button class="api-button" type="submit">Thêm lĩnh vực</button></form>' : ''}</section>
    ${user.role === 'FACULTY_LEADER' || user.role === 'HEAD_OF_DEPARTMENT' ? `<section class="api-card" id="lecturers"><h2>Định mức giảng viên</h2><div class="overflow-x-auto"><table class="api-table"><thead><tr><th>Giảng viên</th><th>Bộ môn</th><th>Học vị</th><th>Chỉ tiêu</th><th>Đã nhận</th><th>Còn trống</th><th>Chờ duyệt</th></tr></thead><tbody>${state.lecturers.map(item => `<tr><td>${esc(item.lecturerName)}</td><td>${esc(item.department ?? '')}</td><td>${esc(item.academicDegree ?? '')}</td><td>${item.maxStudents}</td><td>${item.approvedStudents}</td><td>${item.availableSlots}</td><td>${item.pendingRequests}</td></tr>`).join('')}</tbody></table>${state.lecturers.length ? '' : empty('Chưa có thống kê giảng viên.')}</div></section>
    <section class="api-card" id="terms"><h2>Tạo đợt đồ án</h2><form id="term-form" class="api-form api-grid"><label>Mã đợt<input name="code" required></label><label>Tên đợt<input name="name" required></label><label>Năm học<input name="academicYear" required placeholder="2026-2027"></label><label>Học kỳ<input name="semester" required></label><label>Bắt đầu<input type="datetime-local" name="startDate" required></label><label>Kết thúc<input type="datetime-local" name="endDate" required></label><label>Hạn đăng ký<input type="datetime-local" name="registrationDeadline" required></label><button class="api-button self-end" type="submit">Tạo đợt hoạt động</button></form></section>` : ''}`
  return `<div class="live-shell">${renderSidebar(sidebar)}<div class="live-body">
    ${renderHeader({ variant: 'student', name: user.username, description: roleLabels[user.role], initials: user.username.slice(0, 2).toUpperCase() })}
    <main class="live-main"><section class="api-banner"><div><p class="text-sm opacity-80">HUMG · KHOA CÔNG NGHỆ THÔNG TIN</p><h1 class="text-2xl font-bold mt-2">${roleLabels[user.role]}</h1><p class="mt-2">Xin chào, ${esc(user.username)}</p></div><button class="api-button secondary" data-action="reload">Làm mới dữ liệu</button></section>
      <section class="api-card"><label class="font-semibold">Đợt đồ án<select class="api-input mt-2" id="term-select" ${state.loading ? 'disabled' : ''}>${state.terms.map(item => `<option value="${item.id}" ${item.id === state.selectedTermId ? 'selected' : ''}>${esc(item.name)}${item.active ? '' : ' (Đã đóng)'}</option>`).join('') || `<option>${state.loading ? 'Đang tải đợt đồ án…' : state.termsLoaded ? 'Chưa có đợt đồ án' : 'Chưa tải được danh sách đợt đồ án'}</option>`}</select></label></section>
      ${content}
    </main></div></div>`
}
