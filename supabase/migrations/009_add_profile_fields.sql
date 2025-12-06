-- Migration: 009_add_profile_fields
-- Description: Add gender and other profile fields

-- Add gender field to profiles table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='gender') THEN
        ALTER TABLE profiles ADD COLUMN gender VARCHAR(20);
    END IF;
END $$;

-- Add birth_date to profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='birth_date') THEN
        ALTER TABLE profiles ADD COLUMN birth_date DATE;
    END IF;
END $$;

-- Add zodiac_sign to profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='zodiac_sign') THEN
        ALTER TABLE profiles ADD COLUMN zodiac_sign VARCHAR(50);
    END IF;
END $$;

-- Add chinese_zodiac to profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='chinese_zodiac') THEN
        ALTER TABLE profiles ADD COLUMN chinese_zodiac VARCHAR(20);
    END IF;
END $$;
