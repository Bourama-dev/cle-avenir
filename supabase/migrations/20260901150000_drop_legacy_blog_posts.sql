-- blog_posts is a legacy, dead-on-arrival duplicate of blog_articles:
-- the only frontend component that read/wrote it (AdminBlog.jsx) was never
-- imported/rendered anywhere, and its read helper (realBlogDataService.getAllPosts)
-- was never called either. The live blog (public pages, AdminBlogManager.jsx,
-- the chat-advisor edge function) all use blog_articles. Its 10 rows were never
-- visible publicly and are dropped along with the table.
DROP TABLE IF EXISTS public.blog_posts CASCADE;
