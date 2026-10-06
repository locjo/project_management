-- OTP hashes are stored only in Redis with a 180-second TTL.
-- Apply after deploying the backend without OtpToken/OtpTokenRepository.
BEGIN;
DROP TABLE IF EXISTS public.otp_tokens;
COMMIT;
