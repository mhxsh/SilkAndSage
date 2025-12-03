-- 创建增加浏览计数的函数
CREATE OR REPLACE FUNCTION increment_views(page_slug text)
RETURNS void AS $$
BEGIN
  UPDATE generated_pages
  SET views_count = views_count + 1
  WHERE slug = page_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
