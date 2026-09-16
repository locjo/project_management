import { renderLogo } from '../components/logo'

export function renderLogin(): string {
  return `<main class="login-page"><section class="api-card login-card">
    ${renderLogo()}
    <h1 class="text-2xl font-bold mt-6">Đăng nhập hệ thống</h1>
    <p class="text-secondary mt-2">Sử dụng email tài khoản tại trường để nhận mã xác thực.</p>
    <form id="email-form" class="api-form mt-6">
      <label>Email<input type="email" name="email" autocomplete="email" placeholder="ten@humg.edu.vn" required></label>
      <button type="submit" class="api-button">Gửi mã OTP</button>
    </form>
    <form id="verify-form" class="api-form mt-6" hidden>
      <p>Mã xác thực được gửi đến <strong id="otp-email"></strong>.</p>
      <label>Mã OTP gồm 6 chữ số<input name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label>
      <p class="text-secondary text-sm" id="otp-expiry" aria-live="polite"></p>
      <button type="submit" class="api-button">Xác thực &amp; đăng nhập</button>
      <div class="flex gap-3"><button type="button" id="resend-otp" class="api-button secondary">Gửi lại mã</button><button type="button" id="change-email" class="api-button secondary">Thay đổi email</button></div>
    </form>
    <p id="login-error" role="alert" class="text-error mt-4"></p>
  </section></main>`
}
