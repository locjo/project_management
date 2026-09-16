import { renderHeader } from '../components/header'
import { renderSidebar } from '../components/sidebar'
import { portalLayouts } from '../lib/portal-layouts'

/** Render the faculty page using the supplied HUMG design. */
export default function renderPage(): string {
  const layout = portalLayouts.faculty
  return `${renderHeader(layout.header)}${renderSidebar(layout.sidebar)}<div class="pl-64"><main class="pt-16 min-h-screen bg-background w-full px-margin-desktop py-space-lg"><div class="flex flex-col w-full gap-space-lg pb-16">
<!-- Banner chào đón & Tóm tắt kỳ đồ án -->
<section class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-tertiary p-space-lg text-on-primary shadow-sm"><div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-on-primary/5 blur-2xl pointer-events-none"></div><div class="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-primary-fixed/10 blur-3xl pointer-events-none"></div><div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg"><div class="flex flex-col gap-space-xs max-w-3xl"><div class="flex flex-wrap items-center gap-space-xs"><span class="px-space-sm py-0.5 rounded-full bg-on-primary/15 text-primary-fixed font-caption-xs text-caption-xs uppercase tracking-wider backdrop-blur-sm">Khoa Công nghệ thông tin • HUMG</span><span class="flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-lowest/20 text-on-primary font-caption-xs text-caption-xs backdrop-blur-sm"><span class="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></span>Period Context: Đợt 2 - HK II (2024 - 2025) [Đang mở]</span></div><h1 class="font-headline-md text-headline-md tracking-tight text-on-primary mt-1">Xin chào, PGS. TS. Nguyễn Văn Nam</h1><p class="font-body-base text-body-base text-primary-fixed/90 leading-relaxed">Bảng điều khiển Lãnh đạo Khoa (FACULTY_ADMIN) — Quản lý tổng quan tiến độ, phê duyệt đề tài và giám sát định mức phân bổ hướng dẫn theo đợt.</p></div><div class="flex flex-col sm:flex-row lg:flex-col gap-space-sm shrink-0"><button class="flex items-center justify-center gap-space-xs px-space-md py-space-sm rounded-xl bg-surface-container-lowest text-primary font-body-bold text-body-sm hover:bg-surface-container transition-all active:scale-[0.98] shadow-sm" type="button"><span class="material-symbols-outlined text-[20px] text-primary">task_alt</span><span class="">Phê duyệt đề tài (12 chờ)</span></button><div class="flex items-center gap-space-sm"><button class="flex-1 flex items-center justify-center gap-space-xs px-space-sm py-space-sm rounded-xl bg-on-primary/15 text-on-primary hover:bg-on-primary/25 font-body-sm-medium text-body-sm transition-all backdrop-blur-sm" type="button"><span class="material-symbols-outlined text-[18px]">picture_as_pdf</span><span class="">Xuất báo cáo</span></button></div></div></div></section>
<!-- Hàng chỉ số KPI thống kê khoa -->
<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
<!-- Card 1: Sinh viên -->
<div class="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Tổng sinh viên</span>
<div class="flex items-baseline gap-space-xs mt-1">
<span class="font-stat-lg text-stat-lg text-on-surface">342</span>
<span class="font-body-sm text-body-sm text-secondary">sinh viên</span>
</div>
</div>
<div class="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span class="material-symbols-outlined text-[22px]">groups</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm">
<div class="flex items-center gap-1.5 text-primary">
<span class="material-symbols-outlined text-[16px]">school</span>
<span class="font-body-sm-medium">100% chỉ tiêu K65</span>
</div>
<span class="text-caption-xs font-caption-xs text-secondary">Khóa tốt nghiệp K65</span>
</div></div>
<!-- Card 2: Đề tài đăng ký -->
<div class="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Số SV được duyệt chính thức</span>
<div class="flex items-baseline gap-space-xs mt-1">
<span class="font-stat-lg text-stat-lg text-primary">318</span>
<span class="font-body-sm text-body-sm text-secondary">sinh viên</span>
</div>
</div>
<div class="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[22px]">verified</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm">
<div class="flex items-center gap-1.5 text-primary">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span class="font-body-sm-medium">93.0% đã có GVHD &amp; đề tài hợp lệ</span>
</div>
</div></div>
<!-- Card 3: GVHD -->
<div class="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">SV chưa có GVHD / chờ duyệt</span>
<div class="flex items-baseline gap-space-xs mt-1">
<span class="font-stat-lg text-stat-lg text-amber-700">24</span>
<span class="font-body-sm text-body-sm text-secondary">sinh viên</span>
</div>
</div>
<div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
<span class="material-symbols-outlined text-[22px]">pending_actions</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between font-caption-xs text-caption-xs">
<span class="px-space-xs py-0.5 rounded-md bg-amber-100 text-amber-800 font-body-sm-medium">
16 chờ duyệt đề tài
</span>
<span class="px-space-xs py-0.5 rounded-md bg-error-container text-on-error-container font-body-bold">
8 chưa gán GV
</span>
</div></div>
<!-- Card 4: Hội đồng dự kiến -->
<div class="flex flex-col justify-between p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Số giảng viên hướng dẫn</span>
<div class="flex items-baseline gap-space-xs mt-1">
<span class="font-stat-lg text-stat-lg text-on-surface">48</span>
<span class="font-body-sm text-body-sm text-secondary">cán bộ GV</span>
</div>
</div>
<div class="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined text-[22px]">badge</span>
</div>
</div>
<div class="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm">
<span class="text-on-surface-variant">Định mức bình quân:</span>
<span class="font-body-bold text-primary">6 SV/GV</span>
</div></div>
</section>
<!-- Lưới 2 cột: Phân bổ lĩnh vực & Đề tài chờ duyệt gấp -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
<!-- Cột trái: Phân bổ theo Lĩnh vực đề tài (Bao gồm đặc thù Mỏ - Địa chất) (5 cols) -->
<section class="lg:col-span-5 flex flex-col gap-space-md p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm"><div class="flex items-start justify-between"><div><span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Danh mục Cấp Khoa (CRUD)</span><h2 class="font-title-sm text-title-sm text-on-surface mt-0.5">Phân bổ 6 Lĩnh vực Đề tài Chuẩn</h2></div><button class="px-space-sm py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-body-sm-medium text-caption-xs flex items-center gap-1 transition-colors" type="button"><span class="material-symbols-outlined text-[16px]">edit_note</span>Quản lý</button></div><div class="p-space-sm rounded-xl bg-surface-container-low/60 flex items-center justify-between text-body-sm"><span class="font-body-sm-medium text-secondary">Tổng đề tài trong đợt:</span><span class="font-body-bold text-primary text-body-base">186 đề tài</span></div><div class="flex flex-col gap-space-sm mt-0.5"><div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><div class="flex items-center justify-between text-body-sm"><div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-primary shrink-0"></span><span class="font-body-sm-medium text-on-surface">Phát triển PM doanh nghiệp</span></div><span class="font-body-bold text-primary text-caption-xs">52 đề tài (28.0%)</span></div><div class="w-full h-1.5 bg-surface-container rounded-full"><div class="h-1.5 rounded-full bg-primary" style="width: 28%"></div></div></div><div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><div class="flex items-center justify-between text-body-sm"><div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-tertiary shrink-0"></span><span class="font-body-sm-medium text-on-surface">Phát triển PM chuyên ngành</span></div><span class="font-body-bold text-tertiary text-caption-xs">40 đề tài (21.5%)</span></div><div class="w-full h-1.5 bg-surface-container rounded-full"><div class="h-1.5 rounded-full bg-tertiary" style="width: 21.5%"></div></div></div><div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><div class="flex items-center justify-between text-body-sm"><div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-primary-container shrink-0"></span><span class="font-body-sm-medium text-on-surface">Trí tuệ nhân tạo và học máy</span></div><span class="font-body-bold text-primary-container text-caption-xs">38 đề tài (20.4%)</span></div><div class="w-full h-1.5 bg-surface-container rounded-full"><div class="h-1.5 rounded-full bg-primary-container" style="width: 20.4%"></div></div></div><div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><div class="flex items-center justify-between text-body-sm"><div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0"></span><span class="font-body-sm-medium text-on-surface">Dữ liệu lớn &amp; Phân tích dữ liệu</span></div><span class="font-body-bold text-amber-700 text-caption-xs">24 đề tài (12.9%)</span></div><div class="w-full h-1.5 bg-surface-container rounded-full"><div class="h-1.5 rounded-full bg-amber-500" style="width: 12.9%"></div></div></div><div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><div class="flex items-center justify-between text-body-sm"><div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-secondary shrink-0"></span><span class="font-body-sm-medium text-on-surface">An toàn TT &amp; QTrị hệ thống</span></div><span class="font-body-bold text-secondary text-caption-xs">20 đề tài (10.8%)</span></div><div class="w-full h-1.5 bg-surface-container rounded-full"><div class="h-1.5 rounded-full bg-secondary" style="width: 10.8%"></div></div></div><div class="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-1"><div class="flex items-center justify-between text-body-sm"><div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-sm bg-secondary-container shrink-0"></span><span class="font-body-sm-medium text-on-surface">Kiểm thử phần mềm</span></div><span class="font-body-bold text-on-secondary-container text-caption-xs">12 đề tài (6.4%)</span></div><div class="w-full h-1.5 bg-surface-container rounded-full"><div class="h-1.5 rounded-full bg-secondary-container" style="width: 6.4%"></div></div></div></div></section>
<!-- Cột phải: Danh sách đề tài trọng điểm cần Trưởng Khoa phê duyệt gấp (7 cols) -->
<section class="lg:col-span-7 flex flex-col gap-space-md p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm">
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
<div>
<div class="flex items-center gap-space-xs">
<span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Cần quyết định</span>
<span class="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-caption-xs text-caption-xs font-bold">12 hồ sơ</span>
</div>
<h2 class="font-title-sm text-title-sm text-on-surface mt-0.5">Đề tài giảng viên chờ phê duyệt</h2>
</div>
<a class="text-primary hover:text-primary-container font-body-sm-medium text-body-sm flex items-center gap-1" href="#">
<span class="">Xem tất cả 12 đề tài</span>
<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<!-- Danh sách card đề tài với micro-interaction buttons -->
<div class="flex flex-col gap-space-sm" id="urgent-thesis-list">
<!-- Đề tài 1 -->
<div class="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs hover:bg-surface-container transition-all">
<div class="flex items-start justify-between gap-space-sm">
<div class="flex flex-wrap items-center gap-space-xs">
<span class="px-space-xs py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-caption-xs text-caption-xs">GIS &amp; Địa chất</span>
<span class="font-caption-xs text-caption-xs text-secondary">Mã: ĐA-K65-084</span>
<span class="font-caption-xs text-caption-xs text-secondary">• 2 sinh viên</span>
</div>

</div>
<h3 class="font-body-bold text-body-base text-on-surface leading-snug">
            Nghiên cứu ứng dụng Deep Learning kết hợp ảnh vệ tinh viễn thám Sentinel-2 để dự báo nguy cơ sạt lở đất tại khu vực mỏ than Cẩm Phả
          </h3>
<div class="flex flex-wrap items-center justify-between gap-space-sm mt-1 pt-space-xs">
<div class="flex items-center gap-space-sm text-body-sm">
<span class="text-on-surface-variant"><strong class="font-body-sm-medium text-on-surface">SV:</strong> Hoàng Tuấn Minh, Lê Thu Hà</span>
<span class="text-secondary">•</span>
<span class="text-on-surface-variant"><strong class="font-body-sm-medium text-on-surface">GVHD:</strong> PGS. TS. Trần Xuân Thanh</span>
</div>
<div class="flex items-center gap-space-xs">
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface font-body-sm-medium text-caption-xs shadow-sm" type="button">
                Chi tiết
              </button>
<button class="px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-body-bold text-caption-xs shadow-sm transition-all" type="button">
                Phê duyệt
              </button>
</div>
</div>
</div>
<!-- Đề tài 2 -->
<div class="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs hover:bg-surface-container transition-all">
<div class="flex items-start justify-between gap-space-sm">
<div class="flex flex-wrap items-center gap-space-xs">
<span class="px-space-xs py-0.5 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-caption-xs text-caption-xs">AI &amp; Data Science</span>
<span class="font-caption-xs text-caption-xs text-secondary">Mã: ĐA-K65-112</span>
<span class="font-caption-xs text-caption-xs text-secondary">• 1 sinh viên</span>
</div>

</div>
<h3 class="font-body-bold text-body-base text-on-surface leading-snug">
            Xây dựng trợ lý ảo thông minh hỗ trợ tra cứu văn bản quy phạm kỹ thuật an toàn mỏ sử dụng mô hình Retrieval-Augmented Generation (RAG)
          </h3>
<div class="flex flex-wrap items-center justify-between gap-space-sm mt-1 pt-space-xs">
<div class="flex items-center gap-space-sm text-body-sm">
<span class="text-on-surface-variant"><strong class="font-body-sm-medium text-on-surface">SV:</strong> Nguyễn Đăng Khoa</span>
<span class="text-secondary">•</span>
<span class="text-on-surface-variant"><strong class="font-body-sm-medium text-on-surface">GVHD:</strong> TS. Vũ Duy Hưng</span>
</div>
<div class="flex items-center gap-space-xs">
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface font-body-sm-medium text-caption-xs shadow-sm" type="button">
                Chi tiết
              </button>
<button class="px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-body-bold text-caption-xs shadow-sm transition-all" type="button">
                Phê duyệt
              </button>
</div>
</div>
</div>
<!-- Đề tài 3 -->
<div class="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs hover:bg-surface-container transition-all">
<div class="flex items-start justify-between gap-space-sm">
<div class="flex flex-wrap items-center gap-space-xs">
<span class="px-space-xs py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-caption-xs text-caption-xs">Mạng &amp; ATTT</span>
<span class="font-caption-xs text-caption-xs text-secondary">Mã: ĐA-K65-037</span>
<span class="font-caption-xs text-caption-xs text-secondary">• 2 sinh viên</span>
</div>

</div>
<h3 class="font-body-bold text-body-base text-on-surface leading-snug">
            Thiết kế hệ thống giám sát cảnh báo nồng độ khí Metan (CH4) ngầm thời gian thực dựa trên kiến trúc LoRaWAN và giao thức bảo mật Zero-Trust
          </h3>
<div class="flex flex-wrap items-center justify-between gap-space-sm mt-1 pt-space-xs">
<div class="flex items-center gap-space-sm text-body-sm">
<span class="text-on-surface-variant"><strong class="font-body-sm-medium text-on-surface">SV:</strong> Phạm Việt Cường, Bùi Hồng Quân</span>
<span class="text-secondary">•</span>
<span class="text-on-surface-variant"><strong class="font-body-sm-medium text-on-surface">GVHD:</strong> ThS. Nguyễn Đức Toàn</span>
</div>
<div class="flex items-center gap-space-xs">
<button class="px-space-sm py-1.5 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface font-body-sm-medium text-caption-xs shadow-sm" type="button">
                Chi tiết
              </button>
<button class="px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-body-bold text-caption-xs shadow-sm transition-all" type="button">
                Phê duyệt
              </button>
</div>
</div>
</div>
</div>
</section>
</div>
<!-- Bảng Khu vực Giảng viên Hướng dẫn & Tải công việc theo Bộ môn -->
<section class="flex flex-col gap-space-md p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm"><div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md"><div><div class="flex items-center gap-2"><span class="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Dữ liệu định mức Cấp Khoa</span></div><h2 class="font-title-sm text-title-sm text-on-surface mt-0.5">Thống kê Định mức &amp; Slot Hướng dẫn Giảng viên</h2></div><div class="flex flex-wrap items-center gap-space-xs"><div class="flex items-center gap-1 bg-surface-container-low px-space-sm py-1.5 rounded-xl text-caption-xs text-on-surface-variant font-medium"><span class="material-symbols-outlined text-[16px] text-secondary">domain</span><select class="bg-transparent text-on-surface font-body-sm-medium text-caption-xs border-0 outline-none cursor-pointer pr-1"><option>Tất cả bộ môn</option><option>Công nghệ phần mềm</option><option>Tin học Trắc địa &amp; Địa chất</option><option>Khoa học máy tính</option><option>Mạng MT &amp; ATTT</option></select></div><div class="flex items-center gap-1 bg-surface-container-low px-space-sm py-1.5 rounded-xl text-caption-xs text-on-surface-variant font-medium"><span class="material-symbols-outlined text-[16px] text-secondary">school</span><select class="bg-transparent text-on-surface font-body-sm-medium text-caption-xs border-0 outline-none cursor-pointer pr-1"><option>Tất cả học vị</option><option>PGS. TS</option><option>Tiến sĩ (TS)</option><option>Thạc sĩ (ThS)</option></select></div><button class="px-space-md py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm-medium text-caption-xs transition-colors flex items-center gap-1.5 shadow-sm" type="button"><span class="material-symbols-outlined text-[16px]">file_download</span><span class="">Xuất danh sách GV</span></button></div></div><div class="overflow-x-auto"><table class="w-full text-left font-body-sm text-body-sm"><thead><tr class="bg-surface-container-low text-secondary font-caption-xs text-caption-xs uppercase tracking-wider"><th class="py-space-sm px-space-md rounded-l-xl">Tên GV &amp; Học vị</th><th class="py-space-sm px-space-sm">Bộ môn trực thuộc</th><th class="py-space-sm px-space-sm text-center">SV / Định mức đợt</th><th class="py-space-sm px-space-sm text-center">Slot còn trống</th><th class="py-space-sm px-space-sm text-center">Yêu cầu chờ duyệt</th><th class="py-space-sm px-space-md text-right rounded-r-xl">Thao tác</th></tr></thead><tbody class="divide-y-0"><tr class="hover:bg-surface-container-low/70 transition-colors"><td class="py-space-md px-space-md"><div class="flex items-center gap-space-sm"><div class="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-body-sm shrink-0">TT</div><div><div class="flex items-center gap-1.5"><span class="font-body-bold text-on-surface">PGS. TS. Trần Xuân Thanh</span><span class="px-1.5 py-0.2 rounded bg-primary-fixed/40 text-primary font-caption-xs text-[10px] font-semibold">PGS. TS</span></div><div class="font-caption-xs text-caption-xs text-secondary">Mã GV: GV0142 • txthanh@humg.edu.vn</div></div></div></td><td class="py-space-md px-space-sm"><span class="px-space-xs py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-caption-xs text-caption-xs">Tin học Trắc địa - Mỏ</span></td><td class="py-space-md px-space-sm text-center"><span class="font-body-bold text-tertiary">8/8 SV</span><span class="text-[11px] text-secondary block">100% định mức</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-caption-xs text-[11px] font-semibold">0 slot</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-caption-xs text-[11px]">0 chờ</span></td><td class="py-space-md px-space-md text-right"><div class="flex items-center justify-end gap-1.5"><button class="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-caption-xs text-caption-xs font-medium transition-colors" type="button">Chi tiết</button></div></td></tr><tr class="hover:bg-surface-container-low/70 transition-colors"><td class="py-space-md px-space-md"><div class="flex items-center gap-space-sm"><div class="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold text-body-sm shrink-0">VT</div><div><div class="flex items-center gap-1.5"><span class="font-body-bold text-on-surface">TS. Đặng Vũ Tùng</span><span class="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-caption-xs text-[10px] font-semibold">Tiến sĩ</span></div><div class="font-caption-xs text-caption-xs text-secondary">Mã GV: GV0089 • dvtung@humg.edu.vn</div></div></div></td><td class="py-space-md px-space-sm"><span class="px-space-xs py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-caption-xs text-caption-xs">Công nghệ Phần mềm</span></td><td class="py-space-md px-space-sm text-center"><span class="font-body-bold text-primary">7/8 SV</span><span class="text-[11px] text-secondary block">87.5% định mức</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-caption-xs text-[11px] font-bold">1 slot còn trống</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-caption-xs text-[11px] font-bold">1 yêu cầu chờ</span></td><td class="py-space-md px-space-md text-right"><div class="flex items-center justify-end gap-1.5"><button class="px-2 py-1 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-caption-xs text-caption-xs font-semibold transition-colors" type="button">Phê duyệt</button><button class="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-caption-xs text-caption-xs font-medium transition-colors" type="button">Chi tiết</button></div></td></tr><tr class="hover:bg-surface-container-low/70 transition-colors"><td class="py-space-md px-space-md"><div class="flex items-center gap-space-sm"><div class="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary-container font-bold text-body-sm shrink-0">DH</div><div><div class="flex items-center gap-1.5"><span class="font-body-bold text-on-surface">TS. Vũ Duy Hưng</span><span class="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-caption-xs text-[10px] font-semibold">Tiến sĩ</span></div><div class="font-caption-xs text-caption-xs text-secondary">Mã GV: GV0156 • vdhung@humg.edu.vn</div></div></div></td><td class="py-space-md px-space-sm"><span class="px-space-xs py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-caption-xs text-caption-xs">Khoa học Máy tính</span></td><td class="py-space-md px-space-sm text-center"><span class="font-body-bold text-amber-700">5/8 SV</span><span class="text-[11px] text-secondary block">62.5% định mức</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-caption-xs text-[11px] font-bold">3 slot còn trống</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-caption-xs text-[11px] font-bold">2 yêu cầu chờ</span></td><td class="py-space-md px-space-md text-right"><div class="flex items-center justify-end gap-1.5"><button class="px-2 py-1 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-caption-xs text-caption-xs font-semibold transition-colors" type="button">Phê duyệt</button><button class="px-2 py-1 rounded-lg bg-surface-container-lowest text-secondary hover:text-primary font-caption-xs text-caption-xs font-medium border border-surface-container-high transition-colors" type="button">Điều chuyển</button></div></td></tr><tr class="hover:bg-surface-container-low/70 transition-colors"><td class="py-space-md px-space-md"><div class="flex items-center gap-space-sm"><div class="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-secondary font-bold text-body-sm shrink-0">NT</div><div><div class="flex items-center gap-1.5"><span class="font-body-bold text-on-surface">ThS. Nguyễn Đức Toàn</span><span class="px-1.5 py-0.2 rounded bg-surface-container-high text-secondary font-caption-xs text-[10px] font-semibold">Thạc sĩ</span></div><div class="font-caption-xs text-caption-xs text-secondary">Mã GV: GV0208 • ndtoan@humg.edu.vn</div></div></div></td><td class="py-space-md px-space-sm"><span class="px-space-xs py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-caption-xs text-caption-xs">Mạng MT &amp; An toàn TT</span></td><td class="py-space-md px-space-sm text-center"><span class="font-body-bold text-primary">6/6 SV</span><span class="text-[11px] text-secondary block">100% (Định mức ThS)</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-caption-xs text-[11px] font-semibold">0 slot</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-caption-xs text-[11px] font-bold">1 yêu cầu chờ</span></td><td class="py-space-md px-space-md text-right"><div class="flex items-center justify-end gap-1.5"><button class="px-2 py-1 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-caption-xs text-caption-xs font-semibold transition-colors" type="button">Phê duyệt</button><button class="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-caption-xs text-caption-xs font-medium transition-colors" type="button">Chi tiết</button></div></td></tr><tr class="hover:bg-surface-container-low/70 transition-colors"><td class="py-space-md px-space-md"><div class="flex items-center gap-space-sm"><div class="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold text-body-sm shrink-0">TB</div><div><div class="flex items-center gap-1.5"><span class="font-body-bold text-on-surface">PGS. TS. Nguyễn Thái Bình</span><span class="px-1.5 py-0.2 rounded bg-primary-fixed/40 text-primary font-caption-xs text-[10px] font-semibold">PGS. TS</span></div><div class="font-caption-xs text-caption-xs text-secondary">Mã GV: GV0031 • ntbinh@humg.edu.vn</div></div></div></td><td class="py-space-md px-space-sm"><span class="px-space-xs py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-caption-xs text-caption-xs">Mạng MT &amp; An toàn TT</span></td><td class="py-space-md px-space-sm text-center"><span class="font-body-bold text-tertiary">8/8 SV</span><span class="text-[11px] text-secondary block">100% định mức</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-caption-xs text-[11px] font-semibold">0 slot</span></td><td class="py-space-md px-space-sm text-center"><span class="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-caption-xs text-[11px]">0 chờ</span></td><td class="py-space-md px-space-md text-right"><div class="flex items-center justify-end gap-1.5"><button class="px-2 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-caption-xs text-caption-xs font-medium transition-colors" type="button">Chi tiết</button></div></td></tr></tbody></table></div><div class="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs font-caption-xs text-caption-xs text-secondary border-t border-surface-container-high"><span class="">Hiển thị 5 / 48 giảng viên hướng dẫn trong Đợt 2</span><div class="flex items-center gap-1"><button class="px-2 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors" type="button">Trước</button><span class="px-2 py-1 rounded-md bg-primary text-on-primary font-bold">1</span><button class="px-2 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors" type="button">2</button><button class="px-2 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors" type="button">3</button><button class="px-2 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors" type="button">Tiếp</button></div></div></section>
<!-- Thanh thông tin nhanh chân trang: Hỗ trợ sinh viên & Trợ lý học vụ khoa -->
<footer class="w-full flex flex-col sm:flex-row items-center justify-between p-space-md bg-surface-container-low border-t border-surface-container-high rounded-2xl text-caption-xs text-secondary gap-space-sm"><div class="flex items-center gap-space-sm"><span class="material-symbols-outlined text-[20px] text-primary">info</span><span class="text-body-sm-medium text-on-surface-variant text-[12px]">Hệ thống Đồ án Tốt nghiệp CNTT v3.4 • Khoa CNTT - Tầng 7 Nhà C12 Đại học Mỏ - Địa chất, 18 Phố Viên, Đức Thắng, Bắc Từ Liêm, Hà Nội.</span></div><div class="flex items-center gap-space-md shrink-0"><span class="font-medium text-primary text-[12px]">Hotline Trợ lý đào tạo: (024) 3838 7568</span></div></footer>
</div></main></div>



`
}
