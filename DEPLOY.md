# Deploy backend Render và frontend Vercel

## 1. Chuẩn bị database, Redis và email

Tạo PostgreSQL và Redis/Render Key Value, ghi lại host, port và thông tin đăng nhập.
Backend dùng Redis cho OTP và giới hạn yêu cầu, nên cần Redis hoạt động.

Ứng dụng hiện gửi OTP qua Gmail SMTP cổng 587. Render Free chặn outbound SMTP
cổng 25, 465, 587. Muốn sử dụng đăng nhập OTP, cần chuyển code gửi email sang
API HTTPS của nhà cung cấp email hoặc dùng dịch vụ Render trả phí hỗ trợ cổng 587.
Không bật quick login trên bản deploy công khai.

## 2. Backend trên Render

- Push mã nguồn lên repository của bạn.
- Tạo Web Service từ repository, chọn runtime **Docker**.
- Root Directory: `backend`.
- Dockerfile Path: `./Dockerfile` (tính từ Root Directory).
- Khai báo các biến trong Environment:

| Biến | Giá trị cần điền |
| --- | --- |
| `DB_URL` | `jdbc:postgresql://HOST:5432/DATABASE` |
| `DB_USERNAME` | Username của PostgreSQL |
| `DB_PASSWORD` | Password của PostgreSQL |
| `REDIS_URL` | URL kết nối Redis; dùng `rediss://` nếu dịch vụ yêu cầu TLS |
| `MAIL_USERNAME` | Địa chỉ Gmail gửi OTP |
| `MAIL_PASSWORD` | Mật khẩu ứng dụng Gmail |
| `JWT_SECRET` | Khóa ngẫu nhiên riêng cho production, tối thiểu 32 byte |
| `QUICK_LOGIN_ENABLED` | `false` |

Không dán nguyên URL dạng `postgresql://user:password@host/database` vào `DB_URL`.
Tách username/password sang hai biến tương ứng và dùng URL JDBC như bảng trên.
Nếu nhà cung cấp yêu cầu SSL, thêm `?sslmode=require` vào URL JDBC.

`server.port` đã đọc `${PORT:8080}`, phù hợp với cổng Render cấp.
File `application-local.properties` không được commit hoặc đưa vào Docker image.
Các biến môi trường trên Render thay thế cấu hình local.

Deploy backend, kiểm tra log khởi động thành công, rồi sao chép URL HTTPS Render cấp.
Truy cập `/` có thể bị từ chối do Spring Security; điều này không tự chứng minh backend bị lỗi.

## 3. Frontend trên Vercel

1. Import repository trên Vercel, Root Directory: `frontend`, Framework: **Vite**.
2. Build Command: `npm run build`; Output Directory: `dist`.
3. Cấu hình mặc định đã trỏ tới `https://project-management-3-15e9.onrender.com`.
   Nếu đổi backend, đặt `API_PROXY_TARGET` trong Settings → Environment Variables bằng origin HTTPS
   mới (không thêm `/api`, không dùng URL frontend Vercel), cho các môi trường cần deploy.
4. Giữ `VITE_API_BASE_URL=/api` hoặc để trống để dùng mặc định trong code.
5. Commit/push `frontend/vercel.mjs`, rồi deploy lại. Đổi biến môi trường cũng cần redeploy.

Vercel rewrite chuyển tiếp `/api/...` sang Render. Trình duyệt gọi API trên cùng
origin với frontend; không cần cấu hình CORS cho luồng này. Cookie refresh token
hiện không có Domain và dùng SameSite=Lax, phù hợp với cách proxy cùng origin.
`VITE_API_URL` chỉ dùng cho Vite dev/preview, không cấu hình proxy production của Vercel.
Không đưa DB password, mail password hoặc JWT secret vào biến `VITE_*`.

`frontend/vercel.mjs` là cấu hình Vercel thực tế, đọc `API_PROXY_TARGET` khi deploy
và chuyển `/api/...` đến backend trước SPA fallback. Khi không đặt biến này, cấu hình
dùng URL Render mặc định ở trên. Không tạo thêm `vercel.json`
cùng thư mục; Vercel chỉ dùng một file cấu hình.

Nếu `/api/auth/send-otp` hoặc `/api/auth/quick-login` trả 404 trên domain Vercel,
kiểm tra Root Directory, `API_PROXY_TARGET` và bản deploy có chứa `vercel.mjs`.
Chỉ deploy frontend không chạy được backend Java. URL `localhost:8080` trên máy cá nhân
cũng không thể dùng làm backend cho Vercel.

## 4. Kiểm tra sau deploy

- Gửi OTP, nhận email và đăng nhập.
- Trong Network, kiểm tra request tới `https://TEN-FRONTEND.vercel.app/api/...`.
- Kiểm tra cookie refresh token và chức năng refresh/đăng xuất.
- Đăng nhập lãnh đạo khoa, mở Thống kê khoa và đổi đợt đồ án.

## Tài liệu nền tảng

- Render Docker: https://render.com/docs/docker
- Render web services và PORT: https://render.com/docs/web-services
- Giới hạn Render Free, bao gồm SMTP: https://render.com/docs/free
- Vercel rewrites: https://vercel.com/docs/routing/rewrites
- Vercel programmatic configuration: https://vercel.com/docs/project-configuration/vercel-ts
- Vite trên Vercel: https://vercel.com/docs/frameworks/frontend/vite
