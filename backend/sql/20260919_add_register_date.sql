-- Existing terms retain their previous registration window.
BEGIN;
ALTER TABLE public.graduation_terms ADD COLUMN IF NOT EXISTS register_date timestamp without time zone;
UPDATE public.graduation_terms SET register_date = end_date WHERE register_date IS NULL;
ALTER TABLE public.graduation_terms ALTER COLUMN register_date SET NOT NULL;
COMMIT;
