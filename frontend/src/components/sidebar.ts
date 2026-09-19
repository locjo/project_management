import { escapeHtml } from '../lib/html'
import type { NavigationItem, SidebarProps } from '../types/layout'
import { renderLogo } from './logo'

function renderItem(item: NavigationItem, activePath?: string): string {
  if (item.children?.length) {
    return `<details class="sidebar-group" open>
      <summary class="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl text-body-sm font-semibold">
        <span aria-hidden="true" class="material-symbols-outlined text-[20px]">${escapeHtml(item.icon)}</span><span>${escapeHtml(item.label)}</span>
        <span aria-hidden="true" class="material-symbols-outlined sidebar-group-arrow">expand_more</span>
      </summary>
      <div class="sidebar-submenu">${item.children.map(child => renderItem(child, activePath)).join('')}</div>
    </details>`
  }
  const active = item.path === activePath
  const state = active ? 'bg-primary/10 text-primary font-semibold' : item.danger ? 'text-error hover:bg-error-container/20' : 'text-on-surface-variant hover:bg-surface-container-high'
  return `<a href="#" data-path="${escapeHtml(item.path)}" ${active ? 'aria-current="page"' : ''} class="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl text-body-sm transition-colors ${state}">
    <span aria-hidden="true" class="material-symbols-outlined text-[20px]">${escapeHtml(item.icon)}</span><span>${escapeHtml(item.label)}</span></a>`
}

export function renderSidebar(props: SidebarProps): string {
  const position = props.variant === 'student'
    ? 'w-72 flex-shrink-0 hidden md:flex min-h-screen sticky top-0'
    : `fixed left-0 top-0 bottom-0 z-50 ${props.variant === 'faculty' ? 'w-64' : 'w-72'} flex`
  return `<aside data-component="sidebar" class="${position} bg-surface-container-lowest border-r border-surface-container-high flex-col justify-between">
    <div class="flex-1 overflow-y-auto">
      <div class="h-16 px-space-md flex items-center border-b border-surface-container-high">${renderLogo(props.logo)}</div>
      <div class="p-space-md flex flex-col gap-space-md">
        <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
          <div class="flex items-center justify-between gap-1 text-[10px] text-secondary font-semibold"><span>ĐỢT BẢO VỆ ĐATN</span><span class="text-primary">${escapeHtml(props.period.status)}</span></div>
          <div class="text-xs font-semibold mt-2">${escapeHtml(props.period.title)}</div><div class="text-[11px] text-secondary mt-1">${escapeHtml(props.period.dates)}</div>
        </div>
        <nav aria-label="${escapeHtml(props.heading)}" class="flex flex-col gap-1">
          <div class="text-[11px] text-secondary font-semibold uppercase mb-2">${escapeHtml(props.heading)}</div>
          ${props.items.map(item => renderItem(item, props.activePath)).join('')}
        </nav>
      </div>
    </div>
    <div class="p-space-md border-t border-surface-container-high">${props.footerItems.map(item => renderItem(item, props.activePath)).join('')}</div>
  </aside>`
}
