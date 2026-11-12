-- Repair the two legacy demo accounts shown in the login screenshots.
-- Run on the PostgreSQL database used by Render. Safe to rerun.
BEGIN;

INSERT INTO students
  (user_id, student_code, last_name, first_name, academic_year)
SELECT u.id, 'DEMO-LEGACY-' || u.id, 'Sinh viên', 'Demo', '2026-2027'
FROM users u
WHERE u.username = 'sinhvien01' AND u.role = 'STUDENT'
  AND NOT EXISTS (SELECT 1 FROM students s WHERE s.user_id = u.id)
ON CONFLICT DO NOTHING;

INSERT INTO lecturers (user_id, academic_degree)
SELECT u.id, NULL
FROM users u
WHERE u.username = 'giangvien01' AND u.role = 'LECTURER'
  AND NOT EXISTS (SELECT 1 FROM lecturers l WHERE l.user_id = u.id)
ON CONFLICT DO NOTHING;

COMMIT;
