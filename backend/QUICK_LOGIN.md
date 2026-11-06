# Đăng nhập nhanh

Trang đăng nhập có 4 nút cho Sinh viên, Giảng viên, Trưởng bộ môn, Lãnh đạo khoa.
Nhấn nút gọi `POST /api/auth/quick-login` với `{ "role": "STUDENT" }` (hoặc role tương ứng).
Backend chọn tài khoản đang hoạt động có ID nhỏ nhất của role đó và cấp JWT/refresh cookie.
Không tạo, gửi hay xác thực OTP. Không tạo tài khoản mới hoặc sửa quyền tài khoản.
Database cần có tài khoản tương ứng và hồ sơ sinh viên/giảng viên để dùng nghiệp vụ.
PostgreSQL và Redis vẫn cần chạy (Redis phục vụ giới hạn request xác thực).

Khởi động lại backend và tải lại frontend để dùng. Không cần bật profile riêng.
Cấu hình `app.auth.quick-login-enabled` đang bật cho môi trường phát triển này.
Khi triển khai, đặt biến môi trường `QUICK_LOGIN_ENABLED=false` để chặn đăng nhập nhanh.
