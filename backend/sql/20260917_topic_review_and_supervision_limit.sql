-- Run once against the application database before restarting the updated backend.
-- Safe to rerun: existing review decisions are preserved.
BEGIN;

ALTER TABLE topics ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'PENDING';
UPDATE topics SET status = 'PENDING' WHERE status IS NULL;
ALTER TABLE topics ALTER COLUMN status SET DEFAULT 'PENDING';
ALTER TABLE topics ALTER COLUMN status SET NOT NULL;

ALTER TABLE topics ADD COLUMN IF NOT EXISTS version bigint DEFAULT 0;
UPDATE topics SET version = 0 WHERE version IS NULL;
ALTER TABLE topics ALTER COLUMN version SET DEFAULT 0;
ALTER TABLE topics ALTER COLUMN version SET NOT NULL;

-- The application now uses the shared limit of 5 students per lecturer per term.
ALTER TABLE lecturers DROP COLUMN IF EXISTS max_students;

COMMIT;
