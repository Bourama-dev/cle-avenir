# Plan de consolidation — systèmes établissement/institution en doublon

Contexte complet dans l'historique de session du 2026-09-01. Résumé des faits établis :

- **3 tables/catalogues distincts pour la même notion d'établissement** : `educational_institutions` (annuaire, vivant), `establishments`/`establishment_*` (comptes établissement, login maison hors Supabase Auth), `institutions`/`institution_*` (comptes établissement, login via Supabase Auth réel).
- **3 tables de rattachement élève↔établissement différentes** : `institution_members` (staff/prof), `establishment_users` (signup), `user_institution_links` (utilisée par le dashboard Establishment).
- Le contrôle d'accès RLS sur `profiles` (qui peut voir les profils élèves) ne repose QUE sur `institution_members`/`is_institution_admin()`.
- Le login Establishment ne crée pas de session Supabase Auth → toute requête RLS émise depuis ce portail échoue silencieusement (`auth.uid()` est `null`).
- Les 10 services `src/services/analytics/Establishment*.js` sont **100% mock** (aucun appel Supabase réel), malgré leur volume de code.

## Décision produit requise avant toute exécution

Avant la Phase 2, il faut trancher une question que je ne peux pas déduire du code : **"établissement" et "institution" désignent-ils le même concept produit**, ou y a-t-il une distinction métier voulue (ex: lycées vs universités, gratuit vs partenaire) ? Tout ce plan suppose que c'est un doublon accidentel (deux constructions successives du même besoin). Si ce n'est pas le cas, arrêter ici et clarifier d'abord.

## Phase 1 — Nettoyage sans risque (exécutable immédiatement)

Aucun impact utilisateur : code/données jamais fonctionnels.

1. Supprimer les 10 fichiers `src/services/analytics/Establishment*.js` (mock pur) et les composants d'onglets du dashboard Establishment qui ne consomment que ces mocks (`EstablishmentCareersTab.jsx`, `EstablishmentClassesTab.jsx`, `EstablishmentRecommendationsTab.jsx`, `EstablishmentTrendsTab.jsx`, `EstablishmentTestResultsTab.jsx` — à vérifier un par un lesquels sont 100% mock vs partiellement réels)
2. Documenter dans ce fichier ce qui a été retiré et pourquoi (pour éviter qu'un futur dev croie qu'une régression a eu lieu)

**Risque** : nul — code mort/factice, zéro donnée réelle affectée.

## Phase 2 — Décision d'architecture (nécessite ton arbitrage)

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
