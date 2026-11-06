-- The roster spreadsheet does not contain student phone numbers.
ALTER TABLE students ALTER COLUMN phone DROP NOT NULL;
