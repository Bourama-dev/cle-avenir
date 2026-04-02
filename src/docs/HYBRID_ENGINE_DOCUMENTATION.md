# CléAvenir - Moteur de Recommandation Hybride Auto-Apprenant

**Description :** Système scientifiquement cohérent combinant la psychométrie, la similarité vectorielle, les statistiques adaptatives et l'apprentissage par renforcement.

---

## 1️⃣ Collecte des réponses
Le point de départ du moteur d'analyse :
* L'utilisateur répond aux questions du test d'orientation.
* Chaque réponse contient des poids associés à des dimensions spécifiques (ex: *tech: 90, analytique: 50*).
* Chaque question possède également un **poids global** qui reflète son importance stratégique dans le test.
* **Résultat :** Réponses de l'utilisateur → Somme pondérée par l'importance des questions → *Vecteur utilisateur brut*.

## 2️⃣ Construction du vecteur utilisateur
Le vecteur de l'utilisateur est construit pour permettre des calculs mathématiques précis.
* **Fichier :** `buildUserVector.js`
* **Processus :**
  1. Initialisation d'un vecteur vide (22 dimensions).
  2. Addition des poids des réponses multipliés par le poids de la question.
  3. **Normalisation L2** (Euclidienne) pour que la longueur du vecteur soit égale à 1.
* **Formule :** `dimension_norm = value / √(Σ values²)`
* **Résultat :** `{ "dimensions": { ...norm = 1 }, "riasec": { R, I, A, S, E, C } }`
* **Note :** Le vecteur obtenu est mathématiquement stable et permet de comparer tous les utilisateurs de manière équitable.

## 3️⃣ Projection RIASEC
Les dimensions psychométriques brutes sont projetées sur le standard scientifique RIASEC pour vulgariser le profil et améliorer le matching.

| Type RIASEC | Dimensions CléAvenir |
| :--- | :--- |
| **R** (Réaliste) | pratique, construction, sport |
| **I** (Investigateur) | analytique, tech, innovation |
| **A** (Artistique) | art, créativité |
| **S** (Social) | relationnel, éducation, santé |
| **E** (Entreprenant) | commerce, leadership, marketing |
| **C** (Conventionnel) | rigueur, droit |

* **Utilité :** Expliquer le profil à l'utilisateur de façon standardisée, ajouter une cohérence scientifique et servir de base secondaire au matching.

## 4️⃣ Récupération métiers ROME
Le système utilise la base de données officielle du gouvernement.
* **Table Supabase :** `public.rome_metiers`
* **Contenu par métier :** Chaque métier contient son RIASEC Majeur, son RIASEC Mineur, des `adjusted_weights` (poids ajustés via le machine learning), ses compétences mobilisées et les métiers en proximité.

## 5️⃣ Construction du vecteur métier
Pour comparer l'utilisateur aux métiers, chaque métier doit devenir un vecteur de même nature.
* **Fonction :** `buildCareerVectorFromROME()`
* **Logique d'attribution :**
  * RIASEC Majeur → +1.0 (ou +0.7 selon la calibration)
  * RIASEC Mineur → +0.5 (ou +0.3 selon la calibration)
  * `adjusted_weights` (JSONB) → Ajout dynamique des dimensions apprises
* **Résultat :** Chaque métier devient un vecteur mathématique directement comparable avec le vecteur de l'utilisateur.

## 6️⃣ Similarité vectorielle
Comparaison purement mathématique des profils.
* **Formule (Cosinus) :** `cosine(u, m) = (u · m) / (||u|| × ||m||)`
* **Résultat :** Un score de proximité compris entre `0` (aucun point commun) et `1` (correspondance parfaite).

## 7️⃣ Normalisation inter-métiers (Z-Score)
La similarité brute ne suffit pas, car certains utilisateurs ont des scores globalement très faibles ou très hauts.
* **Calcul :** `z = (score - mean) / std_dev`
* **Pourquoi :** Empêche un métier de ressortir simplement parce que tous les autres sont artificiellement faibles. Cela permet de ne garder que les métiers qui se détachent *réellement* de la moyenne de l'utilisateur.
* **Filtre appliqué :** Seuls les métiers avec un `zScore > 0` (au-dessus de la moyenne) sont retenus.

## 8️⃣ Couche adaptative comportementale
Le système observe le comportement global de la communauté pour ajuster la popularité et la pertinence perçue.
* **Table :** `career_statistics`
* **Calcul du boost :** `boost = (chosenRate × 0.5 + likeRate × 0.3 + clickRate × 0.2) × 0.15`
* **Limite :** Capped à `+0.15` au maximum pour ne pas écraser le matching scientifique psychométrique.
* **Application :** Ce boost comportemental est ajouté au `zScore` final.

## 9️⃣ Apprentissage dimensionnel direct
C'est le cœur du système auto-apprenant (Reinforcement Learning léger).
* **Quand :** Lorsqu'un utilisateur sélectionne/choisit un métier (validation de son intérêt profond).
* **Processus :** Le vecteur de l'utilisateur (normalisé) est injecté directement dans le métier : `adjusted_weights += user_vector × 0.02`
* **Limite de sécurité :** Max cap défini à `0.2` par dimension.
* **Effet :** Le métier évolue de manière fluide et progressive vers le profil type des personnes qui le choisissent réellement dans le monde réel.

## 🔟 Résultat final
La compilation de toute la chaîne de valeur.
* **Ce que le moteur retourne :** Le top 15 des métiers recommandés, triés par le score final (Z-Score + Boost adaptatif).
* **Basé sur :** Une combinaison puissante de similarité mathématique, distribution statistique, performance comportementale et apprentissage progressif.

## 🧠 Ce que le moteur fait réellement
En combinant ces méthodes, le moteur hybride rassemble :
* La psychométrie fondamentale.
* La similarité vectorielle spatiale.
* Les statistiques adaptatives basées sur l'usage.
* L'apprentissage par renforcement léger.
* L'exploitation intelligente des données gouvernementales ROME.
* Une base de données auto-calibrée et évolutive.

## 📊 En résumé
Avec cette architecture, le test CléAvenir est désormais :
1. **Scientifiquement cohérent** (dimensions projetées sur des standards).
2. **Mathématiquement stable** (norme L2 et Z-Scores).
3. **Basé sur des données officielles** (fiche métier ROME, France Travail).
4. **Auto-apprenant et évolutif** (adaptation aux choix des utilisateurs réels).
5. **Prêt pour le futur** (compatible avec les futurs modèles de Machine Learning supervisé).

## 🏗️ Architecture globale

Voici le flux complet du cycle de recommandation :