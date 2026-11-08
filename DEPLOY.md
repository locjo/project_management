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

1. Sao chép `frontend/vercel.json.example` thành `frontend/vercel.json`.
2. Thay `https://YOUR-BACKEND.onrender.com` bằng URL backend vừa tạo, giữ `/api/:path*`.
3. Commit và push file cấu hình này.
4. Import repository trên Vercel, Root Directory: `frontend`, Framework: **Vite**.
5. Build Command: `npm run build`; Output Directory: `dist`.
6. Đặt `VITE_API_BASE_URL=/api` hoặc để trống để dùng mặc định trong code.
7. Deploy frontend.

Vercel rewrite chuyển tiếp `/api/...` sang Render. Trình duyệt gọi API trên cùng
origin với frontend; không cần cấu hình CORS cho luồng này. Cookie refresh token
hiện không có Domain và dùng SameSite=Lax, phù hợp với cách proxy cùng origin.
`API_PROXY_TARGET` chỉ dùng cho Vite dev/preview, không cấu hình proxy production của Vercel.
Không đưa DB password, mail password hoặc JWT secret vào biến `VITE_*`.

File `.example` chưa được Vercel áp dụng: phải tạo `vercel.json` với URL thật trước khi deploy.

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
- Vite trên Vercel: https://vercel.com/docs/frameworks/frontend/vite
