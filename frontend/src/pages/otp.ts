/** Render the otp page using the supplied HUMG design. */
export default function renderPage(): string {
  return `<main class="w-full flex-1 flex flex-col items-center justify-center"><div class="flex flex-col w-full">
<div class="w-full flex justify-center items-center py-space-xl px-margin lg:px-margin-desktop relative overflow-hidden">
<div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed opacity-40 blur-3xl pointer-events-none"></div>
<div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary-container opacity-30 blur-3xl pointer-events-none"></div>
<div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch z-10">
<div class="lg:col-span-5 hidden lg:flex flex-col justify-between bg-surface-container rounded-xl p-space-xl shadow-sm relative overflow-hidden">
<div class="flex flex-col gap-space-md">
<div class="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-lowest text-primary shadow-sm w-fit">
<span class="material-symbols-outlined text-sm text-primary" style="font-variation-settings: 'FILL' 1;">verified_user</span>
<span class="font-label-caps text-label-caps tracking-wider uppercase">Cổng Học Thuật 2025</span>
</div>
<div class="mt-space-md">
<h2 class="font-display-lg text-display-lg text-on-surface tracking-tight">Hệ thống Quản lý Khóa luận &amp; Đề tài</h2>
<p class="font-body-base text-body-base text-on-surface-variant mt-space-sm">
              Xác thực bảo vệ tuyệt đối các quyền sở hữu trí tuệ, biên bản phản biện và phân công hội đồng bảo vệ luận văn.
            </p>
</div>
</div>
<div class="my-space-md relative rounded-lg overflow-hidden bg-surface-container-highest shadow-sm">
<div class="w-full h-44 bg-cover bg-center" data-alt="Modern academic university library and research hub with warm diffused light, sleek workstations, graduate students collaborating calmly, in a teal and cool slate corporate academic aesthetic" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDh1qErr7QdHAaxfyJwtvw8ZXsD4YvfEMqFtDp12p3so9mu0bDDl47km1m2AJ4xlMNCywnI-CZPGBEd8Q5i0-IIdlBshjey2tx7BRXX7AcHfxMdRJ-SlMP0-UjnZawTdJW8A7LJDPIfp9U_vTqsmXdrF39xxicanVKoN3V52FaG69Ob-Of01ilCdiwBsVfe2giHKfDpXZvAn5QtOW1XmeLnmFjYXmElY4gpKLOWY1Gh59RjULneZq6vuw')">
<div class="w-full h-full bg-gradient-to-t from-surface-container via-surface-container/40 to-transparent flex items-end p-space-md">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-primary text-xl">encrypted</span>
<span class="font-caption-xs text-caption-xs text-on-surface-variant font-medium">Bảo mật mã hóa đầu cuối 256-bit</span>
</div>
</div>
</div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-xs">
<div class="flex items-center justify-between">
<span class="font-label-caps text-label-caps text-on-surface-variant uppercase">Trạng thái hạ tầng</span>
<span class="inline-flex items-center gap-1 font-caption-xs text-caption-xs text-primary font-semibold">
<span class="w-2 h-2 rounded-full bg-primary-container inline-block"></span> Ổn định
            </span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Chứng thực liên trường VNU-ID &amp; CSDL đề tài đồng bộ trực tiếp.</p>
</div>
</div>
<div class="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg lg:p-space-xl shadow-md flex flex-col justify-between">
<div class="flex items-center justify-between pb-space-sm">
<a class="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors font-body-sm-medium text-body-sm-medium" href="#">
<span class="material-symbols-outlined text-lg">arrow_back</span>
<span class="">Quay lại đăng nhập</span>
</a>
<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-caption-xs text-caption-xs">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">shield</span>
<span class="">2FA Đang kích hoạt</span>
</div>
</div>
<div class="mt-space-md">
<div class="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm mb-space-sm">
<span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">security_update_good</span>
</div>
<h1 class="font-headline-md text-headline-md text-on-surface">Xác thực mã OTP</h1>
<p class="font-body-base text-body-base text-on-surface-variant mt-1">
            Mã xác minh gồm 6 chữ số đã được gửi tự động đến email của bạn.
          </p>
<div class="mt-space-sm inline-flex items-center gap-space-sm px-3 py-1.5 rounded-lg bg-surface-container-low"><span class="material-symbols-outlined text-sm text-primary">mail</span>
<span class="font-body-bold text-body-bold text-on-surface">admin.cntt***@humg.edu.vn</span>
<button class="inline-flex items-center gap-0.5 text-primary hover:text-on-primary-fixed-variant font-caption-xs text-caption-xs transition-colors ml-1" type="button">
<span class="material-symbols-outlined text-sm">edit</span>
<span class="">Thay đổi</span>
</button></div>
</div>
<form class="mt-space-lg flex flex-col gap-space-lg" id="otpForm">
<div>
<div class="flex items-center justify-between mb-space-xs">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase" for="otp-input-0">Mã xác thực 6 chữ số</label>
<span class="font-caption-xs text-caption-xs text-on-surface-variant">Hết hạn trong <strong class="text-primary font-body-bold text-body-sm" id="countdown">00:42</strong></span>
</div>
<div class="flex items-center justify-between gap-2 sm:gap-3 py-space-xs" id="otpContainer">
<input autofocus="" class="otp-digit w-12 h-14 sm:w-14 sm:h-16 text-center font-stat-lg text-stat-lg rounded-xl bg-surface-container-low text-on-surface shadow-sm transition-all focus:bg-surface-container-lowest focus:text-primary outline-none focus:shadow-md" id="otp-input-0" inputmode="numeric" maxlength="1" pattern="[0-9]*" type="text">
<input class="otp-digit w-12 h-14 sm:w-14 sm:h-16 text-center font-stat-lg text-stat-lg rounded-xl bg-surface-container-low text-on-surface shadow-sm transition-all focus:bg-surface-container-lowest focus:text-primary outline-none focus:shadow-md" inputmode="numeric" maxlength="1" pattern="[0-9]*" type="text">
<input class="otp-digit w-12 h-14 sm:w-14 sm:h-16 text-center font-stat-lg text-stat-lg rounded-xl bg-surface-container-low text-on-surface shadow-sm transition-all focus:bg-surface-container-lowest focus:text-primary outline-none focus:shadow-md" inputmode="numeric" maxlength="1" pattern="[0-9]*" type="text">
<span class="text-outline font-title-sm text-title-sm select-none">•</span>
<input class="otp-digit w-12 h-14 sm:w-14 sm:h-16 text-center font-stat-lg text-stat-lg rounded-xl bg-surface-container-low text-on-surface shadow-sm transition-all focus:bg-surface-container-lowest focus:text-primary outline-none focus:shadow-md" inputmode="numeric" maxlength="1" pattern="[0-9]*" type="text">
<input class="otp-digit w-12 h-14 sm:w-14 sm:h-16 text-center font-stat-lg text-stat-lg rounded-xl bg-surface-container-low text-on-surface shadow-sm transition-all focus:bg-surface-container-lowest focus:text-primary outline-none focus:shadow-md" inputmode="numeric" maxlength="1" pattern="[0-9]*" type="text">
<input class="otp-digit w-12 h-14 sm:w-14 sm:h-16 text-center font-stat-lg text-stat-lg rounded-xl bg-surface-container-low text-on-surface shadow-sm transition-all focus:bg-surface-container-lowest focus:text-primary outline-none focus:shadow-md" inputmode="numeric" maxlength="1" pattern="[0-9]*" type="text">
</div>
<div class="flex items-center justify-between mt-space-sm pt-space-xs">
<span class="font-body-sm text-body-sm text-on-surface-variant">Không nhận được mã?</span>
<button class="font-body-sm-medium text-body-sm-medium text-outline transition-colors inline-flex items-center gap-1 cursor-not-allowed" id="resendBtn" type="button" disabled="">
<span class="material-symbols-outlined text-sm">refresh</span>
<span class="">Gửi lại mã ngay</span>
</button>
</div>
</div>
<div class="flex flex-col gap-space-sm">
<button class="w-full h-12 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-body-bold text-body-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-space-sm" id="submitBtn" type="submit">
<span class="">Xác thực &amp; Đăng nhập</span>
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-xs">


</div>
</div>
</form>
<div class="mt-space-lg pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-xs bg-surface-container-low p-space-sm rounded-lg text-center sm:text-left">
<div class="inline-flex items-center gap-1.5 text-on-surface-variant font-caption-xs text-caption-xs">
<span class="material-symbols-outlined text-sm text-primary" style="font-variation-settings: 'FILL' 1;">lock</span>
<span class="">Bảo mật 2 lớp SSL 256-bit</span>
</div>
<span class="text-on-surface-variant font-caption-xs text-caption-xs">Mã OTP có hiệu lực trong 5 phút</span>
</div>
</div>
</div>
</div>

</div></main><footer class="w-full bg-surface-container-low py-4"><div class="max-w-5xl mx-auto px-margin lg:px-margin-desktop flex flex-col sm:flex-row items-center justify-between gap-space-sm"><span class="font-caption-xs text-caption-xs text-on-surface-variant">© 2025 Thesis Management Portal. All rights reserved.</span><div class="flex items-center gap-space-md"><a class="font-caption-xs text-caption-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#">Help Center</a><a class="font-caption-xs text-caption-xs text-on-surface-variant hover:text-on-surface transition-colors" href="#">Security &amp; Privacy</a><div class="flex items-center gap-space-xs font-caption-xs text-caption-xs text-on-surface-variant"><span class="material-symbols-outlined text-[14px]">language</span><span class="">English (US)</span></div></div></div></footer>

`
}
