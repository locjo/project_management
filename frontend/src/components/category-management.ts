import { escapeHtml as esc } from '../lib/html'
import type { TopicCategory } from '../types/api'

export function renderCategories(categories: TopicCategory[], canManage: boolean): string {
  return `<section class="api-card" id="categories"><h2>Lĩnh vực đề tài</h2>
    ${canManage ? `<form id="category-form" class="api-form mt-5">
      <input type="hidden" name="id"><p data-edit-label hidden>Đang sửa lĩnh vực</p>
      <label>Mã lĩnh vực<input name="code" required maxlength="50"></label>
      <label>Tên lĩnh vực<input name="name" required maxlength="200"></label>
      <label>Mô tả<textarea name="description"></textarea></label>
      <label>Trạng thái<select name="isActive"><option value="true">Hoạt động</option><option value="false">Ngừng sử dụng</option></select></label>
      <button class="api-button" type="submit">Thêm lĩnh vực</button>
      <button class="api-button secondary" type="button" data-cancel-category hidden>Hủy sửa</button>
    </form><div class="overflow-x-auto mt-5"><table class="api-table"><thead><tr><th>Mã</th><th>Tên lĩnh vực</th><th>Mô tả</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
      ${categories.map(item => `<tr><td>${esc(item.code)}</td><td>${esc(item.name)}</td><td>${esc(item.description ?? '')}</td><td>${item.isActive ? 'Hoạt động' : 'Ngừng sử dụng'}</td><td><button type="button" class="api-button secondary" data-edit-category="${item.id}">Sửa</button> <button type="button" class="api-button secondary" data-delete-category="${item.id}">Xóa</button></td></tr>`).join('')}
    </tbody></table></div>` : `<div class="flex flex-wrap gap-2 mt-4">${categories.filter(item => item.isActive).map(item => `<span class="api-badge">${esc(item.name)}</span>`).join('')}</div>`}
    ${categories.length ? '' : '<p class="text-secondary py-5">Chưa có lĩnh vực.</p>'}
  </section>`
}
