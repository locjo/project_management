# Frontend HUMG

TypeScript, Vite, Tailwind CSS, Axios và Zustand vanilla. Giao diện mặc định sử dụng API thực tế của `../backend`, không dùng OTP giả hoặc ID dữ liệu mẫu.

## Chạy ứng dụng

1. Khởi động PostgreSQL, Redis và Spring Boot backend; cấu hình SMTP để gửi OTP.
2. Trong `frontend`, chạy `npm install` và `npm run dev`.
3. Mở địa chỉ Vite hiển thị, nhập email của tài khoản đã tồn tại trong backend, nhận OTP và đăng nhập. OTP có hiệu lực 3 phút theo `OtpService`.

Redis cần truy cập được từ backend tại `localhost:6379`. Với Docker, chỉ thấy `6379/tcp` là chưa mở cổng ra máy chủ. Container Redis của dự án dùng ánh xạ `127.0.0.1:6379:6379`:

```sh
# Tạo lần đầu (nếu chưa có container này)
docker run -d --name project-management-redis --restart unless-stopped -p 127.0.0.1:6379:6379 redis:alpine
# Khởi động lại container đã có
docker start project-management-redis
```

Khi Redis không kết nối được, API xác thực trả HTTP 503; đây là lỗi dịch vụ, không phải thiếu quyền của tài khoản.

OTP chỉ lưu bản băm trong Redis với TTL 180 giây và được xóa khi xác thực đúng. PostgreSQL không còn lưu OTP. Khi nâng cấp database cũ, chạy `backend/sql/20260918_drop_otp_tokens.sql` sau khi backend đã cập nhật để xóa bảng `otp_tokens`.

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
| `topics.ts` | GET/POST `/topics`, GET `/mine`, GET `/pending`, PUT `/{id}/review`, PUT/DELETE `/{id}` |
| `registrations.ts` | POST `/registrations`, GET `/topic`, GET `/lecturer?graduationTermId=...`, GET `/lecturer/pending`, PUT `/{id}/status` |
| `dashboard.ts` | GET `/dashboard/lecturers?graduationTermId=...` |
| `lecturers.ts` | GET `/lecturers?graduationTermId=...` (danh sách GVHD cho sinh viên) |

Tất cả URL trên có prefix `/api`. Service trả về trường `data` trong `{ success, message, data }`. Client refresh JWT hết hạn, gom các yêu cầu refresh đồng thời thành một, retry tối đa một lần cho lỗi xác thực và không refresh khi người dùng thực sự thiếu quyền.

Giao diện hỗ trợ chọn đợt, tìm đề tài, sinh viên gửi đăng ký và xem hồ sơ, giảng viên duyệt/từ chối và tạo đề tài, lãnh đạo xem định mức, thêm lĩnh vực và tạo đợt. Các hàm sửa/xóa đã có ở service để dùng khi xây dựng thêm màn hình quản trị.

Các giới hạn theo backend hiện có:

- Sinh viên lấy danh sách GVHD từ `/lecturers`, gồm các tài khoản giảng viên đang hoạt động, không phụ thuộc đề tài gợi ý. Số chỗ trống được tính từ hồ sơ đã duyệt của đợt được chọn; giảng viên hết chỉ tiêu hiển thị nhưng không chọn được. Endpoint dashboard vẫn chỉ dành cho lãnh đạo.
- Giảng viên có hai mục riêng: **Đang chờ duyệt** và **Sinh viên đã nhận**, với số hồ sơ của đợt đang chọn. Sau khi duyệt, dữ liệu được tải lại từ máy chủ; hồ sơ đã nhận không còn nút duyệt/từ chối. Backend lấy giảng viên từ tài khoản đăng nhập để giới hạn hồ sơ đúng người hướng dẫn.
- GVHD tạo đề tài ở trạng thái `PENDING`. Trưởng bộ môn có mục duyệt/từ chối; chỉ đề tài `APPROVED` xuất hiện cho sinh viên đăng ký. Sửa đề tài sẽ đưa lại về `PENDING`. Giảng viên xem mọi trạng thái của đề tài do mình tạo tại “Đề tài của tôi”.
- Hệ thống chỉ quản lý khoa CNTT, không còn bảng khoa/bộ môn hay thông tin khoa/bộ môn trên sinh viên, giảng viên. Người duyệt có thể là `HEAD_OF_DEPARTMENT` hoặc `FACULTY_LEADER`, được xem, phê duyệt và từ chối đề tài của mọi giảng viên trong đợt. Endpoint `/topics/department` giữ tên cũ để tương thích, nhưng không còn lọc theo bộ môn.
- Chỉ lãnh đạo khoa (`FACULTY_LEADER`) có form và quyền API tạo đợt đồ án. Trưởng bộ môn vẫn được chọn đợt để xem dữ liệu và duyệt đề tài. Các sidebar dùng chung mã `dang-xuat` để xử lý đăng xuất.
- Database cũ cần chạy `backend/sql/20260919_single_it_faculty.sql` sau khi cập nhật backend. Migration bỏ các cột liên kết trước khi xóa bảng `departments`, `faculties`, giữ nguyên sinh viên, giảng viên, đề tài và đăng ký.
- Giới hạn chung là **5 sinh viên mỗi giảng viên mỗi đợt**, không còn `maxStudents` riêng trên entity Lecturer. API thống kê trả `studentLimit: 5`. Backend khóa dòng giảng viên khi xử lý hồ sơ để kiểm tra chỉ tiêu trước khi duyệt.
- Giao diện trưởng bộ môn bỏ cột Chỉ tiêu. Tạo đợt nhập `startDate`, `endDate` và hạn đăng ký `registerDate` (cột database `register_date`). Quy định `startDate <= registerDate <= endDate`; sinh viên được đăng ký từ `startDate` đến `registerDate` (bao gồm hai mốc) khi đợt đang hoạt động. `endDate` vẫn là thời điểm kết thúc đồ án.
- Database cũ cần chạy `backend/sql/20260919_add_register_date.sql`. Các đợt chưa có hạn được gán `register_date = end_date` để giữ nguyên cửa sổ đăng ký trước khi cập nhật.

Database cũ cần chạy thêm `backend/sql/20260917_registration_term_dates.sql` trước khi khởi động lại backend để bỏ cột hạn đăng ký cũ. Script giữ nguyên ngày bắt đầu và kết thúc của các đợt hiện có.

Khi cập nhật database cũ, chạy `backend/sql/20260917_topic_review_and_supervision_limit.sql` trước khi khởi động lại backend. Script bỏ cột `max_students`, thêm trạng thái duyệt và version cho đề tài. Đề tài cũ chưa có trạng thái chuyển thành chờ duyệt; hồ sơ sinh viên đã nhận không bị xóa.
- Đăng ký tự đề xuất chỉ gửi tên đề tài và các ID; backend chưa nhận công nghệ, mô tả giải pháp hay hướng chuyên ngành.
- Vai trò đúng là `STUDENT`, `LECTURER`, `HEAD_OF_DEPARTMENT`, `FACULTY_LEADER`.

## Kiểm tra

```sh
npm test
npm run build
```

Kiểm thử dùng Axios adapter giả lập, không gửi email, không thay đổi dữ liệu backend. Bao phủ DTO/endpoint, OTP, refresh đồng thời, lỗi quyền truy cập, xóa phiên, tải theo vai trò và phản hồi về sai thứ tự. Cần backend đang chạy cùng tài khoản thật để kiểm tra OTP/CRUD xuyên suốt.
