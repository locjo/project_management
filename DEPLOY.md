# Deploy backend Render và frontend Vercel

## 1. Chuẩn bị database, Redis và email

Tạo PostgreSQL và Redis/Render Key Value, ghi lại host, port và thông tin đăng nhập.
Backend dùng Redis cho OTP và giới hạn yêu cầu, nên cần Redis hoạt động.

Backend gửi OTP qua Resend API HTTPS. Tạo API key trong Resend, thêm và xác minh
domain gửi email. Địa chỉ `RESEND_FROM` phải thuộc domain đã xác minh để gửi OTP
đến người dùng thực. Domain thử nghiệm `resend.dev` chỉ dành cho kiểm tra giới hạn.
Đăng nhập nhanh cấp quyền trực tiếp cho tài khoản đầu tiên đang hoạt động của từng vai trò.
Chỉ bật khi đây là bản demo và mọi dữ liệu trong hệ thống đều được phép truy cập công khai.

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
| `RESEND_API_KEY` | API key của Resend (`re_...`) |
| `RESEND_FROM` | Ví dụ `OTP <otp@domain-da-xac-minh.com>` |
| `JWT_SECRET` | Khóa ngẫu nhiên riêng cho production, tối thiểu 32 byte |
| `QUICK_LOGIN_ENABLED` | `true` để bật 4 nút đăng nhập nhanh cho bản demo; `false` để tắt API |

Không dán nguyên URL dạng `postgresql://user:password@host/database` vào `DB_URL`.
Tách username/password sang hai biến tương ứng và dùng URL JDBC như bảng trên.
Nếu nhà cung cấp yêu cầu SSL, thêm `?sslmode=require` vào URL JDBC.

`server.port` đã đọc `${PORT:8080}`, phù hợp với cổng Render cấp.
File `application-local.properties` không được commit hoặc đưa vào Docker image.
Các biến môi trường trên Render thay thế cấu hình local. Đặt `RESEND_API_KEY`
và `RESEND_FROM` trên **Render backend**, không đặt trên Vercel frontend.

Deploy backend, kiểm tra log khởi động thành công, rồi sao chép URL HTTPS Render cấp.
Truy cập `/` có thể bị từ chối do Spring Security; điều này không tự chứng minh backend bị lỗi.
Nếu cần dữ liệu demo cho bốn vai trò, nạp `backend/sql/seed_demo.sql` vào đúng
PostgreSQL mà Render đang dùng sau khi backend đã tạo schema; xem README.

## 3. Frontend trên Vercel

1. Import repository trên Vercel, Root Directory: `frontend`, Framework: **Vite**.
2. Build Command: `npm run build`; Output Directory: `dist`.
3. Cấu hình mặc định đã trỏ tới `https://project-management-3-15e9.onrender.com`.
   Nếu đổi backend, sửa `destination` trong `frontend/vercel.json`, giữ `/api/:path*` ở cuối.
4. Giữ `VITE_API_BASE_URL=/api` hoặc để trống để dùng mặc định trong code.
   Bốn nút đăng nhập nhanh hiện theo mặc định. Nếu cần ẩn, đặt
   `VITE_ENABLE_QUICK_LOGIN=false` trong Environment Variables của Vercel rồi redeploy.
   Render phải có `QUICK_LOGIN_ENABLED=true` để các nút đăng nhập thành công.
5. Commit/push `frontend/vercel.json` và việc xóa `frontend/vercel.mjs`, rồi deploy commit mới.

Vercel rewrite chuyển tiếp `/api/...` sang Render. Trình duyệt gọi API trên cùng
origin với frontend; không cần cấu hình CORS cho luồng này. Cookie refresh token
hiện không có Domain và dùng SameSite=Lax, phù hợp với cách proxy cùng origin.
`VITE_API_URL` chỉ dùng cho Vite dev/preview, không cấu hình proxy production của Vercel.
Không đưa DB password, Resend API key hoặc JWT secret vào biến `VITE_*`.

`frontend/vercel.json` chuyển `/api/...` đến Render trước SPA fallback.
Không đặt thêm `vercel.mjs` cùng thư mục. `API_PROXY_TARGET` không còn dùng trên Vercel.
Response header `X-App-Deployment: render-api-proxy-v2` giúp xác nhận bản sửa đã áp dụng.

Nếu `/api/auth/send-otp` hoặc `/api/auth/quick-login` trả 404 trên domain Vercel,
kiểm tra Root Directory và commit của deployment đang gắn domain Production.
Nếu thiếu header trên, cấu hình mới chưa được áp dụng cho domain đang truy cập.
Chỉ deploy frontend không chạy được backend Java. URL `localhost:8080` trên máy cá nhân
cũng không thể dùng làm backend cho Vercel.

## 4. Kiểm tra sau deploy

- Gửi OTP, kiểm tra email (cả thư mục spam) và đăng nhập. Nếu API trả 503,
  kiểm tra `RESEND_API_KEY`, `RESEND_FROM`, trạng thái xác minh domain và log Resend.
- Trong Network, kiểm tra request tới `https://TEN-FRONTEND.vercel.app/api/...`.
- Kiểm tra cookie refresh token và chức năng refresh/đăng xuất.
- Đăng nhập lãnh đạo khoa, mở Thống kê khoa và đổi đợt đồ án.

## Tài liệu nền tảng

- Render Docker: https://render.com/docs/docker
- Render web services và PORT: https://render.com/docs/web-services
- Vercel rewrites: https://vercel.com/docs/routing/rewrites
- Vercel programmatic configuration: https://vercel.com/docs/project-configuration/vercel-ts
- Vite trên Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Resend API gửi email: https://resend.com/docs/api-reference/emails/send-email
- Resend xác minh domain: https://resend.com/docs/dashboard/domains/introduction
