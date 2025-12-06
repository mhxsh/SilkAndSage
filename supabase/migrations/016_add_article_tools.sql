-- Add related_tools column to generated_pages
-- This stores an array of tool identifiers (e.g. ['color_harmony', 'mood_healing'])
ALTER TABLE generated_pages ADD COLUMN IF NOT EXISTS related_tools text[];
