-- wiki_pages was readable by any authenticated user ("Team view wiki": auth.role() = 'authenticated'),
-- not just admins. Internal team documentation shouldn't be exposed to signed-up students.
DROP POLICY IF EXISTS "Team view wiki" ON public.wiki_pages;
