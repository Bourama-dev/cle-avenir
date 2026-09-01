-- institutions.admin_password held a plaintext password (residue of an old
-- flow no longer present in the codebase — no current code reads/writes
-- this column). Cleared as a security fix, independent of the broader
-- Institution/Establishment consolidation tracked in
-- CONSOLIDATION_ETABLISSEMENT.md.
UPDATE public.institutions SET admin_password = NULL WHERE admin_password IS NOT NULL;
