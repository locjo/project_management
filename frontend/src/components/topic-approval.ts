import { escapeHtml as esc } from '../lib/html'
import type { Topic } from '../types/api'

const labels: Record<Topic['status'], string> = { PENDING: 'Đang chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Đã từ chối' }
const groups: Topic['status'][] = ['APPROVED', 'PENDING', 'REJECTED']

export function renderTopicApproval(topics: Topic[], reviewer: boolean): string {
  return `<section class="api-card" id="${reviewer ? 'topics' : 'my-topics'}" data-topic-list>
    <h2>${reviewer ? 'Đề tài khoa CNTT trong đợt' : 'Đề tài của tôi'} (${topics.length})</h2>
    <label class="block my-3">Tìm đề tài<input class="api-input" data-topic-filter placeholder="Tên đề tài, giảng viên hoặc lĩnh vực"></label>
    ${groups.map(status => {
      const items = topics.filter(topic => topic.status === status)
      const id = reviewer ? status === 'PENDING' ? 'topic-approval' : `topic-${status.toLowerCase()}` : `my-topics-${status.toLowerCase()}`
      return `<section class="mt-6" id="${id}">
    <h3 class="font-semibold">Đề tài ${labels[status].toLowerCase()} (${items.length})</h3>
    <div class="api-grid mt-4">${items.map(topic => `<article class="api-topic" data-topic-search="${esc(`${topic.title} ${topic.lecturerName} ${topic.categoryName}`)}">
      <span class="api-badge">${labels[topic.status]}</span>
      <h3 class="font-semibold my-3">${esc(topic.title)}</h3>
      <p class="text-secondary text-sm">${esc(topic.lecturerName)} · ${esc(topic.categoryName)}</p>
      <p class="mt-3">${esc(topic.description ?? '')}</p>
      ${reviewer && topic.status === 'PENDING' ? `<div class="flex flex-wrap gap-3 mt-4">
        <button type="button" class="api-button" data-topic-review="${topic.id}" data-decision="APPROVED">Phê duyệt</button>
        <button type="button" class="api-button secondary" data-topic-review="${topic.id}" data-decision="REJECTED">Từ chối</button>
      </div>` : ''}
    </article>`).join('') || `<p class="text-secondary py-3">Chưa có đề tài ${labels[status].toLowerCase()} trong đợt này.</p>`}</div>
    </section>`
    }).join('')}
    <p data-topic-empty hidden>Không có đề tài phù hợp.</p>
  </section>`
}
