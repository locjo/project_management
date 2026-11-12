# Đăng nhập nhanh

Trang đăng nhập có 4 nút cho Sinh viên, Giảng viên, Trưởng bộ môn, Lãnh đạo khoa.
Nhấn nút gọi `POST /api/auth/quick-login` với `{ "role": "STUDENT" }` (hoặc role tương ứng).
Backend chọn tài khoản đang hoạt động có ID nhỏ nhất của role đó và cấp JWT/refresh cookie.
Không tạo, gửi hay xác thực OTP. Không tạo tài khoản mới hoặc sửa quyền tài khoản.
Database cần có tài khoản tương ứng và hồ sơ sinh viên/giảng viên để dùng nghiệp vụ.
PostgreSQL và Redis vẫn cần chạy (Redis phục vụ giới hạn request xác thực).

Khởi động lại backend và tải lại frontend để dùng. Không cần bật profile riêng.
Cấu hình `app.auth.quick-login-enabled` mặc định là `false`; đặt
`QUICK_LOGIN_ENABLED=true` để bật API đăng nhập nhanh.
Khi triển khai bản demo, đặt `QUICK_LOGIN_ENABLED=true` trên Render và
`VITE_ENABLE_QUICK_LOGIN=true` trên Vercel, sau đó redeploy cả hai dịch vụ.
Nếu đây là hệ thống có dữ liệu thật, đặt hai biến trên thành `false` vì bất kỳ
người truy cập nào cũng có thể đăng nhập vào cả bốn vai trò khi tính năng được bật.
