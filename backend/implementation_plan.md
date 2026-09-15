# Kế hoạch Cập nhật & Tinh chỉnh: Hệ thống Quản lý Đồ án Tốt nghiệp (Khoa CNTT - HUMG)

Cập nhật các tính năng và tinh chỉnh giao diện theo yêu cầu mới:
1. **Quản lý theo đợt đăng ký (Period Context)** cho tất cả các dashboard (Khoa, Bộ môn, Giảng viên, Sinh viên).
2. **Dashboard Lãnh đạo khoa**: Thống kê chi tiết toàn bộ giảng viên (Số SV đang hướng dẫn, Số slot còn trống, Bộ môn, Học vị).
3. **Danh mục Lĩnh vực Đề tài (Topic Categories) - CRUD Cấp Khoa**:
   - *Phát triển phần mềm doanh nghiệp*
   - *Phát triển phần mềm chuyên ngành*
   - *Trí tuệ nhân tạo và học máy*
   - *Dữ liệu lớn và Phân tích dữ liệu*
   - *An toàn thông tin và quản trị hệ thống*
   - *Kiểm thử phần mềm*
   - Áp dụng khi Giảng viên đề xuất đề tài & Sinh viên đăng ký đề tài.
4. **Cô đọng thông tin UI**: Tối giản hóa các thẻ và thông tin thừa, tập trung vào flow xử lý chính xác của từng vai trò (Sinh viên, Giảng viên, Bộ môn, Khoa).

---

## 1. Cấu trúc Cơ sở Dữ liệu Bổ sung (Prisma Schema)

```prisma
model TopicCategory {
  id          String         @id @default(cuid())
  code        String         @unique // Mã lĩnh vực (VD: SE_ENTERPRISE, AI_ML, BIG_DATA...)
  name        String         // Tên lĩnh vực (VD: Trí tuệ nhân tạo và học máy)
  description String?
  isActive    Boolean        @default(true)
  topics      Topic[]
  registrations Registration[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

// Bổ sung quan hệ categoryId vào model Topic và Registration:
model Topic {
  // ...
  categoryId  String?
  category    TopicCategory? @relation(fields: [categoryId], references: [id])
}

model Registration {
  // ...
  categoryId  String?
  category    TopicCategory? @relation(fields: [categoryId], references: [id])
}
```

---

## 2. Thiết kế Lại Giao diện Cô Đọng theo Flow của từng Role

### 2.1. Cổng Sinh Viên (`STUDENT`)
- Bộ lọc chọn Đợt ĐATN (mặc định đợt đang mở).
- Card trạng thái hồ sơ tinh gọn: `Chờ duyệt` / `Đã duyệt` / `Từ chối`.
- Form Đăng ký tối giản 4 bước nhanh:
  1. Chọn Giảng viên hướng dẫn (kèm số slot còn trống của GV trong đợt đó).
  2. Chọn Lĩnh vực đề tài (từ danh mục chuẩn của Khoa).
  3. Chọn Đề tài mẫu của GV (lọc theo lĩnh vực) HOẶC Nhập tên đề tài tự đề xuất.
  4. Chọn Chuyên ngành làm đồ án.

### 2.2. Cổng Giảng Viên (`LECTURER`)
- Thanh chọn Đợt ĐATN trên cùng (đổi đợt để xem dữ liệu tương ứng).
- Thanh đo tiến độ chỉ tiêu cô đọng: `Đã nhận X/Y SV • Còn trống Z slot`.
- Danh sách Yêu cầu chờ duyệt: Xem nhanh thông tin SV, lĩnh vực, đề tài $\rightarrow$ 1-click `Đồng ý` / `Từ chối`.
- Danh sách SV chính thức đã nhận trong đợt.
- Quản lý đề tài gợi ý: Phân loại theo Lĩnh vực đề tài.

### 2.3. Cổng Cấp Bộ Môn (`DEPT_HEAD`)
- Bộ chọn Đợt ĐATN.
- Bảng tổng hợp các Giảng viên thuộc bộ môn: Tên, Học vị, Chỉ tiêu tối đa, Số SV đang HD trong đợt, Số slot còn trống.
- Bảng danh sách sinh viên thực hiện chuyên ngành của bộ môn trong đợt.

### 2.4. Cổng Cấp Khoa (`FACULTY_ADMIN`)
- Bộ chọn Đợt ĐATN.
- Bảng Thống kê chi tiết toàn bộ Giảng viên Khoa:
  - Tên giảng viên, Bộ môn, Học vị.
  - Số lượng SV đang hướng dẫn trong đợt được chọn.
  - Số lượng slot còn trống.
  - Số lượng yêu cầu đang chờ duyệt.
- Tab Quản lý **Danh mục Lĩnh vực Đề tài** (CRUD: Thêm, Sửa, Xóa, Bật/Tắt lĩnh vực).
- Quản lý Master Data Giảng viên (CRUD) & Đợt ĐATN.

---

## 3. Kế hoạch Triển khai Chi tiết

- [ ] **Bước 1: Cập nhật Prisma Schema & Seed 6 Lĩnh vực Đề tài mẫu**
  - Thêm `TopicCategory` vào schema.
  - Cập nhật `Topic` và `Registration` liên kết với `TopicCategory`.
  - Chạy `prisma db push` và cập nhật `seed.js`.
- [ ] **Bước 2: Xây dựng API cho Lĩnh vực Đề tài & Nâng cấp API theo Đợt**
  - `GET/POST /api/categories`: CRUD danh mục lĩnh vực đề tài.
  - `PUT/DELETE /api/categories/[id]`.
  - Cập nhật `/api/teachers`, `/api/registrations`, `/api/topics` nhận `periodId` và tính toán quota/slot trống chuẩn xác theo đợt được chọn.
- [ ] **Bước 3: Tinh chỉnh Giao diện Cô đọng theo Flow**
  - Refactor giao diện Sinh viên (tích hợp chọn lĩnh vực đề tài, form cô đọng).
  - Refactor giao diện Giảng viên (lọc theo đợt, tiến độ slot trống, duyệt nhanh).
  - Refactor giao diện Bộ môn (lọc theo đợt, bảng slot trống GV).
  - Refactor giao diện Khoa (bảng thống kê slot từng GV trong đợt + trang CRUD Lĩnh vực đề tài).
- [ ] **Bước 4: Kiểm thử toàn diện và cập nhật Walkthrough**
