import { renderHeader } from '../components/header'
import { renderSidebar } from '../components/sidebar'
import { portalLayouts } from '../lib/portal-layouts'

/** Render the department page using the supplied HUMG design. */
export default function renderPage(): string {
  const layout = portalLayouts.department
  return `${renderSidebar(layout.sidebar)}<div class="pl-72 flex flex-col min-h-screen">${renderHeader(layout.header)}<main class="w-full flex-1 pt-16 bg-surface px-space-lg py-space-lg"><div class="flex flex-col w-full gap-space-lg pb-12">
<!-- Top Welcome Banner -->
<div class="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary p-space-lg shadow-md">
<!-- Subtle Ambient Graphic Pattern -->
<div class="absolute -right-12 -top-12 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
<div class="absolute right-1/4 -bottom-16 w-64 h-64 rounded-full bg-surface-tint/20 blur-2xl pointer-events-none"></div>
<div class="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
<div class="flex flex-col gap-2 max-w-3xl">
<div class="flex flex-wrap items-center gap-2">
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption-xs font-caption-xs bg-surface-container-lowest/15 backdrop-blur-md text-on-primary ring-1 ring-white/20">
<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Đang mở thẩm định đề tài
          </span>
<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption-xs font-caption-xs bg-surface-container-lowest/15 backdrop-blur-md text-on-primary ring-1 ring-white/20">
<span class="material-symbols-outlined text-[14px]">event_busy</span>
            Hạn chốt duyệt BM: 20/05/2025
          </span>

</div>
<h1 class="font-display-lg text-display-lg text-white tracking-tight mt-1">
          Xin chào, PGS. TS. Trần Xuân Thành
        </h1>
<p class="font-body-base text-body-base text-on-primary/90 leading-relaxed">
          Cổng Trưởng Bộ môn (DEPT_HEAD) — Quản lý tải Giảng viên hướng dẫn, Thẩm định Đề xuất Đề tài &amp; Theo dõi Sinh viên ĐATN <span class="font-semibold text-white underline decoration-emerald-400 decoration-2 underline-offset-4">Bộ môn Tin học Trắc địa - Mỏ</span> • Đợt 2 HK2 (2024 - 2025) K65
        </p>
</div>
<div class="flex flex-wrap items-center gap-3 shrink-0">
<button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 active:scale-[0.98] transition-all text-white font-body-sm-medium text-body-sm-medium backdrop-blur-sm" type="button">
<span class="material-symbols-outlined text-[19px]">file_download</span>
<span class="">Xuất báo cáo Bộ môn (Excel)</span>
</button>
<button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-body-bold text-body-bold shadow-sm hover:bg-surface-bright active:scale-[0.98] transition-all" type="button">
<span class="material-symbols-outlined text-[20px] text-primary">verified</span>
<span class="">Duyệt nhanh đề tài (4)</span>
</button>
</div>
</div>
</div>
<!-- 4 KPI Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
<!-- Card 1 -->
<div class="flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-start justify-between gap-2">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Tổng Giảng viên Bộ môn</span>
<span class="font-stat-lg text-stat-lg text-on-surface mt-1">12 <span class="text-base font-normal text-secondary font-body-sm">Cán bộ GV</span></span>
</div>
<div class="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-2xl">badge</span>
</div>
</div>
<div class="flex flex-col gap-1.5 mt-4 pt-3 border-t border-surface-container">
<div class="flex items-center justify-between text-caption-xs font-caption-xs text-secondary">
<span class="font-semibold text-emerald-700">100% tham gia HD đợt 2</span>
<span class="">12/12 GV</span>
</div>
<div class="flex items-center gap-1.5 text-caption-xs font-caption-xs text-on-surface-variant">
<span class="px-1.5 py-0.5 rounded bg-surface-container-high font-medium">4 PGS.TS</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container-high font-medium">6 TS</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container-high font-medium">2 ThS</span>
</div>
</div>
</div>
<!-- Card 2 -->
<div class="flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-start justify-between gap-2">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Tổng Chỉ tiêu Định mức</span>
<span class="font-stat-lg text-stat-lg text-on-surface mt-1">78 <span class="text-base font-normal text-secondary font-body-sm">Sinh viên</span></span>
</div>
<div class="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-2xl">groups</span>
</div>
</div>
<div class="flex flex-col gap-1.5 mt-4 pt-3 border-t border-surface-container">
<div class="flex items-center justify-between text-caption-xs font-caption-xs">
<span class="text-on-surface-variant font-medium">Đã nhận: <b class="text-primary">65</b>/78 SV</span>
<span class="font-bold text-primary">83.3%</span>
</div>
<div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-2 rounded-full transition-all duration-500" style="width: 83.3%"></div>
</div>
</div>
</div>
<!-- Card 3 -->
<div class="flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-start justify-between gap-2">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Đề xuất chờ thẩm định</span>
<span class="font-stat-lg text-stat-lg text-amber-700 mt-1">06 <span class="text-base font-normal text-secondary font-body-sm">Đề tài</span></span>
</div>
<div class="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
<span class="material-symbols-outlined text-2xl">rate_review</span>
</div>
</div>
<div class="flex flex-col gap-1.5 mt-4 pt-3 border-t border-surface-container">
<div class="flex items-center justify-between text-caption-xs font-caption-xs">
<span class="text-amber-800 font-medium">Cần phê duyệt trước hạn</span>
<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Ưu tiên</span>
</div>
<div class="flex items-center gap-1 text-caption-xs font-caption-xs text-secondary">
<span class="material-symbols-outlined text-[14px] text-amber-600">schedule</span>
<span class="">4 đề xuất mới nộp trong 24h</span>
</div>
</div>
</div>
<!-- Card 4 -->
<div class="flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
<div class="flex items-start justify-between gap-2">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Slot trống toàn Bộ môn</span>
<span class="font-stat-lg text-stat-lg text-emerald-700 mt-1">13 <span class="text-base font-normal text-secondary font-body-sm">Vị trí</span></span>
</div>
<div class="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
<span class="material-symbols-outlined text-2xl">event_seat</span>
</div>
</div>
<div class="flex flex-col gap-1.5 mt-4 pt-3 border-t border-surface-container">
<div class="flex items-center justify-between text-caption-xs font-caption-xs">
<span class="text-secondary">Sẵn sàng nhận SV Khoa phân bổ</span>
<span class="text-emerald-700 font-semibold">Khả dụng</span>
</div>
<div class="flex items-center gap-1 text-caption-xs font-caption-xs text-secondary">
<span class="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
<span class="">5 Giảng viên còn chỉ tiêu</span>
</div>
</div>
</div>
</div>
<!-- Main 2-Column Work Surface -->
<div class="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
<!-- LEFT COLUMN: Quản lý Tải GV (7/12) -->
<section class="xl:col-span-7 flex flex-col gap-space-md">

<!-- Lecturers Table Container -->
<div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm overflow-hidden">
<div class="overflow-x-auto">
<table class="w-full text-left text-body-sm font-body-sm">
<thead>
<tr class="text-secondary font-label-caps text-label-caps uppercase bg-surface-container-low rounded-xl">
<th class="py-3 px-4 rounded-l-xl">Giảng viên / Học vị</th>
<th class="py-3 px-3">Tải hướng dẫn</th>
<th class="py-3 px-3 text-center">Tiến độ tải</th>
<th class="py-3 px-3 text-center">Chờ duyệt</th>
<th class="py-3 px-4 text-right rounded-r-xl">Thao tác</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-high/60">
<!-- GV 1: PGS.TS. Trần Xuân Thành -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      TT
                    </div>
<div class="flex flex-col min-w-0">
<div class="font-body-bold text-body-bold text-on-surface flex items-center gap-1.5 truncate">
<span class="">PGS. TS. Trần Xuân Thành</span>
<span class="px-1.5 py-0.2 rounded text-[11px] bg-primary-container/15 text-primary font-medium">Trưởng BM</span>
</div>
<span class="text-caption-xs font-caption-xs text-secondary">Mã GV: GV0108 • BM Tin học Trắc địa - Mỏ</span>
</div>
</div>
</td>
<td class="py-3.5 px-3 whitespace-nowrap">
<span class="font-bold text-on-surface">8/8</span> <span class="text-caption-xs font-caption-xs text-secondary">SV</span>
<div class="mt-0.5">
<span class="inline-flex px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-slate-100 text-slate-700 font-semibold">Đầy tải (0 slot)</span>
</div>
</td>
<td class="py-3.5 px-3 min-w-[130px]">
<div class="flex items-center gap-2">
<div class="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-2 rounded-full" style="width: 100%"></div>
</div>
<span class="text-caption-xs font-caption-xs font-semibold text-primary">100%</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-surface-container text-secondary">
                    0
                  </span>
</td>
<td class="py-3.5 px-4 text-right whitespace-nowrap">
<div class="inline-flex items-center gap-1.5">
<button class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-caption-xs transition-colors" type="button">
                      Chi tiết
                    </button>
<button class="px-2.5 py-1.5 rounded-lg bg-surface-variant/50 text-secondary cursor-not-allowed font-body-sm-medium text-caption-xs" disabled="" title="Đã đủ chỉ tiêu" type="button">
                      Phân bổ
                    </button>
</div>
</td>
</tr>
<!-- GV 2: TS. Đặng Vũ Tùng -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">
                      ĐT
                    </div>
<div class="flex flex-col min-w-0">
<div class="font-body-bold text-body-bold text-on-surface truncate">
                        TS. Đặng Vũ Tùng
                      </div>
<span class="text-caption-xs font-caption-xs text-secondary">Mã GV: GV0214 • TS. Kỹ thuật Phần mềm</span>
</div>
</div>
</td>
<td class="py-3.5 px-3 whitespace-nowrap">
<span class="font-bold text-on-surface">7/8</span> <span class="text-caption-xs font-caption-xs text-secondary">SV</span>
<div class="mt-0.5">
<span class="inline-flex px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-emerald-50 text-emerald-700 font-semibold">Còn 1 slot</span>
</div>
</td>
<td class="py-3.5 px-3 min-w-[130px]">
<div class="flex items-center gap-2">
<div class="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-2 rounded-full" style="width: 87.5%"></div>
</div>
<span class="text-caption-xs font-caption-xs font-semibold text-primary">87.5%</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-amber-100 text-amber-800 font-bold animate-pulse">
                    2 SV
                  </span>
</td>
<td class="py-3.5 px-4 text-right whitespace-nowrap">
<div class="inline-flex items-center gap-1.5">
<button class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-caption-xs transition-colors" type="button">
                      Chi tiết
                    </button>
<button class="px-2.5 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all font-body-sm-medium text-caption-xs shadow-xs" type="button">
                      Phân bổ SV
                    </button>
</div>
</td>
</tr>
<!-- GV 3: TS. Vũ Duy Hưng -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0">
                      VH
                    </div>
<div class="flex flex-col min-w-0">
<div class="font-body-bold text-body-bold text-on-surface truncate">
                        TS. Vũ Duy Hưng
                      </div>
<span class="text-caption-xs font-caption-xs text-secondary">Mã GV: GV0189 • TS. Hệ thống Thông tin Mỏ</span>
</div>
</div>
</td>
<td class="py-3.5 px-3 whitespace-nowrap">
<span class="font-bold text-on-surface">5/8</span> <span class="text-caption-xs font-caption-xs text-secondary">SV</span>
<div class="mt-0.5">
<span class="inline-flex px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-emerald-50 text-emerald-700 font-semibold">Còn 3 slot</span>
</div>
</td>
<td class="py-3.5 px-3 min-w-[130px]">
<div class="flex items-center gap-2">
<div class="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-2 rounded-full" style="width: 62.5%"></div>
</div>
<span class="text-caption-xs font-caption-xs font-semibold text-primary">62.5%</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-amber-100 text-amber-800 font-bold">
                    1 SV
                  </span>
</td>
<td class="py-3.5 px-4 text-right whitespace-nowrap">
<div class="inline-flex items-center gap-1.5">
<button class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-caption-xs transition-colors" type="button">
                      Chi tiết
                    </button>
<button class="px-2.5 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all font-body-sm-medium text-caption-xs shadow-xs" type="button">
                      Phân bổ SV
                    </button>
</div>
</td>
</tr>
<!-- GV 4: ThS. Nguyễn Đức Toàn -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0">
                      NT
                    </div>
<div class="flex flex-col min-w-0">
<div class="font-body-bold text-body-bold text-on-surface truncate">
                        ThS. Nguyễn Đức Toàn
                      </div>
<span class="text-caption-xs font-caption-xs text-secondary">Mã GV: GV0302 • ThS. Khoa học Máy tính</span>
</div>
</div>
</td>
<td class="py-3.5 px-3 whitespace-nowrap">
<span class="font-bold text-on-surface">6/6</span> <span class="text-caption-xs font-caption-xs text-secondary">SV</span>
<div class="mt-0.5">
<span class="inline-flex px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-slate-100 text-slate-700 font-semibold">Đầy tải (0 slot)</span>
</div>
</td>
<td class="py-3.5 px-3 min-w-[130px]">
<div class="flex items-center gap-2">
<div class="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-2 rounded-full" style="width: 100%"></div>
</div>
<span class="text-caption-xs font-caption-xs font-semibold text-primary">100%</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-surface-container text-secondary">
                    0
                  </span>
</td>
<td class="py-3.5 px-4 text-right whitespace-nowrap">
<div class="inline-flex items-center gap-1.5">
<button class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-caption-xs transition-colors" type="button">
                      Chi tiết
                    </button>
<button class="px-2.5 py-1.5 rounded-lg bg-surface-variant/50 text-secondary cursor-not-allowed font-body-sm-medium text-caption-xs" disabled="" title="Đã đủ chỉ tiêu" type="button">
                      Phân bổ
                    </button>
</div>
</td>
</tr>
<!-- GV 5: PGS.TS. Lê Bá Dũng -->
<tr class="hover:bg-surface-container-low/60 transition-colors">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0">
                      LD
                    </div>
<div class="flex flex-col min-w-0">
<div class="font-body-bold text-body-bold text-on-surface truncate">
                        PGS. TS. Lê Bá Dũng
                      </div>
<span class="text-caption-xs font-caption-xs text-secondary">Mã GV: GV0094 • Chuyên gia Địa Tin học</span>
</div>
</div>
</td>
<td class="py-3.5 px-3 whitespace-nowrap">
<span class="font-bold text-on-surface">6/8</span> <span class="text-caption-xs font-caption-xs text-secondary">SV</span>
<div class="mt-0.5">
<span class="inline-flex px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-emerald-50 text-emerald-700 font-semibold">Còn 2 slot</span>
</div>
</td>
<td class="py-3.5 px-3 min-w-[130px]">
<div class="flex items-center gap-2">
<div class="flex-1 bg-surface-container h-2 rounded-full overflow-hidden">
<div class="bg-primary h-2 rounded-full" style="width: 75%"></div>
</div>
<span class="text-caption-xs font-caption-xs font-semibold text-primary">75%</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<span class="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-caption-xs font-caption-xs bg-surface-container text-secondary">
                    0
                  </span>
</td>
<td class="py-3.5 px-4 text-right whitespace-nowrap">
<div class="inline-flex items-center gap-1.5">
<button class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-caption-xs transition-colors" type="button">
                      Chi tiết
                    </button>
<button class="px-2.5 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all font-body-sm-medium text-caption-xs shadow-xs" type="button">
                      Phân bổ SV
                    </button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Table Footer Meta -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 px-3 mt-2 border-t border-surface-container text-caption-xs font-caption-xs text-secondary">
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[15px] text-primary">info</span>
<span class="">Hiển thị 5/12 giảng viên chính nhiệm • Hạn mức tối đa: PGS.TS (8 SV), TS (8 SV), ThS (6 SV)</span>
</div>
<a class="font-body-sm-medium text-primary hover:underline inline-flex items-center gap-1" href="#">
            Xem toàn bộ 12 giảng viên
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
</a>
</div>
</div>
<!-- Quick Allocation Advisory Note -->
<div class="p-space-md rounded-xl bg-secondary-container/40 text-on-secondary-fixed flex items-start gap-3">
<span class="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">lightbulb</span>
<div class="text-caption-xs font-caption-xs leading-relaxed">
<span class="font-bold text-on-surface">Quy tắc điều phối Bộ môn:</span> Bộ môn ưu tiên giảng viên hoàn thành chỉ tiêu tối thiểu 70% trước ngày 15/05/2025. Các sinh viên diện Khoa phân bổ trực tiếp sẽ tự động xếp vào GV còn trên 2 slot trống theo độ ưu tiên chuyên môn hẹp.
        </div>
</div>
</section>
<!-- RIGHT COLUMN: Thẩm định Đề xuất & Timeline (5/12) -->
<section class="xl:col-span-5 flex flex-col gap-space-md">
<!-- Card 1: Thẩm định Đề xuất Đề tài -->
<div class="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2.5 h-6 rounded-full bg-amber-500"></span>
<div>
<h2 class="font-title-sm text-title-sm text-on-surface">Thẩm định Đề xuất Đề tài</h2>
<span class="font-caption-xs text-caption-xs text-secondary">Hội đồng khoa học BM duyệt nội dung</span>
</div>
</div>
<span class="px-2.5 py-1 rounded-full text-caption-xs font-caption-xs bg-amber-50 text-amber-800 font-bold">
            Chờ duyệt: 4
          </span>
</div>
<!-- Filter Sub-tabs -->
<div class="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container text-caption-xs font-caption-xs">
<button class="flex-1 py-1.5 text-center font-bold bg-surface-container-lowest text-primary rounded-lg shadow-xs">
            Chờ thẩm định (4)
          </button>
<button class="flex-1 py-1.5 text-center text-secondary hover:text-on-surface transition-colors">
            Đã thông qua (18)
          </button>
<button class="flex-1 py-1.5 text-center text-secondary hover:text-on-surface transition-colors">
            Cần sửa (2)
          </button>
</div>
<!-- Topic Cards Queue -->
<div class="flex flex-col gap-3">
<!-- Topic Item 1 -->
<div class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-2.5">
<div class="flex items-start justify-between gap-2">
<div class="flex flex-wrap items-center gap-1.5">
<span class="px-2 py-0.5 rounded font-mono text-[11px] bg-primary/10 text-primary font-semibold">DT-2025-042</span>

</div>
<span class="text-caption-xs font-caption-xs text-secondary flex items-center gap-0.5">
<span class="material-symbols-outlined text-[13px]">person</span> Dự kiến: <b>2 SV</b>
</span>
</div>
<div class="font-body-bold text-body-bold text-on-surface leading-snug">
              Xây dựng hệ thống WebGIS giám sát biến dạng công trình mỏ than lộ thiên thời gian thực
            </div>
<div class="flex items-center justify-between text-caption-xs font-caption-xs pt-2 border-t border-surface-container-high/60">
<div class="flex items-center gap-1.5 text-secondary">
<span class="material-symbols-outlined text-[15px] text-primary">school</span>
<span class="">Đề xuất: <strong class="text-on-surface">TS. Đặng Vũ Tùng</strong></span>
</div>
<span class="text-secondary text-[11px]">Nộp: 2 giờ trước</span>
</div>
<!-- Approval Footers Action -->
<div class="grid grid-cols-2 gap-2 mt-1">
<button class="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-body-sm-medium text-caption-xs font-semibold transition-colors" type="button">
<span class="material-symbols-outlined text-[17px] text-emerald-600">check_circle</span>
                Phê duyệt thông qua
              </button>
<button class="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-surface-container-highest/60 hover:bg-surface-container-highest text-secondary hover:text-on-surface font-body-sm-medium text-caption-xs font-semibold transition-colors" type="button">
<span class="material-symbols-outlined text-[17px]">edit_note</span>
                Góp ý chỉnh sửa
              </button>
</div>
</div>
<!-- Topic Item 2 -->
<div class="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-2.5">
<div class="flex items-start justify-between gap-2">
<div class="flex flex-wrap items-center gap-1.5">
<span class="px-2 py-0.5 rounded font-mono text-[11px] bg-primary/10 text-primary font-semibold">DT-2025-051</span>

</div>
<span class="text-caption-xs font-caption-xs text-secondary flex items-center gap-0.5">
<span class="material-symbols-outlined text-[13px]">person</span> Dự kiến: <b>1 SV</b>
</span>
</div>
<div class="font-body-bold text-body-bold text-on-surface leading-snug">
              Ứng dụng mạng nơ-ron tích chập (YOLOv8) phát hiện nứt bề mặt vách hầm lò từ dữ liệu ảnh UAV
            </div>
<div class="flex items-center justify-between text-caption-xs font-caption-xs pt-2 border-t border-surface-container-high/60">
<div class="flex items-center gap-1.5 text-secondary">
<span class="material-symbols-outlined text-[15px] text-primary">school</span>
<span class="">Đề xuất: <strong class="text-on-surface">TS. Vũ Duy Hưng</strong></span>
</div>
<span class="text-secondary text-[11px]">Nộp: Hôm qua</span>
</div>
<div class="grid grid-cols-2 gap-2 mt-1">
<button class="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-body-sm-medium text-caption-xs font-semibold transition-colors" type="button">
<span class="material-symbols-outlined text-[17px] text-emerald-600">check_circle</span>
                Phê duyệt thông qua
              </button>
<button class="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-surface-container-highest/60 hover:bg-surface-container-highest text-secondary hover:text-on-surface font-body-sm-medium text-caption-xs font-semibold transition-colors" type="button">
<span class="material-symbols-outlined text-[17px]">edit_note</span>
                Góp ý chỉnh sửa
              </button>
</div>
</div>
</div>
<a class="w-full py-2.5 rounded-xl bg-surface-container text-center text-primary font-body-sm-medium text-caption-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 font-semibold" href="#">
<span class="">Xem tất cả danh sách thẩm định đề tài</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
</a>
</div>
<!-- Card 2: Kế hoạch & Tiến độ Đợt 2 Bộ môn -->

</section>
</div>
</div></main><footer class="w-full bg-surface-container-low shadow-[0_-1px_4px_rgba(0,0,0,0.02)] px-space-lg py-space-md mt-auto"><div class="w-full flex flex-col md:flex-row items-center justify-between gap-space-sm text-secondary font-caption-xs text-caption-xs"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-primary">info</span><span class="">Hệ thống Đồ án Tốt nghiệp CNTT v3.4 • Khoa CNTT - Tầng 7 Nhà C12 Đại học Mỏ - Địa chất, 18 Phố Viên, Đức Thắng, Bắc Từ Liêm, Hà Nội.</span></div><div class="flex items-center gap-1 font-medium text-on-surface-variant"><span class="material-symbols-outlined text-[15px] text-primary">call</span><span class="">Hotline Trợ lý đào tạo: <span class="font-semibold text-primary">(024) 3838 7568</span></span></div></div></footer></div>



`
}
