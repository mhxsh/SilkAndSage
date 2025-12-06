-- Add occupation and bio columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
