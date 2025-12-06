-- Ensure zodiac columns exist in profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zodiac_sign VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS chinese_zodiac VARCHAR(50);
