import { escapeHtml } from '../lib/html'
import { universityLogoUrl } from '../lib/branding'
import type { LogoProps } from '../types/layout'

export function renderLogo({ title = 'ĐH MỎ - ĐỊA CHẤT', subtitle = 'KHOA CÔNG NGHỆ THÔNG TIN', variant = 'university', imageUrl }: LogoProps = {}): string {
  imageUrl ??= variant === 'university' ? universityLogoUrl : undefined
  return `<div class="flex items-center gap-space-sm min-w-0" data-component="logo">
    ${imageUrl
      ? `<img src="${escapeHtml(imageUrl)}" alt="HUMG Logo" class="h-9 w-auto object-contain shrink-0">`
      : variant === 'portal'
      ? '<span class="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0"><span aria-hidden="true" class="material-symbols-outlined">school</span></span>'
      : '<span class="logo-fallback" aria-label="HUMG">HUMG</span>'}
    <div class="min-w-0"><div class="font-bold text-[13px] text-primary leading-tight">${escapeHtml(title)}</div>
    <div class="text-[10px] text-secondary mt-1">${escapeHtml(subtitle)}</div></div>
  </div>`
}
