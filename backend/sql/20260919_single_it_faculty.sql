-- Single-faculty application: retain people, topics and registrations.
-- Deploy the updated entities before applying this migration.
BEGIN;
ALTER TABLE public.students DROP COLUMN IF EXISTS department_id;
ALTER TABLE public.students DROP COLUMN IF EXISTS faculty_code;
ALTER TABLE public.lecturers DROP COLUMN IF EXISTS department_id;
ALTER TABLE public.lecturers DROP COLUMN IF EXISTS department;
DROP TABLE IF EXISTS public.departments;
DROP TABLE IF EXISTS public.faculties;
COMMIT;
