# 📚 Guide: Utiliser les Formations ONISEP sur /formations

## Vue d'ensemble

La page `/formations` affiche maintenant les formations de **deux sources** :
- **Parcoursup** (formations initiales officielles)
- **ONISEP** (formations publiques + professionnelles)

## 🎯 Comment utiliser

### 1. **Accéder à la page des formations**
```
https://votre-app.com/formations
```

### 2. **Filtrer par source**

En haut des résultats, vous verrez 3 badges :

**Parcoursup** 🔵
- Formations initiales officielles
- Données de Parcoursup API
- Cliquez pour voir uniquement Parcoursup

**ONISEP** 🟣
- Formations publiques et professionnelles
- Données ONISEP
- Plus large couverture

**Toutes les sources** 🟡
- Combine les deux sources
- Affiche tous les résultats
- **Option par défaut**

### 3. **Rechercher**

La recherche fonctionne avec les deux sources :
```
Rechercher: "BTS Informatique"
→ Affiche BTS d'ONISEP ET de Parcoursup
```

### 4. **Filtrer par critères**

Les filtres existants fonctionnent avec les deux sources :

- **Secteur** : Informatique, Santé, Commerce, etc.
- **Niveau** : BAC, BAC+2, BAC+3, BAC+5, etc.
- **Type** : Initial, Alternance
- **Distance** : Par rapport à votre ville
- **À distance** : Formations en ligne

## 📊 Données disponibles

### Formations Parcoursup
- Intitulé
- Établissement
- Localisation
- Domaine/Secteur
- Codes ROME associés

### Formations ONISEP
- Nom
- Niveau (BAC, BAC+2, etc.)
- Secteur (Informatique, Santé, etc.)
- Type (Formation, BTS, Licence, Master, etc.)
- Durée
- URL ONISEP
- Sigle/Acronyme

## 💡 Cas d'utilisation

### Chercher UNIQUEMENT les formations de haut niveau
1. Cliquez sur **ONISEP**
2. Sélectionnez niveau **BAC+3** ou **BAC+5**
3. Recherchez par secteur

### Comparer deux sources
1. Recherchez "Formation X"
2. Cliquez **Parcoursup** → notez les résultats
3. Cliquez **ONISEP** → comparez
4. Cliquez **Toutes les sources** → voir tous les résultats

### Trouver des alternances
1. Laissez **Toutes les sources** activé
2. Sélectionnez **Type: Alternance**
3. Combinez avec secteur/niveau souhaité

## 🔄 Architecture technique

```
FormationsPage
├── sourceFilter (state)
│   ├── 'parcoursup'
│   ├── 'onisep'
│   └── 'both'
├── unifiedFormationsService
│   ├── fetchFormations(source, params)
│   ├── fetchParcoursupFormations(params)
│   └── fetchOnisepFormations(params)
└── filteredFetchedData (useMemo)
    ├── sectorFilter
    ├── levelFilter
    ├── formationTypeFilter
    └── distanceFilter
```

## 📝 Notes importantes

### Limitation actuellement
- La pagination charge les données par batch (100 formations à la fois)
- Quand vous cliquez "Charger plus", il charge du même lot pour les deux sources

### Performance
- Les recherches ONISEP utilisent la base de données locale
- Les recherches Parcoursup utilisent l'API externe
- Switching entre sources est instantané (pas de re-fetch nécessaire)

### Normalisation des données
Tous les champs sont normalisés pour fonctionner avec les deux sources :
- `libelle_formation` (Parcoursup) → `name` (ONISEP)
- `sector` (standardisé pour les deux)
- `level` (standardisé: BAC, BAC+2, etc.)

## 🚀 Prochaines étapes pour améliorer

- [ ] Ajouter filtre "Durée" (2 ans, 3 ans, etc.)
- [ ] Ajouter filtre "Modalité" (présentiel, distanciel, hybride)
- [ ] Afficher la source dans chaque card de formation
- [ ] Ajouter statistiques: "X formations Parcoursup, Y formations ONISEP"
- [ ] Permettre de sauvegarder les favoris (compatible avec les deux sources)
- [ ] Intégrer les recommandations du test RIASEC

## ❓ Dépannage

### Aucune formation ne s'affiche pour ONISEP
→ Vérifiez que les migrations ont été appliquées et les données importées (voir `/docs/ONISEP_INTEGRATION.md`)

### Les filtres ne fonctionnent pas correctement
→ Vérifiez que les champs `sector` et `level` sont remplis dans la base ONISEP

### La recherche est lente
→ Cela peut être dû à l'API Parcoursup. Essayez de chercher uniquement ONISEP

## 📞 Support

Pour plus d'informations :
- Voir `/docs/ONISEP_INTEGRATION.md` pour l'infrastructure
- Voir source code: `src/services/unifiedFormationsService.js`
- Voir page: `src/pages/FormationsPage.jsx`
