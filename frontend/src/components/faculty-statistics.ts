import { escapeHtml as esc } from '../lib/html'
import type { GraduationTerm, LecturerQuota, Topic } from '../types/api'

export function renderFacultyStatistics(term: GraduationTerm | undefined, topics: Topic[], lecturers: LecturerQuota[]): string {
  if (!term) return '<section class="api-card" id="faculty-statistics"><h2>Thống kê khoa</h2><p class="text-secondary py-5">Chưa có đợt đồ án để thống kê.</p></section>'

  const termTopics = topics.filter(topic => topic.graduationTermId === term.id)
  const sum = (field: 'approvedStudents' | 'pendingRequests' | 'availableSlots' | 'studentLimit') => lecturers.reduce((total, lecturer) => total + lecturer[field], 0)
  const metrics: [string, number][] = [
    ['Tổng đề tài', termTopics.length],
    ['Đề tài đã duyệt', termTopics.filter(topic => topic.status === 'APPROVED').length],
    ['Đề tài chờ duyệt', termTopics.filter(topic => topic.status === 'PENDING').length],
    ['Đề tài đã từ chối', termTopics.filter(topic => topic.status === 'REJECTED').length],
    ['Giảng viên hướng dẫn', lecturers.length],
    ['Sinh viên đã nhận', sum('approvedStudents')],
    ['Yêu cầu đăng ký chờ duyệt', sum('pendingRequests')],
    ['Tổng chỉ tiêu sinh viên', sum('studentLimit')],
    ['Chỗ hướng dẫn còn trống', sum('availableSlots')],
  ]
  return `<section class="api-card" id="faculty-statistics">
    <h2>Thống kê khoa</h2><p class="text-secondary mt-2">Đợt đồ án: ${esc(term.name)}</p>
    <dl class="api-grid mt-5">${metrics.map(([label, value]) => `<div class="api-topic"><dt class="text-secondary">${label}</dt><dd class="text-2xl font-bold mt-2">${value}</dd></div>`).join('')}</dl>
  </section>`
}
