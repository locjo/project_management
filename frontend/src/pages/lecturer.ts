import { renderHeader } from '../components/header'
import { renderSidebar } from '../components/sidebar'
import { portalLayouts } from '../lib/portal-layouts'

/** Render the lecturer page using the supplied HUMG design. */
export default function renderPage(): string {
  const layout = portalLayouts.lecturer
  return `${renderSidebar(layout.sidebar)}<div class="pl-72 flex flex-col min-h-screen">${renderHeader(layout.header)}<main class="w-full flex-1 pt-16 bg-surface px-space-lg py-space-lg"><div class="flex flex-col w-full gap-space-lg">
<!-- 1. Banner Chào & Thông tin đợt làm đồ án -->
<section class="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-container to-primary text-on-primary shadow-md p-space-lg">
<!-- Ambient academic graph lines -->
<div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-on-primary/5 pointer-events-none blur-2xl"></div>
<div class="absolute right-32 -bottom-20 w-60 h-60 rounded-full bg-primary-fixed/10 pointer-events-none blur-3xl"></div>
<div class="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
<div class="flex flex-col gap-2 max-w-3xl">
<div class="flex flex-wrap items-center gap-2">
<span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-label-caps text-label-caps bg-on-primary/15 text-on-primary backdrop-blur-sm tracking-wider">
<span class="material-symbols-outlined text-[14px]">account_balance</span>
            KHOA CÔNG NGHỆ THÔNG TIN • HUMG
          </span>
<span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-label-caps text-label-caps bg-primary-fixed text-on-primary-fixed font-semibold tracking-normal">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Period Context: Đợt 2 - HK II (2024 - 2025) [Đang mở]
          </span>
</div>
<h1 class="font-display-lg text-display-lg text-on-primary tracking-tight mt-1">
          Xin chào, TS. Đặng Vũ Tùng
        </h1>
<p class="font-body-base text-body-base text-on-primary-container leading-relaxed">
          Cổng Giảng viên Hướng dẫn (LECTURER) — Quản lý hạn ngạch hướng dẫn, phê duyệt sinh viên đăng ký và theo dõi tiến độ đề tài ĐATN Khoa Công nghệ Thông tin.
        </p>
</div>
<!-- Action Buttons -->
<div class="flex flex-wrap sm:flex-nowrap items-center gap-space-sm self-start xl:self-center shrink-0">
<button class="h-12 px-5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface hover:text-primary-container font-body-bold text-body-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2" type="button">
<span class="material-symbols-outlined text-[20px]">how_to_reg</span>
<span class="">Duyệt nhanh SV (2 hồ sơ)</span>
</button>
<button class="h-12 px-4 rounded-xl bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-body-sm-medium text-body-sm-medium backdrop-blur-md transition-all active:scale-[0.98] flex items-center justify-center gap-2" type="button">
<span class="material-symbols-outlined text-[20px]">file_download</span>
<span class="">Xuất DS HD (Excel)</span>
</button>
</div>
</div>
</section>
<!-- 2. Hàng 4 Thẻ KPI Chỉ số Hướng dẫn -->
<section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
<!-- Card 1 -->
<div class="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between gap-3">
<div class="flex items-center justify-between">
<span class="font-label-caps text-label-caps text-secondary uppercase font-semibold">Chỉ tiêu định mức</span>
<div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
<span class="material-symbols-outlined text-[18px]">verified</span>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-stat-lg text-stat-lg text-on-surface">8</span>
<span class="font-body-sm-medium text-body-sm-medium text-secondary">sinh viên</span>
</div>

</div>
<!-- Card 2 -->
<div class="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between gap-3">
<div class="flex items-center justify-between">
<span class="font-label-caps text-label-caps text-secondary uppercase font-semibold">Đã nhận chính thức</span>
<div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-stat-lg text-stat-lg text-primary">5</span>
<span class="font-body-sm-medium text-body-sm-medium text-secondary">/ 8 SV (62.5%)</span>
</div>
<div class="flex items-center justify-between pt-1">
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption-xs text-caption-xs bg-emerald-50 text-emerald-700 font-medium">
<span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Đã chốt DS đợt 2
        </span>
<span class="font-caption-xs text-caption-xs text-secondary">5 đề tài</span>
</div>
</div>
<!-- Card 3 -->
<div class="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between gap-3">
<div class="flex items-center justify-between">
<span class="font-label-caps text-label-caps text-secondary uppercase font-semibold">Chờ GVHD phê duyệt</span>
<div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">pending_actions</span>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-stat-lg text-stat-lg text-amber-600">2</span>
<span class="font-body-sm-medium text-body-sm-medium text-secondary">hồ sơ mới</span>
</div>
<div class="flex items-center justify-between pt-1">
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption-xs text-caption-xs bg-amber-50 text-amber-700 font-medium">
<span class="material-symbols-outlined text-[13px]">alarm</span>
          Cần phản hồi trong 48h
        </span>
<span class="font-caption-xs text-caption-xs text-amber-700 font-semibold">Hạn 19/05</span>
</div>
</div>
<!-- Card 4 -->
<div class="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between gap-3">
<div class="flex items-center justify-between">
<span class="font-label-caps text-label-caps text-secondary uppercase font-semibold">Slot còn trống khả dụng</span>
<div class="w-8 h-8 rounded-lg bg-primary-container/10 text-primary flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">person_add</span>
</div>
</div>
<div class="flex items-baseline gap-2">
<span class="font-stat-lg text-stat-lg text-primary-container">1</span>
<span class="font-body-sm-medium text-body-sm-medium text-secondary">vị trí còn lại</span>
</div>
<div class="flex items-center justify-between pt-1">
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption-xs text-caption-xs bg-secondary-container text-on-secondary-container font-medium">
<span class="material-symbols-outlined text-[13px]">check_circle</span>
          Sẵn sàng nhận SV đủ ĐK
        </span>
</div>
</div>
</section>
<!-- 3. Khu vực Nội dung chính (2 Cột) -->
<section class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
<!-- CỘT TRÁI (5/12) -->
<div class="lg:col-span-5 flex flex-col gap-space-lg">
<!-- Khối 1: CƠ CẤU 6 LĨNH VỰC ĐỀ TÀI -->
<div class="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[22px]">category</span>
<h2 class="font-title-sm text-title-sm text-on-surface">Cơ cấu 6 Lĩnh vực Đề tài</h2>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium">5/8 SV</span>
</div>
<!-- Visual Mini Distribution Track -->
<div class="w-full bg-surface-container-low h-3 rounded-full overflow-hidden flex">
<div class="bg-primary h-full w-[40%]" title="Phát triển PM: 2 SV"></div>
<div class="bg-tertiary-container h-full w-[40%]" title="Trí tuệ nhân tạo: 2 SV"></div>
<div class="bg-secondary h-full w-[20%]" title="An toàn TT: 1 SV"></div>
</div>
<!-- Topic Category Breakdown -->
<div class="flex flex-col gap-3 pt-1">
<!-- Item 1 -->
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
<span class="font-body-sm-medium text-body-sm-medium text-on-surface">Phát triển PM doanh nghiệp</span>
</div>
<div class="flex items-center gap-2">
<span class="font-body-sm-medium text-body-sm-medium text-primary font-semibold">2 đề tài (2 SV)</span>
</div>
</div>
<!-- Item 2 -->
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-tertiary-container shrink-0"></span>
<span class="font-body-sm-medium text-body-sm-medium text-on-surface">Trí tuệ nhân tạo &amp; Học máy</span>
</div>
<div class="flex items-center gap-2">
<span class="font-body-sm-medium text-body-sm-medium text-primary font-semibold">2 đề tài (2 SV)</span>
</div>
</div>
<!-- Item 3 -->
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low transition-colors">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
<span class="font-body-sm-medium text-body-sm-medium text-on-surface">An toàn TT &amp; Quản trị HT</span>
</div>
<div class="flex items-center gap-2">
<span class="font-body-sm-medium text-body-sm-medium text-secondary font-semibold">1 đề tài (1 SV)</span>
</div>
</div>
<!-- Item 4 -->
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/30 opacity-75">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-outline shrink-0"></span>
<span class="font-body-sm text-body-sm text-secondary">Dữ liệu lớn &amp; Phân tích dữ liệu</span>
</div>
<span class="font-caption-xs text-caption-xs text-primary-container font-semibold bg-primary-fixed px-2 py-0.5 rounded-full">Còn slot</span>
</div>
<!-- Item 5 -->
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/30 opacity-60">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-outline-variant shrink-0"></span>
<span class="font-body-sm text-body-sm text-secondary">Phát triển PM Mỏ - Địa chất</span>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium">0 đề tài</span>
</div>
<!-- Item 6 -->
<div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low/30 opacity-60">
<div class="flex items-center gap-2.5">
<span class="w-2.5 h-2.5 rounded-full bg-outline-variant shrink-0"></span>
<span class="font-body-sm text-body-sm text-secondary">Kiểm thử phần mềm &amp; QA</span>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium">0 đề tài</span>
</div>
</div>
</div>
<!-- Khối 2: LỊCH TRÌNH & HẠN CHÓT ĐỢT 2 -->
<div class="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md"><div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[22px]">event_note</span>
<h2 class="font-title-sm text-title-sm text-on-surface">Lịch trình &amp; Mốc tiến độ Đợt 2</h2>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium px-2 py-0.5 rounded-full bg-surface-container-low">HK II 2024 - 2025</span>
</div>
<div class="flex flex-col gap-3">
<!-- Mốc 1: Đề xuất & Thẩm định Đề tài -->
<div class="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/60 border-l-2 border-emerald-500">
<div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[18px]">check_circle</span>
</div>
<div class="flex flex-col flex-1">
<div class="flex items-center justify-between">
<span class="font-body-bold text-body-bold text-on-surface leading-tight">1. Đề xuất &amp; Thẩm định đề tài</span>
<span class="font-caption-xs text-caption-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Đã hoàn thành</span>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium mt-0.5">01/05/2025 — 10/05/2025</span>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">GVHD đề xuất đề tài theo 6 lĩnh vực chuẩn &amp; Bộ môn thẩm định chuyên môn.</p>
</div>
</div>
<!-- Mốc 2: Sinh viên đăng ký & GVHD phê duyệt (Active) -->
<div class="flex items-start gap-3 p-3 rounded-xl bg-amber-50/70 border-l-2 border-amber-500 text-on-surface ring-1 ring-amber-200/60">
<div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[18px]">pending_actions</span>
</div>
<div class="flex flex-col flex-1">
<div class="flex items-center justify-between">
<span class="font-body-bold text-body-bold text-amber-900 leading-tight">2. SV đăng ký &amp; GVHD phê duyệt</span>
<span class="inline-flex items-center gap-1 font-caption-xs text-caption-xs font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>Còn 2 ngày</span>
</div>
<span class="font-caption-xs text-caption-xs text-amber-800/90 font-semibold mt-0.5">11/05/2025 — 19/05/2025 (23:59)</span>
<p class="font-body-sm text-body-sm text-amber-900/80 mt-1">Chốt nhận SV đủ định mức (tối đa 8 SV/GV), phản hồi và duyệt hồ sơ chờ xử lý.</p>
</div>
</div>
<!-- Mốc 3: Chốt DS & Bàn giao Bộ môn -->
<div class="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border-l-2 border-outline-variant/60">
<div class="w-8 h-8 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
</div>
<div class="flex flex-col flex-1">
<div class="flex items-center justify-between">
<span class="font-body-bold text-body-bold text-on-surface leading-tight">3. Chốt DS &amp; Bàn giao Bộ môn</span>
<span class="font-caption-xs text-caption-xs text-secondary bg-surface-container-high px-2 py-0.5 rounded-full font-medium">Sắp tới</span>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium mt-0.5">25/05/2025</span>
<p class="font-body-sm text-body-sm text-secondary mt-1">Gửi danh sách phân công chính thức và đề cương tổng quát lên Bộ môn ký biên bản.</p>
</div>
</div>
<!-- Mốc 4: Nộp đề cương chi tiết & Phê duyệt Khoa -->
<div class="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border-l-2 border-outline-variant/60">
<div class="w-8 h-8 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[18px]">verified</span>
</div>
<div class="flex flex-col flex-1">
<div class="flex items-center justify-between">
<span class="font-body-bold text-body-bold text-on-surface leading-tight">4. Nộp Đề cương &amp; Quyết định Khoa</span>
<span class="font-caption-xs text-caption-xs text-secondary bg-surface-container-high px-2 py-0.5 rounded-full font-medium">Sắp tới</span>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium mt-0.5">10/06/2025</span>
<p class="font-body-sm text-body-sm text-secondary mt-1">Nộp đề cương chi tiết hoàn chỉnh để Khoa CNTT ban hành quyết định giao nhiệm vụ ĐATN.</p>
</div>
</div>
</div></div>
</div>
<!-- CỘT PHẢI (7/12) -->
<div class="lg:col-span-7 flex flex-col gap-space-lg">
<!-- Khối Hồ sơ Sinh viên -->
<div class="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex flex-col gap-space-md">
<!-- Header & Nav Tabs -->
<div class="flex flex-col gap-space-sm pb-1">
<div class="flex flex-wrap items-center justify-between gap-2">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[24px]">folder_shared</span>
<h2 class="font-title-sm text-title-sm text-on-surface">Hồ sơ Sinh viên Đăng ký Hướng dẫn</h2>
</div>
<span class="font-caption-xs text-caption-xs text-secondary font-medium">Đợt 2 - HK2 2024-2025</span>
</div>
<!-- Tabs -->
<div class="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low self-start">
<button class="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-body-sm-medium text-body-sm-medium shadow-sm flex items-center gap-1.5" type="button">
<span class="">Chờ phê duyệt</span>
<span class="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-caption-xs text-caption-xs font-bold">2</span>
</button>
<button class="px-3 py-1.5 rounded-lg text-secondary hover:text-on-surface font-body-sm-medium text-body-sm-medium flex items-center gap-1.5 transition-colors" type="button">
<span class="">Đã nhận chính thức</span>
<span class="px-1.5 py-0.2 rounded-full bg-surface-container-high text-secondary font-caption-xs text-caption-xs">5</span>
</button>
<button class="px-3 py-1.5 rounded-lg text-secondary hover:text-on-surface font-body-sm-medium text-body-sm-medium flex items-center gap-1.5 transition-colors" type="button">
<span class="">Tất cả hồ sơ</span>
<span class="px-1.5 py-0.2 rounded-full bg-surface-container-high text-secondary font-caption-xs text-caption-xs">7</span>
</button>
</div>
</div>
<!-- Filter Bar -->
<div class="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-surface-container-low p-2 rounded-xl">
<div class="sm:col-span-7 relative flex items-center">
<span class="material-symbols-outlined absolute left-3 text-secondary text-[20px]">search</span>
<input class="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-secondary font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-none" placeholder="Tìm theo tên sinh viên, MSV..." type="text">
</div>
<div class="sm:col-span-5 relative">
<select class="w-full h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
<option value="">Tất cả lĩnh vực đề tài</option>
<option value="ai">Trí tuệ nhân tạo &amp; ML</option>
<option value="pm">Phát triển PM doanh nghiệp</option>
<option value="attt">An toàn thông tin</option>
<option value="dl">Dữ liệu lớn</option>
</select>
<span class="material-symbols-outlined absolute right-2.5 top-2.5 text-secondary pointer-events-none text-[20px]">expand_more</span>
</div>
</div>
<!-- SECTION: CHỜ PHÊ DUYỆT (2 Thẻ) -->
<div class="flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<span class="font-label-caps text-label-caps text-amber-800 uppercase font-bold flex items-center gap-1.5">
<span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Yêu cầu cần phản hồi (2 hồ sơ mới)
            </span>
<span class="font-caption-xs text-caption-xs text-secondary">Tự động chuyển tiếp nếu quá hạn</span>
</div>
<!-- Hồ sơ Chờ Duyệt 1 -->
<div class="rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low p-space-md flex flex-col gap-3 transition-colors">
<div class="flex flex-wrap items-start justify-between gap-2">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-sm text-title-sm font-bold">
                  NA
                </div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-body-bold text-body-bold text-on-surface">Nguyễn Văn An</span>

</div>
<span class="font-caption-xs text-caption-xs text-secondary">MSV: 2021060155 • Lớp: Tin học K65B</span>
</div>
</div>
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption-xs text-caption-xs bg-amber-100 text-amber-800 font-semibold">
<span class="material-symbols-outlined text-[13px]">schedule</span>
                Đăng ký: 14/05/2025
              </span>
</div>
<div class="p-3 rounded-lg bg-surface-container-lowest flex flex-col gap-1.5">
<div class="flex items-center gap-2">
<span class="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-caption-xs text-caption-xs font-semibold">Trí tuệ nhân tạo &amp; ML</span>
</div>
<p class="font-body-sm-medium text-body-sm-medium text-on-surface leading-snug">
                "Xây dựng hệ thống trợ lý ảo tra cứu văn bản quy phạm kỹ thuật an toàn mỏ bằng mô hình RAG"
              </p>
</div>
<div class="flex flex-wrap items-center justify-between gap-2 pt-1">

<div class="flex items-center gap-2">
<button class="h-9 px-3.5 rounded-lg bg-error-container/60 hover:bg-error-container text-on-error-container font-caption-xs text-caption-xs font-semibold transition-all active:scale-[0.98] flex items-center gap-1" type="button">
<span class="material-symbols-outlined text-[16px]">close</span>
<span class="">Từ chối</span>
</button>
<button class="h-9 px-4 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-caption-xs text-caption-xs font-semibold transition-all active:scale-[0.98] shadow-sm flex items-center gap-1" type="button">
<span class="material-symbols-outlined text-[16px]">check</span>
<span class="">Đồng ý tiếp nhận</span>
</button>
</div>
</div>
</div>
<!-- Hồ sơ Chờ Duyệt 2 -->
<div class="rounded-xl bg-surface-container-low/70 hover:bg-surface-container-low p-space-md flex flex-col gap-3 transition-colors">
<div class="flex flex-wrap items-start justify-between gap-2">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-title-sm text-title-sm font-bold">
                  LT
                </div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-body-bold text-body-bold text-on-surface">Lê Thị Thu Thảo</span>

</div>
<span class="font-caption-xs text-caption-xs text-secondary">MSV: 2021060214 • Lớp: KHMT K65A</span>
</div>
</div>
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-caption-xs text-caption-xs bg-amber-100 text-amber-800 font-semibold">
<span class="material-symbols-outlined text-[13px]">schedule</span>
                Đăng ký: 13/05/2025
              </span>
</div>
<div class="p-3 rounded-lg bg-surface-container-lowest flex flex-col gap-1.5">
<div class="flex items-center gap-2">
<span class="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-caption-xs text-caption-xs font-semibold">Phát triển PM doanh nghiệp</span>
</div>
<p class="font-body-sm-medium text-body-sm-medium text-on-surface leading-snug">
                "Hệ thống ERP quản lý thiết bị và bảo trì cơ điện trong doanh nghiệp khai thác khoáng sản"
              </p>
</div>
<div class="flex flex-wrap items-center justify-between gap-2 pt-1">

<div class="flex items-center gap-2">
<button class="h-9 px-3.5 rounded-lg bg-error-container/60 hover:bg-error-container text-on-error-container font-caption-xs text-caption-xs font-semibold transition-all active:scale-[0.98] flex items-center gap-1" type="button">
<span class="material-symbols-outlined text-[16px]">close</span>
<span class="">Từ chối</span>
</button>
<button class="h-9 px-4 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-caption-xs text-caption-xs font-semibold transition-all active:scale-[0.98] shadow-sm flex items-center gap-1" type="button">
<span class="material-symbols-outlined text-[16px]">check</span>
<span class="">Đồng ý tiếp nhận</span>
</button>
</div>
</div>
</div>
</div>
<!-- SECTION: ĐÃ NHẬN CHÍNH THỨC (Mẫu 2 SV tiêu biểu) -->
<div class="flex flex-col gap-space-sm pt-2">
<div class="flex items-center justify-between">
<span class="font-label-caps text-label-caps text-secondary uppercase font-bold">Sinh viên đã chốt chính thức (5 SV)</span>
<a class="font-caption-xs text-caption-xs text-primary hover:underline font-semibold flex items-center gap-0.5" href="#">
<span class="">Xem đầy đủ 5 SV</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</div>
<div class="flex flex-col gap-2">
<!-- Sinh viên đã nhận 1 -->
<div class="p-3 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-body-bold text-body-bold">
                  QM
                </div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-body-bold text-body-bold text-on-surface">Trần Quang Minh</span>
<span class="font-caption-xs text-caption-xs text-secondary">• 2021060412</span>
</div>
<span class="font-caption-xs text-caption-xs text-on-surface-variant truncate max-w-sm">
                    Đề tài: Nền tảng Microservices &amp; Spring Boot quản lý tài nguyên mỏ
                  </span>
</div>
</div>

</div>
<!-- Sinh viên đã nhận 2 -->
<div class="p-3 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-body-bold text-body-bold">
                  TM
                </div>
<div class="flex flex-col">
<div class="flex items-center gap-2">
<span class="font-body-bold text-body-bold text-on-surface">Hoàng Tuấn Minh</span>
<span class="font-caption-xs text-caption-xs text-secondary">• 2021060389</span>
</div>
<span class="font-caption-xs text-caption-xs text-on-surface-variant truncate max-w-sm">
                    Đề tài: Deep Learning ảnh vệ tinh Sentinel giám sát sạt lở bãi thải mỏ
                  </span>
</div>
</div>

</div>
</div>
</div>
</div>
</div>
</section>
</div></main><footer class="w-full bg-surface-container-low shadow-[0_-1px_4px_rgba(0,0,0,0.02)] px-space-lg py-space-md mt-auto"><div class="w-full flex flex-col md:flex-row items-center justify-between gap-space-sm text-secondary font-caption-xs text-caption-xs"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-primary">info</span><span class="">Hệ thống Đồ án Tốt nghiệp CNTT v3.4 • Khoa CNTT - Tầng 7 Nhà C12 Đại học Mỏ - Địa chất, 18 Phố Viên, Đức Thắng, Bắc Từ Liêm, Hà Nội.</span></div><div class="flex items-center gap-1 font-medium text-on-surface-variant"><span class="material-symbols-outlined text-[15px] text-primary">call</span><span class="">Hotline Trợ lý đào tạo: <span class="font-semibold text-primary">(024) 3838 7568</span></span></div></div></footer></div>

`
}
