-- establishment_users.establishment_id was FK'd to `establishments` (0 rows,
-- no admin UI ever writes to it), but EstablishmentForm.jsx / EstablishmentStaffInvite.jsx
-- (Phase 2) pass an educational_institutions.id as establishmentId — the
-- actual table the admin UI manages. Every staff invite would have failed
-- with a foreign key violation. Repointed at educational_institutions, the
-- real, populated catalog. Verified with a rolled-back transaction
-- simulating the create-establishment-staff insert.
ALTER TABLE public.establishment_users
  DROP CONSTRAINT establishment_users_establishment_id_fkey,
  ADD CONSTRAINT establishment_users_establishment_id_fkey
    FOREIGN KEY (establishment_id) REFERENCES public.educational_institutions(id) ON DELETE CASCADE;
