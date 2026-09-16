import { escapeHtml } from '../lib/html'
import type { HeaderProps } from '../types/layout'

export function renderHeader(props: HeaderProps): string {
  switch (props.variant) {
    case 'faculty': return `<header class="fixed top-0 right-0 left-64 h-16 z-40 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
<div class="h-16 w-full px-margin-desktop flex items-center justify-between gap-space-md">
<div class="flex flex-col">
<span class="font-body-bold text-body-sm-medium text-primary uppercase tracking-tight">HỆ THỐNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP CNTT</span>
<span class="font-caption-xs text-caption-xs text-secondary">TRƯỜNG ĐẠI HỌC MỎ - ĐỊA CHẤT (HUMG) • CỔNG QUẢN TRỊ KHOA</span>
</div>
<div class="flex items-center gap-space-md min-w-max">
<div class="flex items-center gap-space-sm">
<div class="text-right hidden md:block">
<div class="font-body-bold text-body-sm text-on-surface leading-tight">${escapeHtml(props.name)}</div>
<div class="font-caption-xs text-caption-xs text-primary-container font-medium">${escapeHtml(props.description)}</div>
</div>
<div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
</div>
</div>
</div>
</div>
</header>`
    case 'student': return `<header class="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30 px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
<div class="flex items-center gap-3 min-w-0">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">school</span>
<span class="font-body-bold text-sm text-on-surface">Hệ thống Quản lý Đồ án Tốt nghiệp</span>
</div>
</div>
<div class="flex items-center gap-3 flex-shrink-0">
<div class="flex items-center gap-2.5">
<div class="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-body-bold text-sm shadow-sm">${escapeHtml(props.initials ?? "")}</div>
<div class="hidden sm:flex flex-col text-left">
<span class="font-body-bold text-body-sm text-on-surface leading-tight">${escapeHtml(props.name)}</span>
<span class="font-caption-xs text-[11px] text-on-surface-variant">${escapeHtml(props.description)}</span>
</div>
</div>
</div>
</header>`
    case 'department': return `<header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
<div class="flex flex-col">
<div class="font-body-bold text-body-bold text-on-surface tracking-tight leading-tight uppercase">HỆ THỐNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP CNTT</div>
<div class="font-caption-xs text-caption-xs text-secondary font-medium tracking-wide uppercase">TRƯỜNG ĐẠI HỌC MỎ - ĐỊA CHẤT (HUMG) • CỔNG GIẢNG VIÊN HƯỚNG DẪN</div>
</div>
<div class="flex items-center gap-space-md">
<button aria-label="Thông báo" class="relative w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors" type="button">
<span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest">
</span>
</button>
<div class="flex items-center gap-space-sm pl-space-sm border-l border-surface-container-high">
<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
</div>
<div class="flex flex-col text-left">
<span class="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold leading-tight">${escapeHtml(props.name)}</span>
<span class="font-caption-xs text-caption-xs text-secondary leading-tight">${escapeHtml(props.description)}</span>
</div>
</div>
</div>
</header>`
    case 'lecturer': return `<header class="fixed top-0 left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
<div class="flex flex-col">
<div class="font-body-bold text-body-bold text-on-surface tracking-tight leading-tight uppercase">HỆ THỐNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP CNTT</div>
<div class="font-caption-xs text-caption-xs text-secondary font-medium tracking-wide uppercase">TRƯỜNG ĐẠI HỌC MỎ - ĐỊA CHẤT (HUMG) • CỔNG GIẢNG VIÊN HƯỚNG DẪN</div>
</div>
<div class="relative flex items-center">
<button type="button" class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low ring-1 ring-outline-variant/30 shadow-sm transition-all text-left">
<div class="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-[13px] flex items-center justify-center shrink-0 shadow-sm">${escapeHtml(props.initials ?? "")}</div>
<div class="flex flex-col">
<div class="font-body-bold text-[13px] leading-tight text-on-surface flex items-center gap-1.5">
<span class="">${escapeHtml(props.name)}</span>
<span class="w-1.5 h-1.5 rounded-full bg-emerald-500">
</span>
</div>
<span class="font-caption-xs text-[11px] text-secondary leading-tight">${escapeHtml(props.description)}</span>
</div>
<span class="material-symbols-outlined text-[18px] text-secondary ml-1">expand_more</span>
</button>
<div class="absolute right-0 top-12 w-80 rounded-xl bg-surface-container-lowest shadow-md ring-1 ring-outline-variant/30 p-3 z-50 flex flex-col gap-2.5 animate-fadeIn">
<div class="flex items-start gap-3 pb-2.5 border-b border-surface-container-high">
<div class="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-body-bold shrink-0 ring-2 ring-primary-fixed">${escapeHtml(props.initials ?? "")}</div>
<div class="flex flex-col flex-1 min-w-0">
<div class="font-body-bold text-[14px] text-on-surface truncate">${escapeHtml(props.name)}</div>
<div class="font-caption-xs text-secondary truncate">${escapeHtml(props.email ?? "")}</div>
<div class="flex items-center gap-1.5 mt-1">
<span class="px-1.5 py-0.2 rounded bg-primary-fixed/10 text-primary font-caption-xs text-[11px] font-semibold">Mã GV: GV0089</span>
<span class="px-1.5 py-0.2 rounded bg-surface-container-high text-secondary font-caption-xs text-[11px]">Học vị: Tiến sĩ</span>
</div>
<div class="font-caption-xs text-secondary mt-0.5 truncate">Bộ môn Công nghệ Phần mềm</div>
</div>
</div>
<div class="grid grid-cols-4 gap-1 p-2 rounded-lg bg-surface-container-low/70 text-center">
<div class="flex flex-col">
<span class="font-caption-xs text-[11px] text-secondary">Chỉ tiêu</span>
<span class="font-body-bold text-[13px] text-on-surface">8 SV</span>
</div>
<div class="flex flex-col">
<span class="font-caption-xs text-[11px] text-emerald-700">Đã nhận</span>
<span class="font-body-bold text-[13px] text-primary">5 SV</span>
</div>
<div class="flex flex-col">
<span class="font-caption-xs text-[11px] text-amber-700">Chờ duyệt</span>
<span class="font-body-bold text-[13px] text-amber-600">2 SV</span>
</div>
<div class="flex flex-col">
<span class="font-caption-xs text-[11px] text-secondary">Trống</span>
<span class="font-body-bold text-[13px] text-primary-container">1</span>
</div>
</div>
<div class="flex flex-col gap-0.5">
<a href="#" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors font-body-sm-medium text-[13px]">
<span class="material-symbols-outlined text-[18px] text-secondary">notifications_active</span>
<span class="">Cài đặt thông báo &amp; Nhắc việc</span>
</a>
<a href="#" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors font-body-sm-medium text-[13px]">
<span class="material-symbols-outlined text-[18px] text-secondary">lock_reset</span>
<span class="">Đổi mật khẩu / Bảo mật OTP</span>
</a>
</div>
<div class="pt-1 border-t border-surface-container-high">
<a href="#" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-error hover:bg-error-container hover:text-on-error-container font-body-sm-medium text-[13px] transition-colors">
<span class="material-symbols-outlined text-[18px]">logout</span>
<span class="">Đăng xuất khỏi hệ thống</span>
</a>
</div>
</div>
</div>
</header>`
  }
}
