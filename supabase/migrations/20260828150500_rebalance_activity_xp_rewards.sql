-- The 4 activities fixed in fill_missing_activity_content had placeholder XP
-- rewards (250-1000) far above the rest of the catalog (~3.3-4.6 XP/min).
-- This skewed learningPathService's scoring (score += xp_reward/10), making
-- them dominate auto-generated paths regardless of relevance.
-- Rebalanced to match same-duration/difficulty peers already in the catalog.
--
-- Applied directly to production via Supabase MCP (see note in
-- 20260828145849_fill_missing_activity_content.sql). Mirrored here for audit
-- history.

update activities set xp_reward = 65  where id = '787bdd62-01cd-4f9b-9cec-94594fd13ad9'; -- Négociation Salariale, Intermédiaire 15min (was 500)
update activities set xp_reward = 110 where id = '5fb6a3d4-cfcf-486d-aea6-81f86a62e988'; -- Pitch Vidéo, Avancé 30min (was 1000)
update activities set xp_reward = 50  where id = 'a835a42d-51ee-468f-938f-98fca9713532'; -- Quiz Python : Les Bases, Débutant 10min (was 250)
update activities set xp_reward = 65  where id = 'd5fb9424-6c21-4ab3-9bb1-59b5217a076a'; -- Structure CV Impactant, Débutant 20min (was 300)
