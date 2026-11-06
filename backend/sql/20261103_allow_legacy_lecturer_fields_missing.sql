-- Legacy columns are no longer mapped by Lecturer. Preserve their data while
-- allowing accounts created by the current model to omit these fields.
BEGIN;
DO $$
DECLARE legacy_column text;
BEGIN
    FOREACH legacy_column IN ARRAY ARRAY['academic_title', 'full_name', 'lecturer_code', 'phone']
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'lecturers'
                     AND column_name = legacy_column) THEN
            EXECUTE format('ALTER TABLE public.lecturers ALTER COLUMN %I DROP NOT NULL', legacy_column);
        END IF;
    END LOOP;
END $$;
COMMIT;
