# Liste de Contrôle : Flux de Test d'Orientation Hybride

Ce document décrit le flux complet du test d'orientation, de la réponse aux questions jusqu'à l'apprentissage par renforcement.

## 1. Démarrage du Test (`TestOrientationPage.jsx`)
- [x] L'utilisateur répond aux questions.
- [x] Chaque réponse sauvegarde un objet contenant `questionId` et `answerId`.
- [x] La progression est visible (barre de progression).
- [x] Possibilité de revenir à la question précédente.
- [x] Confirmation finale avant soumission.
- [x] Les réponses brutes sont persistées dans la table `test_results` via Supabase.

## 2. Génération du Vecteur (`buildUserVector.js`)
- [x] Initialisation d'un vecteur nul sur 22 dimensions.
- [x] Ajout des poids (`weights`) des réponses multipliés par le poids de la question.
- [x] Calcul de la magnitude totale et application de la **Normalisation L2** (norme = 1).
- [x] Projection des 22 dimensions vers le modèle **RIASEC**.
- [x] Renvoi des données enrichies : `rawVector`, `normalizedVector`, `riasec`, `metadata`.

## 3. Moteur de Scoring (`scoreROME.js`)
- [x] Extraction des vecteurs métiers depuis la base ROME.
- [x] Calcul de la **Similarité Cosinus** entre le profil RIASEC utilisateur et les métiers.
- [x] Calcul de la moyenne et de l'écart-type pour application du **Z-Score**.
- [x] Filtrage : `zScore > 0` (conservation des métiers au-dessus de la moyenne).
- [x] Récupération des statistiques comportementales (`getCareerStats`).
- [x] Calcul du **Boost comportemental** plafonné à +0.15.
- [x] Tri final basé sur `zScore + boost`.

## 4. Affichage des Résultats (`TestResultsPage.jsx`)
- [x] **Section Profil** : Affichage d'un graphique Radar (Recharts) pour le RIASEC.
- [x] **Section Dimensions** : Barres de progression pour le Top 10 des dimensions L2.
- [x] **Section Métiers** : Cartes des 15 métiers avec scores détaillés (Z-Score + Boost).
- [x] **Section Actions** : Boutons *Détails*, *Favoris*, *Choisir* opérationnels.
- [x] **Section Stats** : Affichage inline des vues, clics, likes, choix pour chaque métier.
- [x] **Section Graphe** : Graphique en barres empilées montrant la part mathématique et comportementale du score final.

## 5. Interactions et Statistiques (`careerStats.js`)
- [x] L'affichage d'un métier incrémente `total_shown` en base.
- [x] Un clic sur "Détails" incrémente `total_clicked`.
- [x] Un clic sur "Favoris" incrémente `total_liked`.
- [x] Un clic sur "Choisir" incrémente `total_chosen`.

## 6. Boucle d'Apprentissage (`reinforceCareer.js`)
- [x] Sélection d'un métier par l'utilisateur déclenche la fonction d'apprentissage.
- [x] Appel à la fonction RPC PostgreSQL `reinforce_career_dimensions`.
- [x] Le vecteur L2 normalisé de l'utilisateur est injecté dans le JSONB `adjusted_weights` du métier.
- [x] Cap de sécurité appliqué (max +0.2 global par dimension, incrément de +2% du vecteur user).

## 🛠 Outil de Débogage (`TestFlowDebugger.jsx`)
Un panneau caché a été mis en place pour valider chaque étape en direct.
- **Activation :** Appuyer sur `Ctrl + Shift + D`.
- **Fonctionnalités :** 
  - Visualisation de l'état du test (Question N/Total).
  - Inspection JSON du vecteur L2 et des scores RIASEC bruts.
  - Détail des scores (Raw, Z-Score, Boost) des métiers recommandés.
  - Simulation de clics, likes et choix pour tester la BDD.
  - Logs en temps réel des actions API.