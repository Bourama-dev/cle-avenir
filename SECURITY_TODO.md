# Sécurité — actions en attente

## Activer "Prevent use of leaked passwords" (HaveIBeenPwned)

- **Statut** : bloqué, réservé au plan Pro et supérieur sur Supabase (le projet tourne actuellement en Free)
- **Où** : Dashboard Supabase → Authentication → Sign In / Providers → Email → "Prevent use of leaked passwords"
- **Action** : une fois le projet passé sur un plan payant (Pro ou plus), activer le toggle et sauvegarder
- **Contexte** : identifié lors de l'audit sécurité du 2026-09-01 (voir `supabase/migrations/20260901120000_security_fix_open_rpc_and_rls.sql` pour les correctifs déjà appliqués — RPC ouvertes à `anon`, RLS manquante sur `parental_consent_requests`, `search_path` mutable). Ce point-ci est le seul resté en suspens de cet audit, priorité basse (protection additionnelle, pas une faille exploitable).
