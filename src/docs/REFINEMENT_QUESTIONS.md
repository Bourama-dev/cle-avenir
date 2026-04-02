# Documentation des Questions de Raffinement (Q23 - Q27)

## Objectif Global
Les questions 23 à 27 ont été ajoutées pour agir comme des **"questions de raffinement stratégiques"**. Leur objectif est de corriger les faux positifs et faux négatifs fréquemment observés lors de l'attribution des dimensions et de la sélection des métiers pour les utilisateurs. 

En utilisant des pondérations élevées (2.0 à 2.5) et des valeurs négatives sur certaines dimensions concurrentes, ces questions créent une "démarcation nette" entre des profils qui pourraient autrement sembler similaires à cause de réponses génériques.

---

## 1. Q23: "Préférez-vous créer quelque chose de nouveau ou analyser/optimiser quelque chose d'existant ?"
* **Poids :** 2.5 (Impact Fort)
* **Dimensions Couvertes :** `creativite`, `analytique`, `innovation`, `rigueur`
* **Justification :** Beaucoup d'utilisateurs apprécient la technologie (Q1) et l'innovation, ce qui conduit souvent l'algorithme à mélanger développeur (analytique) et designer (créativité). 
* **Réduction des Erreurs :** 
  * Évite les faux positifs (ex: proposer Comptable ou Data Analyst à un profil purement créatif).
  * Les poids négatifs (`analytique: -20` pour "Créer de zéro" et `creativite: -20` pour "Optimiser") forcent la séparation mathématique des deux dimensions.

## 2. Q24: "Quelle est votre préférence pour le travail en équipe ?"
* **Poids :** 2.0 (Impact Moyen-Fort)
* **Dimensions Couvertes :** `autonomie`, `equipe`, `relationnel`
* **Justification :** Le travail en équipe est souvent sélectionné par défaut par "désirabilité sociale", ce qui pollue le profil des travailleurs solitaires.
* **Réduction des Erreurs :**
  * Évite de recommander des métiers à forte composante sociale (RH, Commercial) à des profils qui performent mieux seuls (Développeur Freelance, Artisan).
  * L'option "100% en autonomie" pénalise fortement `equipe` (-30) pour garantir une élimination des métiers incompatibles.

## 3. Q25: "Quel environnement de travail vous attire le plus ?"
* **Poids :** 2.0 (Impact Moyen-Fort)
* **Dimensions Couvertes :** `environnement`, `pratique`, `construction`, `rigueur`, `analytique`
* **Justification :** Les dimensions liées aux métiers manuels ou de terrain (`pratique`, `construction`) étaient sous-représentées dans les questions 1-10.
* **Réduction des Erreurs :**
  * Réduit les faux négatifs pour les métiers de l'artisanat, du bâtiment, de la biologie de terrain ou de l'agriculture. 
  * "Terrain / Extérieur" booste massivement `environnement` (80) et `pratique` (60).

## 4. Q26: "Comment gérez-vous l'incertitude et les changements ?"
* **Poids :** 2.5 (Impact Fort)
* **Dimensions Couvertes :** `risque`, `innovation`, `autonomie`, `rigueur`, `analytique`
* **Justification :** Le goût du risque et l'innovation sont essentiels pour séparer les profils entrepreneuriaux des profils administratifs. 
* **Réduction des Erreurs :**
  * Empêche de proposer des carrières de type Startup ou Indépendant à des profils nécessitant un cadre rigide (`rigueur`).
  * Les options polarisent `risque` (90 vs -40) et `rigueur` (-20 vs 80), clarifiant instantanément l'appétence à la prise de décision en environnement incertain.

## 5. Q27: "Quelle est votre priorité professionnelle principale ?"
* **Poids :** 2.5 (Impact Fort)
* **Dimensions Couvertes :** `bien_etre`, `creativite`, `relationnel`, `commerce`, `education`, `autonomie`
* **Justification :** La motivation finale dicte le succès d'une orientation. Cette question aligne les valeurs profondes avec le scoring.
* **Réduction des Erreurs :**
  * Consolide les dimensions secondaires. Si un profil a un score moyen partout, cette question applique un boost final décisif. Par exemple, choisir "Salaire" va booster le `commerce` (90) et garantir la proposition de postes rémunérateurs (Finance, Vente).

---

## Intégration dans le Service de Calcul (buildUserVector.js)
Le fichier `src/services/buildUserVector.js` a été mis à jour pour supporter ces pondérations stratégiques. 
* La fonction `buildUserVector` utilise maintenant un `clamp` permettant au `questionWeight` de monter jusqu'à **3.0**. 
* L'ajout se fait via une simple multiplication : `rawVector[key] += Number(weights[key]) * questionWeight;`.

## Cas de Test & Améliorations Attendues
**Profil Test : "Créatif & Innovant"**
* **Avant :** L'algorithme renvoyait parfois "Analyste de Données" si l'utilisateur cochait "Télétravail" (Q3) et "Technologie" (Q1).
* **Après :** Avec Q23 (Créer de zéro -> `analytique: -20`) et Q27 (Créativité -> `creativite: 90`), le score d'`analytique` chute drastiquement par rapport à `creativite`. Le système renverra correctement "UX/UI Designer" ou "Directeur Artistique".