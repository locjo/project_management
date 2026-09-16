# Frontend HUMG

TypeScript, Vite, Tailwind CSS, Axios và Zustand vanilla. Giao diện mặc định sử dụng API thực tế của `../backend`, không dùng OTP giả hoặc ID dữ liệu mẫu.

## Chạy ứng dụng

1. Khởi động PostgreSQL, Redis và Spring Boot backend; cấu hình SMTP để gửi OTP.
2. Trong `frontend`, chạy `npm install` và `npm run dev`.
3. Mở địa chỉ Vite hiển thị, nhập email của tài khoản đã tồn tại trong backend, nhận OTP và đăng nhập. OTP có hiệu lực 3 phút theo `OtpService`.

Không cần tạo `.env` nếu backend chạy ở `http://localhost:8080`. Để đổi địa chỉ, sao chép `.env.example` thành `.env` và sửa `API_PROXY_TARGET`. Khởi động lại Vite sau khi đổi cấu hình.

```env
VITE_API_BASE_URL=/api
API_PROXY_TARGET=http://localhost:8080
```

Vite dev và preview proxy `/api` đến backend, gửi kèm cookie refresh token. Khi triển khai bản build, web server phải reverse proxy `/api` đến Spring Boot. Nếu dùng URL API khác origin, backend cần cấu hình CORS cho origin frontend và cho phép credentials; backend hiện tại chưa bật CORS.

## Cấu trúc

- `components/`: header, logo, sidebar, hộp thoại dùng chung.
- `lib/`: cấu hình giao diện, tiện ích HTML và điều hướng.
- `pages/login.ts`: gửi OTP và xác thực đăng nhập.
- `pages/portal.ts`: dữ liệu thực theo vai trò của người dùng; các trang thiết kế ban đầu được giữ trong `pages/` để tham khảo.
- `service/`: Axios client và service theo từng controller backend.
- `stores/auth.ts`: phiên đăng nhập Zustand, lưu trong sessionStorage; cookie refresh HttpOnly do backend quản lý.
- `stores/portal.ts`: đợt được chọn, danh mục, đề tài, hồ sơ, định mức, trạng thái tải và lỗi. Không persist dữ liệu máy chủ.
- `stores/registration.ts`: store bản nháp cũ, không được dùng để giả lập đăng ký thành công trong luồng API.
- `types/api.ts`: DTO khớp request/response Java.

Không có HTML nguồn: Vite sinh document khi chạy dev và sinh `dist/index.html` khi build.

## API đã kết nối

| Service | Endpoint |
| --- | --- |
| `auth.ts` | POST `/auth/send-otp`, `/auth/login-otp`, `/auth/logout` |
| `client.ts` | POST `/auth/refresh-token`, Bearer token, timeout, chuẩn hóa lỗi |
| `graduation-terms.ts` | GET/POST `/graduation-terms`, GET `/active`, PUT/DELETE `/{id}` |
| `categories.ts` | GET/POST `/categories`, PUT/DELETE `/{id}` |
| `topics.ts` | GET/POST `/topics`, PUT/DELETE `/{id}` |
| `registrations.ts` | POST `/registrations`, GET `/topic`, GET `/lecturer?graduationTermId=...`, GET `/lecturer/pending`, PUT `/{id}/status` |
| `dashboard.ts` | GET `/dashboard/lecturers?graduationTermId=...` |
| `lecturers.ts` | GET `/lecturers?graduationTermId=...` (danh sách GVHD cho sinh viên) |

Tất cả URL trên có prefix `/api`. Service trả về trường `data` trong `{ success, message, data }`. Client refresh JWT hết hạn, gom các yêu cầu refresh đồng thời thành một, retry tối đa một lần cho lỗi xác thực và không refresh khi người dùng thực sự thiếu quyền.

Giao diện hỗ trợ chọn đợt, tìm đề tài, sinh viên gửi đăng ký và xem hồ sơ, giảng viên duyệt/từ chối và tạo đề tài, lãnh đạo xem định mức, thêm lĩnh vực và tạo đợt. Các hàm sửa/xóa đã có ở service để dùng khi xây dựng thêm màn hình quản trị.

Các giới hạn theo backend hiện có:

- Sinh viên lấy danh sách GVHD từ `/lecturers`, gồm các tài khoản giảng viên đang hoạt động, không phụ thuộc đề tài gợi ý. Số chỗ trống được tính từ hồ sơ đã duyệt của đợt được chọn; giảng viên hết chỉ tiêu hiển thị nhưng không chọn được. Endpoint dashboard vẫn chỉ dành cho lãnh đạo.
- Giảng viên có hai mục riêng: **Đang chờ duyệt** và **Sinh viên đã nhận**, với số hồ sơ của đợt đang chọn. Sau khi duyệt, dữ liệu được tải lại từ máy chủ; hồ sơ đã nhận không còn nút duyệt/từ chối. Backend lấy giảng viên từ tài khoản đăng nhập để giới hạn hồ sơ đúng người hướng dẫn.
- Chưa có API duyệt đề tài cấp khoa/bộ môn hoặc cập nhật tài khoản.
- Đăng ký tự đề xuất chỉ gửi tên đề tài và các ID; backend chưa nhận công nghệ, mô tả giải pháp hay hướng chuyên ngành.
- Vai trò đúng là `STUDENT`, `LECTURER`, `HEAD_OF_DEPARTMENT`, `FACULTY_LEADER`.

## Kiểm tra

```sh
npm test
npm run build
```

Kiểm thử dùng Axios adapter giả lập, không gửi email, không thay đổi dữ liệu backend. Bao phủ DTO/endpoint, OTP, refresh đồng thời, lỗi quyền truy cập, xóa phiên, tải theo vai trò và phản hồi về sai thứ tự. Cần backend đang chạy cùng tài khoản thật để kiểm tra OTP/CRUD xuyên suốt.
