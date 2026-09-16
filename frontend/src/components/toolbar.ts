import { labels } from '../lib/routes'
import type { Screen } from '../types'

export function renderToolbar(current: Screen): string {
  return `<div class="demo-toolbar">
    <span>HUMG <small>· Bản mẫu giao diện</small></span>
    <label>Màn hình <select id="screen-picker">
      ${Object.entries(labels).map(([value, label]) => `<option value="${value}" ${current === value ? 'selected' : ''}>${label}</option>`).join('')}
    </select></label>
  </div>`
}
