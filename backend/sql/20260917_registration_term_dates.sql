-- Registration now uses start_date through end_date, inclusive.
-- Remove the obsolete NOT NULL column so new terms can be created.
BEGIN;
ALTER TABLE graduation_terms DROP COLUMN IF EXISTS registration_deadline;
COMMIT;
