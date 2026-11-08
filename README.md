# Project Management

Hệ thống quản lý đồ án tốt nghiệp dành cho sinh viên, giảng viên, trưởng bộ môn và lãnh đạo khoa.

## Mục tiêu

- Quản lý đề tài và đăng ký đồ án tốt nghiệp
- Phân quyền theo vai trò: sinh viên, giảng viên, trưởng bộ môn, lãnh đạo khoa
- Quản lý đợt đồ án, danh mục lĩnh vực đề tài và trạng thái duyệt
- Tích hợp xác thực OTP, JWT và refresh token
- Cung cấp giao diện web hiện đại cho người dùng và admin

## Công nghệ sử dụng

### Backend
- Java 17
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Security
- Spring Data JPA
- PostgreSQL
- Redis
- JWT
- Lombok
- Maven

### Frontend
- TypeScript SPA
- Vite
- Tailwind CSS
- Axios
- Zustand

### DevOps / Run
- Docker Compose
- PostgreSQL container
- Backend container
- Frontend container

## Kiến trúc hệ thống

```text
+---------------------+      HTTP/REST      +----------------------+
| React Frontend      | <------------------> | Spring Boot Backend   |
| Vite + TypeScript   |                     | Java 17 + JPA         |
+---------------------+                     +----------+-----------+
                                                          |
                                                          v
                                               +-------------------+
                                               | PostgreSQL        |
                                               | Redis             |
                                               +-------------------+
```

## Vai trò người dùng

### Sinh viên
- Đăng nhập bằng OTP
- Xem đợt đăng ký đồ án
- Chọn giảng viên hướng dẫn
- Đăng ký đề tài / đề xuất đề tài mới
- Theo dõi trạng thái hồ sơ đăng ký

### Giảng viên
- Quản lý đề tài của mình
- Duyệt / từ chối đăng ký của sinh viên
- Xem số slot còn trống
- Theo dõi sinh viên đang hướng dẫn trong từng đợt

### Trưởng bộ môn
- Xem thống kê theo bộ môn
- Duyệt đề tài theo chuyên môn
- Theo dõi tiến độ và định mức giảng viên

### Lãnh đạo khoa
- Quản lý đợt đồ án
- CRUD danh mục lĩnh vực đề tài
- Theo dõi thống kê tổng quan toàn khoa

## Model nghiệp vụ chính

Các thực thể quan trọng bao gồm:

- `User`
- `Student`
- `Lecturer`
- `Topic`
- `TopicCategory`
- `GraduationTerm`
- `Registration`

### Entity Topic

`Topic` đại diện cho đề tài đồ án tốt nghiệp. Một đề tài thuộc về:

- một giảng viên hướng dẫn (`lecturer`)
- một đợt tốt nghiệp (`graduationTerm`)
- một danh mục lĩnh vực (`category`)

Một số trường chính:

```java
private Long id;
private Lecturer lecturer;
private GraduationTerm graduationTerm;
private TopicCategory category;
private String title;
private String description;
private boolean active;
private TopicStatus status;
private Long version;
private LocalDateTime createdAt;
```

`TopicStatus` thường bao gồm trạng thái như:
- `PENDING`
- `APPROVED`
- `REJECTED`

## Cấu trúc dự án

```text
project_management/
├─ backend/
│  ├─ src/main/java/com/example/projectmanagement/
│  │  ├─ config/
│  │  ├─ controller/
│  │  ├─ dto/
│  │  ├─ entity/
│  │  ├─ exception/
│  │  ├─ mapper/
│  │  ├─ repository/
│  │  ├─ security/
│  │  ├─ service/
│  │  └─ ProjectManagementApplication.java
│  ├─ sql/
│  ├─ pom.xml
│  ├─ Dockerfile
│  └─ mvnw
├─ frontend/
│  ├─ src/
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ Dockerfile
├─ docker-compose.yml
├─ README.md
└─ .gitignore
```

## Yêu cầu môi trường

- Java 17+
- Maven 3.9+
- Node.js 18+
- npm hoặc pnpm
- Docker + Docker Compose
- PostgreSQL
- Redis

## Khởi động nhanh

Deploy backend trên Render và frontend trên Vercel: xem [DEPLOY.md](DEPLOY.md).

### 1) Clone dự án

```bash
git clone <repo-url>
cd project_management
```

### 2) Chạy bằng Docker Compose

```bash
docker compose up --build
```

Sau khi khởi động:

- Frontend: http://localhost:80
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 3) Chạy backend thủ công

Backend cần các biến `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `MAIL_USERNAME`,
`MAIL_PASSWORD`, `REDIS_URL` và `JWT_SECRET` theo `backend/src/main/resources/application.yaml`.
Nếu gặp lỗi `Could not resolve placeholder 'JWT_SECRET'`, hãy cấu hình khóa JWT
trong môi trường chạy hoặc file `backend/application-local.properties` (đã được Git bỏ qua).
File này được đọc khi chạy từ thư mục gốc dự án hoặc thư mục `backend`.

Tham khảo `backend/application-local.properties.example` để bổ sung cấu hình DB,
Redis và email vào file local; giữ nguyên `JWT_SECRET` đã tạo. `DB_URL` phải có dạng
`jdbc:postgresql://localhost:5432/TEN_DATABASE` với tên database thực tế.
Lỗi `'url' must start with "jdbc"` có thể xuất hiện khi thiếu `DB_URL` hoặc dùng URL
không đúng định dạng JDBC. Điền đúng tài khoản PostgreSQL của máy bạn;
mật khẩu trong Docker Compose chỉ áp dụng cho database được tạo bởi Compose đó.

Nếu gửi OTP báo `Authentication failed` / `no password specified`, kiểm tra
`MAIL_USERNAME` và `MAIL_PASSWORD` trong file local hoặc môi trường chạy, không để trống.
Với Gmail, `MAIL_USERNAME` là địa chỉ gửi email; `MAIL_PASSWORD` là mật khẩu ứng dụng
được tạo sau khi bật xác minh 2 bước, không phải mật khẩu đăng nhập Gmail:
https://support.google.com/accounts/answer/185833.
Khởi động lại backend sau khi cập nhật cấu hình. Không commit mật khẩu vào Git.
Khi cấu hình email thiếu hoặc SMTP gặp lỗi, API gửi OTP trả HTTP 503;
OTP mới chỉ được lưu sau khi SMTP chấp nhận email.

Tạo khóa ngẫu nhiên cho máy local bằng PowerShell (chạy từ thư mục gốc dự án,
chỉ thực hiện khi chưa có file cấu hình local):

```powershell
$configPath = 'backend/application-local.properties'
if (!(Test-Path -LiteralPath $configPath)) {
    $jwtBytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($jwtBytes) } finally { $rng.Dispose() }
    $jwtKey = [Convert]::ToBase64String($jwtBytes)
    Set-Content -LiteralPath $configPath -Value "JWT_SECRET=$jwtKey" -Encoding ascii
}
```

Giữ nguyên khóa giữa các lần chạy; thay khóa sẽ làm token cũ không còn hợp lệ.

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### 4) Chạy frontend thủ công

```bash
cd frontend
npm install
npm run dev
```

## Cấu hình môi trường

Backend dùng Spring Boot và đọc cấu hình từ `application.properties` / `application.yml`.

Ví dụ cấu hình kết nối DB:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/project_management_db
spring.datasource.username=postgres
spring.datasource.password=your_secure_password
spring.jpa.hibernate.ddl-auto=update
```

Frontend dùng cùng origin `/api`; URL backend chỉ cấu hình cho proxy Vite local:

```env
VITE_API_BASE_URL=/api
VITE_API_URL=http://localhost:8080
```

## Chức năng chính

- Đăng nhập bằng OTP
- Tạo và quản lý đề tài
- Phê duyệt đề tài theo từng đợt
- Quản lý danh mục lĩnh vực đề tài
- Quản lý đợt đăng ký đồ án
- Phân quyền theo vai trò
- Dashboard thống kê cho các role quản lý
- Kiểm soát version dữ liệu bằng `@Version` trong entity

## Quy trình nghiệp vụ

1. Người dùng đăng nhập bằng email và OTP.
2. Hệ thống xác thực và cấp access token + refresh token.
3. Sinh viên chọn đợt đăng ký và giảng viên hướng dẫn.
4. Sinh viên gửi đề tài hoặc đăng ký đề tài phù hợp với lĩnh vực.
5. Giảng viên duyệt hoặc từ chối hồ sơ.
6. Trưởng bộ môn / lãnh đạo khoa theo dõi và kiểm soát tiến độ.

## Lưu ý bảo mật

- JWT access token dùng cho xác thực API
- Refresh token được lưu trong cookie HttpOnly
- Redis hỗ trợ lưu OTP với TTL
- Security có cấu hình xác thực và quyền truy cập theo role

## Đóng góp

Mọi đóng góp đều được hoan nghênh. Nếu bạn muốn cải thiện dự án:

1. Fork repository
2. Tạo branch mới
3. Commit thay đổi
4. Tạo pull request

## Giấy phép

Dự án đang được phát triển nội bộ. Vui lòng liên hệ chủ sở hữu nếu cần rõ thêm về giấy phép và sử dụng.

## Liên hệ / Hỗ trợ

- Backend: Spring Boot Java
- Frontend: React + Vite
- Database: PostgreSQL
- Cache/Auth: Redis + JWT

Nếu cần hỗ trợ triển khai hoặc debug, hãy kiểm tra cấu hình PostgreSQL, Redis và API backend trước khi chạy ứng dụng.
