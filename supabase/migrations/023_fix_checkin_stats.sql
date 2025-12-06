-- Migration: 023_fix_checkin_stats
-- Description: Fix the update_checkin_stats function to resolve SQL GROUP BY error

-- Drop and recreate the function with correct logic
CREATE OR REPLACE FUNCTION public.update_checkin_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_checkin_date DATE;
    v_last_date DATE;
    v_current_streak INTEGER := 0;
    v_longest_streak INTEGER := 0;
    v_total_checkins INTEGER := 0;
    v_today DATE := CURRENT_DATE;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_user_id := NEW.user_id;
        v_checkin_date := NEW.checkin_date;
    ELSIF TG_OP = 'DELETE' THEN
        v_user_id := OLD.user_id;
        v_checkin_date := OLD.checkin_date;
    END IF;

    -- Get or create stats
    INSERT INTO public.user_checkin_stats (user_id, total_checkins, current_streak, longest_streak, last_checkin_date)
    VALUES (v_user_id, 0, 0, 0, NULL)
    ON CONFLICT (user_id) DO NOTHING;

    -- Calculate total checkins
    SELECT COUNT(*)::INTEGER
    INTO v_total_checkins
    FROM public.daily_checkins
    WHERE user_id = v_user_id;

    -- Get last checkin date
    SELECT MAX(checkin_date)
    INTO v_last_date
    FROM public.daily_checkins
    WHERE user_id = v_user_id;

    -- Calculate current streak (consecutive days from most recent checkin backwards)
    -- Only count if the most recent checkin is today or yesterday (allowing for timezone)
    IF v_last_date IS NOT NULL AND v_last_date >= (v_today - INTERVAL '1 day') THEN
        WITH RECURSIVE streak_calc AS (
            -- Start with the most recent checkin date
            SELECT 
                v_last_date AS check_date,
                1 AS streak_length
            
            UNION ALL
            
            -- Check previous day
            SELECT 
                sc.check_date - 1,
                sc.streak_length + 1
            FROM streak_calc sc
            WHERE EXISTS (
                SELECT 1 FROM public.daily_checkins 
                WHERE user_id = v_user_id AND checkin_date = sc.check_date - 1
            )
        )
        SELECT COALESCE(MAX(streak_length), 0)
        INTO v_current_streak
        FROM streak_calc;
    ELSE
        v_current_streak := 0;
    END IF;

    -- Calculate longest streak (all time)
    WITH ordered_checkins AS (
        SELECT 
            checkin_date,
            checkin_date - ROW_NUMBER() OVER (ORDER BY checkin_date)::INTEGER AS grp
        FROM public.daily_checkins
        WHERE user_id = v_user_id
    ),
    streak_groups AS (
        SELECT 
            grp,
            COUNT(*) AS streak_length
        FROM ordered_checkins
        GROUP BY grp
    )
    SELECT COALESCE(MAX(streak_length), 0)
    INTO v_longest_streak
    FROM streak_groups;

    -- Update stats
    UPDATE public.user_checkin_stats
    SET 
        total_checkins = v_total_checkins,
        current_streak = v_current_streak,
        longest_streak = GREATEST(COALESCE(longest_streak, 0), v_current_streak),
        last_checkin_date = v_last_date,
        updated_at = NOW()
    WHERE user_id = v_user_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

