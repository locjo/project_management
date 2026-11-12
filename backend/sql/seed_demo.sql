-- Demo data for PostgreSQL. Run after the backend has created/updated its schema.
-- Safe to rerun: rows are matched by their DEMO_* codes or demo usernames.
-- Existing rows are never updated or deleted. Do not run on a database with private data
-- when public quick login is enabled.
BEGIN;

INSERT INTO topic_categories (code, name, description, is_active, created_at, updated_at)
VALUES
  ('SE_ENTERPRISE', 'Phát triển phần mềm doanh nghiệp', 'Ứng dụng phục vụ quy trình doanh nghiệp', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('SE_DOMAIN', 'Phát triển phần mềm chuyên ngành', 'Ứng dụng theo lĩnh vực chuyên môn', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('AI_ML', 'Trí tuệ nhân tạo và học máy', 'Mô hình học máy và ứng dụng', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('BIG_DATA', 'Dữ liệu lớn và Phân tích dữ liệu', 'Khai phá và phân tích dữ liệu', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('SECURITY', 'An toàn thông tin và quản trị hệ thống', 'Bảo mật ứng dụng và hệ thống', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('TESTING', 'Kiểm thử phần mềm', 'Đảm bảo chất lượng phần mềm', true, LOCALTIMESTAMP, LOCALTIMESTAMP)
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (username, email, role, is_active, created_at, updated_at)
VALUES
  ('demo_student_01', 'demo.student01@example.com', 'STUDENT', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_student_02', 'demo.student02@example.com', 'STUDENT', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_student_03', 'demo.student03@example.com', 'STUDENT', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_student_04', 'demo.student04@example.com', 'STUDENT', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_student_05', 'demo.student05@example.com', 'STUDENT', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_lecturer_01', 'demo.lecturer01@example.com', 'LECTURER', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_lecturer_02', 'demo.lecturer02@example.com', 'LECTURER', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_department', 'demo.department@example.com', 'HEAD_OF_DEPARTMENT', true, LOCALTIMESTAMP, LOCALTIMESTAMP),
  ('demo_faculty', 'demo.faculty@example.com', 'FACULTY_LEADER', true, LOCALTIMESTAMP, LOCALTIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO students (user_id, student_code, last_name, first_name, date_of_birth, class_code, academic_year)
SELECT u.id, s.student_code, s.last_name, s.first_name, s.date_of_birth, 'CNTT-DEMO', '2026-2027'
FROM (VALUES
  ('demo_student_01', 'DEMO-SV-001', 'Nguyễn', 'An', DATE '2004-04-12'),
  ('demo_student_02', 'DEMO-SV-002', 'Trần', 'Bình', DATE '2004-07-20'),
  ('demo_student_03', 'DEMO-SV-003', 'Lê', 'Chi', DATE '2004-02-08'),
  ('demo_student_04', 'DEMO-SV-004', 'Phạm', 'Dũng', DATE '2004-11-15'),
  ('demo_student_05', 'DEMO-SV-005', 'Hoàng', 'Hà', DATE '2004-09-03')
) AS s(username, student_code, last_name, first_name, date_of_birth)
JOIN users u ON u.username = s.username AND u.role = 'STUDENT'
ON CONFLICT DO NOTHING;

INSERT INTO lecturers (user_id, academic_degree)
SELECT u.id, s.academic_degree
FROM (VALUES
  ('demo_lecturer_01', 'Tiến sĩ'),
  ('demo_lecturer_02', 'Thạc sĩ'),
  ('demo_department', 'Tiến sĩ')
) AS s(username, academic_degree)
JOIN users u ON u.username = s.username AND u.role IN ('LECTURER', 'HEAD_OF_DEPARTMENT')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO graduation_terms
  (code, name, academic_year, semester, start_date, register_date, end_date, is_active)
VALUES
  ('DEMO_CURRENT', 'Đợt đồ án demo đang mở', '2026-2027', '1',
   LOCALTIMESTAMP - INTERVAL '1 day', LOCALTIMESTAMP + INTERVAL '30 days',
   LOCALTIMESTAMP + INTERVAL '90 days', true),
  ('DEMO_PREVIOUS', 'Đợt đồ án demo đã kết thúc', '2025-2026', '2',
   LOCALTIMESTAMP - INTERVAL '180 days', LOCALTIMESTAMP - INTERVAL '150 days',
   LOCALTIMESTAMP - INTERVAL '90 days', false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO topics
  (lecturer_id, graduation_term_id, category_id, title, description, is_active, status, version, created_at)
SELECT l.id, gt.id, c.id, s.title, s.description, true, s.status, 0, LOCALTIMESTAMP
FROM (VALUES
  ('demo_lecturer_01', 'AI_ML', 'Nhận diện biển số xe bằng học máy', 'Xây dựng mô hình nhận diện và giao diện tra cứu.', 'APPROVED'),
  ('demo_lecturer_01', 'SE_ENTERPRISE', 'Hệ thống quản lý thực tập sinh', 'Quản lý đợt thực tập, doanh nghiệp và đánh giá.', 'APPROVED'),
  ('demo_lecturer_02', 'BIG_DATA', 'Bảng điều khiển phân tích kết quả học tập', 'Trực quan hóa dữ liệu học tập theo học kỳ.', 'APPROVED'),
  ('demo_lecturer_02', 'SECURITY', 'Giám sát bất thường trong nhật ký truy cập', 'Phân tích log và cảnh báo sự kiện bất thường.', 'PENDING'),
  ('demo_department', 'TESTING', 'Tự động hóa kiểm thử ứng dụng web', 'Xây dựng bộ kiểm thử hồi quy.', 'REJECTED')
) AS s(username, category_code, title, description, status)
JOIN users u ON u.username = s.username
JOIN lecturers l ON l.user_id = u.id
JOIN graduation_terms gt ON gt.code = 'DEMO_CURRENT'
JOIN topic_categories c ON c.code = s.category_code
WHERE NOT EXISTS (
  SELECT 1 FROM topics t WHERE t.graduation_term_id = gt.id AND t.title = s.title
);

INSERT INTO registrations
  (student_id, graduation_term_id, lecturer_id, topic_id, category_id, title, status)
SELECT st.id, gt.id, l.id, t.id, c.id, COALESCE(t.title, s.title), s.status
FROM (VALUES
  ('demo_student_01', 'demo_lecturer_01', 'AI_ML', 'Nhận diện biển số xe bằng học máy', NULL, 'APPROVED'),
  ('demo_student_02', 'demo_lecturer_01', 'SE_ENTERPRISE', 'Hệ thống quản lý thực tập sinh', NULL, 'PENDING'),
  ('demo_student_03', 'demo_lecturer_02', 'BIG_DATA', 'Bảng điều khiển phân tích kết quả học tập', NULL, 'APPROVED'),
  ('demo_student_04', 'demo_lecturer_02', 'SE_DOMAIN', NULL, 'Ứng dụng theo dõi thiết bị phòng thí nghiệm', 'PENDING'),
  ('demo_student_05', 'demo_lecturer_01', 'AI_ML', NULL, 'Dự báo nhu cầu sử dụng phòng học', 'REJECTED')
) AS s(student_username, lecturer_username, category_code, topic_title, title, status)
JOIN users su ON su.username = s.student_username AND su.role = 'STUDENT'
JOIN students st ON st.user_id = su.id
JOIN users lu ON lu.username = s.lecturer_username
JOIN lecturers l ON l.user_id = lu.id
JOIN graduation_terms gt ON gt.code = 'DEMO_CURRENT'
JOIN topic_categories c ON c.code = s.category_code
LEFT JOIN topics t ON t.graduation_term_id = gt.id AND t.title = s.topic_title
WHERE (s.topic_title IS NULL OR t.id IS NOT NULL)
  AND NOT EXISTS (
    SELECT 1 FROM registrations r
    WHERE r.student_id = st.id AND r.graduation_term_id = gt.id
  );

COMMIT;
