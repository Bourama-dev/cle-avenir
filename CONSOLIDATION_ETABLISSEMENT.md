# Plan de consolidation — systèmes établissement/institution en doublon

Contexte complet dans l'historique de session du 2026-09-01. Résumé des faits établis :

- **3 tables/catalogues distincts pour la même notion d'établissement** : `educational_institutions` (annuaire, vivant), `establishments`/`establishment_*` (comptes établissement, login maison hors Supabase Auth), `institutions`/`institution_*` (comptes établissement, login via Supabase Auth réel).
- **3 tables de rattachement élève↔établissement différentes** : `institution_members` (staff/prof), `establishment_users` (signup), `user_institution_links` (utilisée par le dashboard Establishment).
- Le contrôle d'accès RLS sur `profiles` (qui peut voir les profils élèves) ne repose QUE sur `institution_members`/`is_institution_admin()`.
- Le login Establishment ne crée pas de session Supabase Auth → toute requête RLS émise depuis ce portail échoue silencieusement (`auth.uid()` est `null`).
- Les 10 services `src/services/analytics/Establishment*.js` sont **100% mock** (aucun appel Supabase réel), malgré leur volume de code.

## Décision produit requise avant toute exécution

Avant la Phase 2, il faut trancher une question que je ne peux pas déduire du code : **"établissement" et "institution" désignent-ils le même concept produit**, ou y a-t-il une distinction métier voulue (ex: lycées vs universités, gratuit vs partenaire) ? Tout ce plan suppose que c'est un doublon accidentel (deux constructions successives du même besoin). Si ce n'est pas le cas, arrêter ici et clarifier d'abord.

## Phase 1 — Nettoyage sans risque — ✅ FAIT (2026-09-01)

Vérification avant suppression : les onglets du dashboard Establishment (`EstablishmentClassesTab`, `EstablishmentStudentsTab`, `EstablishmentTeachersTab`, `EstablishmentRecommendationsTab`, `EstablishmentTestResultsTab`) appellent en réalité `establishmentService.js`, qui délègue à `realEstablishmentDataService.js` — **de vraies requêtes Supabase**, pas les mocks. Seuls les 10 fichiers `src/services/analytics/Establishment*Service.js` étaient du mock pur, et aucun n'était importé nulle part ailleurs dans le code (vérifié par recherche globale) — code mort à 100%, supprimés sans aucune adaptation nécessaire :

- `EstablishmentActivityService.js`, `EstablishmentCareerExplorationService.js`, `EstablishmentCareerRecommendationsService.js`, `EstablishmentEngagementService.js`, `EstablishmentInteractionsService.js`, `EstablishmentProfileAnalyticsService.js`, `EstablishmentProgressionService.js`, `EstablishmentResourcesService.js`, `EstablishmentTestAnalyticsService.js`, `EstablishmentTestPerformanceService.js`

`EstablishmentCareersTab.jsx` et `EstablishmentTrendsTab.jsx` sont des placeholders honnêtes ("Cette section est en cours de développement") — pas de données inventées, donc **conservés tels quels**.

**Risque** : nul — code mort confirmé, zéro donnée réelle affectée, zéro import cassé.

## Phase 2 — En cours (2026-09-01), Option A retenue : garder Establishment, réparer son auth

Fait :
- `is_establishment_admin()` + policy `profiles_select` étendue (migration `20260901160000_establishment_auth_foundation.sql`) — appliqué en prod
- Edge function `create-establishment-staff` (invite Supabase Auth réel + lien `establishment_users`) — écrite et **déployée en prod** (2026-09-01)
- `EstablishmentAuthContext.jsx` réécrit : `login()`/`logout()` utilisent maintenant `supabase.auth.signInWithPassword`/`signOut` (vraie session), le contexte (établissement + rôle) est dérivé de `establishment_users` + `establishments` via `onAuthStateChange`, plus de session `localStorage` maison

Découverte au passage : `src/lib/EstablishmentProtectedRoute.jsx` (à ne pas confondre avec `ProtectedEstablishmentRoute.jsx`, celui réellement routé dans `App.jsx`) était une tentative précédente et abandonnée de ce même correctif — utilisait déjà `useAuth()` + `establishment_users`, mais n'était importé nulle part.

**Nettoyé (2026-09-01)** : en creusant ce cluster mort, trouvé un vrai bug sur une route live — `/institution/:id/users` (`UserManagement.jsx`) appelait `useEstablishment()` depuis `EstablishmentContext.jsx`, un contexte dont le seul `Provider` vivait dans le `EstablishmentProtectedRoute.jsx` mort, jamais monté dans l'arbre réel. Le hook lève une exception si utilisé hors de son provider → **cette route plantait pour tout utilisateur qui l'atteignait**. En plus, `establishmentService.getEstablishmentUsers()` (appelée par ce composant) n'existait même pas. Corrigé : `UserManagement.jsx` lit maintenant `establishmentId` via `useParams()` (cohérent avec la route `/institution/:id/users`), et `getEstablishmentUsers()` a été ajoutée à `establishmentService.js` (jointure `establishment_users` + `profiles`). Supprimé tout le cluster mort : `EstablishmentProtectedRoute.jsx`, `EstablishmentContext.jsx`, `useEstablishment.js`, `EstablishmentSidebar.jsx`.

Reste à faire dans cette phase :
1. ~~Déployer l'edge function `create-establishment-staff`~~ — fait, déployée en prod
2. ~~Adapter l'UI admin de création de staff~~ — fait : `EstablishmentPasswordManager.jsx` (génération de mot de passe côté client, jamais vérifié par aucun flux de login réel — bcrypt tournait dans le navigateur pour rien) supprimé et remplacé par `EstablishmentStaffInvite.jsx` (email + rôle → appelle l'edge function). Branché dans `EstablishmentForm.jsx` et `EstablishmentEditForm.jsx`.
3. ~~Remplacer `EstablishmentForgotPasswordPage.jsx`~~ — fait : appelle `supabase.auth.resetPasswordForEmail()` (redirige vers `/establishment/set-password`), retiré le texte figé "ac-versailles.fr"
4. ~~Créer la page `/establishment/set-password`~~ — fait : `EstablishmentSetPasswordPage.jsx`, routée dans `App.jsx`. Sert à la fois le lien d'invitation staff et le lien de reset — Supabase échange le token de l'URL en session automatiquement (`detectSessionInUrl: true`), la page ne fait que `supabase.auth.updateUser({ password })`. Calqué sur `UpdatePasswordPage.jsx` déjà utilisé côté utilisateur normal.
**Test effectué (2026-09-01)** : validation en base via une transaction annulée (`BEGIN...ROLLBACK`, aucune donnée résiduelle) — a révélé un vrai bug : la policy `"Establishment admins manage users"` sur `establishment_users` était auto-référentielle (sous-requête sur elle-même), un défaut préexistant dormant depuis toujours (table vide). Corrigé (migration `20260901170000_fix_establishment_users_rls_recursion.sql`) en la faisant passer par `is_establishment_admin()`, comme `is_institution_admin()` le fait déjà côté Institution. Après correction : un membre du staff (`role='admin'`, `status='active'`) voit bien le profil d'un élève de son établissement. Le flux UI complet (email d'invitation → clic → mot de passe → login) reste à tester manuellement en navigateur — hors de portée de cet environnement.

5. ~~Retirer `establishment_staff` et la RPC `verify_establishment_credentials`~~ — fait (2026-09-01, migration `20260901180000_drop_legacy_establishment_staff.sql`) : 0 ligne, aucune référence restante, aucune autre table dépendante.
6. ~~Retirer `establishment_password_history`, `establishment_code_history`~~ — fait (2026-09-01, migration `20260901190000_drop_establishment_activation_history.sql`) : 0 ligne chacune, seul consommateur (`EstablishmentActivationService.activateEstablishment`) jamais appelé nulle part. Le service a été réduit à sa seule méthode encore utilisée (`validateEmailDomain`, pour `EstablishmentEmailsManager.jsx`).
7. ~~Retirer `educational_institutions.activation_password`/`establishment_code`~~ — fait (2026-09-01, migration `20260901200000_drop_dead_activation_columns.sql`). Découverte en creusant : `EstablishmentCodeManager.jsx` générait aussi les valeurs `uai`/`code` (les 2 lignes existantes contiennent des identifiants aléatoires format `EstablishmentCodeGenerator`, pas de vrais UAI officiels) — composant et générateur supprimés. **`uai`/`code` eux-mêmes n'ont pas été retirés** (utilisés par la recherche publique d'établissements, `InstitutionSearchService.js`/`educationDirectoryService.js`) — mais portent aujourd'hui des données factices, pas de vrais UAI. À signaler séparément : il faudra importer de vraies données UAI un jour, ce n'est plus un sujet auth/sécurité mais un sujet qualité de données.

## Phase 2 (texte original) — Décision d'architecture (nécessite ton arbitrage)

Deux options, à choisir avant d'écrire le moindre code :

**Option A — Le login Establishment devient un vrai compte Supabase Auth**
- Le staff établissement obtient un compte `auth.users` normal (email/password via Supabase Auth, pas la RPC maison)
- `establishment_staff` devient une table de rôle liée à `auth.users.id`, plus une table de credentials séparée
- Le dashboard Establishment peut alors utiliser RLS normalement — mais il faut réécrire `EstablishmentAuthContext` entièrement
- Avantage : garde l'UI/UX déjà construite (sidebar, onglets, stats globales déjà câblées)
- Effort : moyen-élevé (réécriture auth + adaptation RLS)

**Option B — Le portail Establishment est abandonné, on migre vers Institution**
- Les routes `/establishment/*` sont retirées ou redirigées vers `/institution/*`
- Le peu de valeur réelle côté Establishment (gestion admin des établissements dans `educational_institutions`) est conservé tel quel — ce n'est pas affecté par le problème de login puisqu'il est utilisé par l'admin interne (authentifié normalement), pas par le portail établissement
- Effort : faible-moyen (suppression de routes/composants, pas de nouvelle auth à construire)

**Recommandation** : Option B, sauf si l'UX du dashboard Establishment (sidebar, onglets) a une valeur design que tu veux récupérer — dans ce cas Option A en réutilisant cette UI mais rebranchée sur une vraie auth.

## Phase 3 — Unification des tables de rattachement (après Phase 2)

Une fois l'option choisie, converger vers une seule table de lien élève/staff↔établissement (candidat : `institution_members`, déjà câblée dans la RLS de `profiles`). Migrer les données de `establishment_users`/`user_institution_links` si elles contiennent quoi que ce soit (aujourd'hui : 0 ligne partout), puis les retirer.

## Phase 4 — Fusion des catalogues d'établissements

Faire converger `institutions` (1 ligne) et `establishments` (0 ligne) vers `educational_institutions` (2 lignes, déjà la table de référence utilisée par l'admin). Migration de données triviale vu le volume actuel (3 lignes au total à vérifier/fusionner à la main).

---

## Ce que je propose comme prochaine étape concrète

Lancer la **Phase 1** maintenant (nettoyage sans risque) pendant que tu réfléchis à la décision de la Phase 2. Je prépare la migration/suppression de fichiers dès que tu valides.
