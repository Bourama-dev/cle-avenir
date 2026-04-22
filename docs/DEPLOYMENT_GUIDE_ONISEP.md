# 🚀 Guide de Déploiement - Intégration ONISEP

## 📋 Table des matières

1. [Avant de déployer](#avant-de-déployer)
2. [Étapes de déploiement](#étapes-de-déploiement)
3. [Configuration Supabase](#configuration-supabase)
4. [Importer les formations](#importer-les-formations)
5. [Vérifier l'intégration](#vérifier-lintégration)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Avant de déployer

### Prérequis
- ✅ Accès à Supabase (votre project)
- ✅ CLI Supabase installée (`supabase-cli`)
- ✅ Git et branches mises à jour
- ✅ Permissions admin pour déployer

### Changements à appliquer
Les fichiers suivants ont été créés/modifiés :

```
✅ Créés:
  - supabase/functions/sync-onisep-formations/index.ts
  - supabase/migrations/0006_enrich_formations_table.sql
  - src/services/onisepSyncService.js
  - src/services/unifiedFormationsService.js
  - src/scripts/syncOnisepFormations.js
  - docs/ONISEP_INTEGRATION.md
  - docs/USING_ONISEP_FORMATIONS.md

✅ Modifiés:
  - src/pages/FormationsPage.jsx (+ filtre source)
  - src/components/admin/AdminFormationManager.jsx (+ UI sync)
  - src/services/index.realData.js (+ export onisepSyncService)
  - src/App.jsx (+ route /admin/manage)
```

---

## 🔧 Étapes de déploiement

### **Étape 1: Appliquer la migration database** (Critical)

```bash
# Appliquer la migration à votre Supabase
supabase db push

# Ou en ligne de commande:
supabase db push --project-ref YOUR_PROJECT_REF
```

**Ce que fait cette migration:**
- Crée/enrichit la table `formations` avec les colonnes ONISEP
- Ajoute les indexes pour performance
- Configure les Row Level Security (RLS)
- Crée les triggers pour updated_at

### **Étape 2: Déployer la Supabase Edge Function**

```bash
# Depuis la racine du projet
supabase functions deploy sync-onisep-formations

# Ou avec project ref:
supabase functions deploy sync-onisep-formations --project-ref YOUR_PROJECT_REF
```

**Ce que fait cette fonction:**
- Récupère les données de l'API ONISEP (publique, gratuite)
- Les synchronise avec votre base de données Supabase
- Gère les doublons automatiquement
- Retourne les statistiques

### **Étape 3: Merger le code dans main**

```bash
# Créez une Pull Request sur GitHub
git push origin claude/add-training-data-ZY2k7

# Puis mergez après review:
git checkout main
git pull origin main
git merge origin/claude/add-training-data-ZY2k7
git push origin main
```

### **Étape 4: Déployer votre app (si nécessaire)**

Si vous utilisez Vercel ou un autre service:
```bash
# Vercel déploie automatiquement depuis main
# Ou déployez manuellement si nécessaire
```

---

## 📊 Configuration Supabase

### Vérifier la migration

```sql
-- Connectez-vous à Supabase SQL Editor et exécutez:
SELECT * FROM information_schema.columns 
WHERE table_name = 'formations';

-- Vous devriez voir les colonnes:
-- id, name, title, slug, description, level, duration,
-- sector, type, url, sigle, external_id, source, metadata,
-- rating, popularity, created_at, updated_at
```

### Vérifier la fonction edge

```sql
-- Vérifier que la fonction existe
SELECT * FROM information_schema.routines 
WHERE routine_name = 'sync-onisep-formations';
```

---

## 📚 Importer les formations

### **Option 1: Via interface Admin** (Recommandé) ⭐

1. Allez sur **https://votre-app.com/admin/manage**
   - (Vous serez redirigé depuis /admin)

2. Cliquez sur l'onglet **"Formations"** 

3. Cliquez le bouton **"Importer ONISEP"** 🎓

4. Attendez la synchronisation (30-60 secondes)

5. Vous verrez:
   - ✅ Nombre de formations récupérées
   - ✅ Nombre ajoutées à la DB
   - ⚠️ Erreurs si présentes

### **Option 2: Via script CLI**

```bash
# Sync 100 formations
node src/scripts/syncOnisepFormations.js 100 0

# Sync 100 formations suivantes
node src/scripts/syncOnisepFormations.js 100 100

# Sync toutes les formations (en plusieurs batch)
for i in {0..1000..100}; do
  node src/scripts/syncOnisepFormations.js 100 $i
  sleep 2  # Rate limiting
done
```

### **Option 3: Via code JavaScript**

```javascript
// Dans votre application
import { onisepSyncService } from '@/services/onisepSyncService';

const result = await onisepSyncService.syncFormationsFromOnisep({
  limit: 100,
  offset: 0,
  syncToDb: true
});

console.log(`Synced: ${result.synced} formations`);
console.log(`Total: ${result.total} formations retrieved`);
```

---

## ✅ Vérifier l'intégration

### 1. Vérifier les données en base

```sql
-- Nombre de formations ONISEP importées
SELECT COUNT(*) FROM formations WHERE source = 'onisep';

-- Secteurs disponibles
SELECT DISTINCT sector FROM formations WHERE source = 'onisep';

-- Niveaux disponibles
SELECT DISTINCT level FROM formations WHERE source = 'onisep';
```

### 2. Tester sur la page /formations

1. Allez sur **https://votre-app.com/formations**

2. Vous devriez voir le **filtre source** en haut:
   - 🔵 Parcoursup
   - 🟣 ONISEP
   - 🟡 Toutes les sources

3. Cliquez **"ONISEP"** et recherchez une formation

4. Essayez les filtres:
   - Par secteur (Informatique, Santé, etc.)
   - Par niveau (BAC, BAC+2, BAC+3, etc.)
   - Par type (Formation, BTS, Licence, etc.)

### 3. Tester l'admin

1. Allez sur **https://votre-app.com/admin/manage**

2. Vous devriez voir les onglets:
   - Blogs ✍️
   - **Formations** 🎓 ← C'est ici!
   - Métiers 💼
   - Offres 📋

3. Cliquez **"Importer ONISEP"** et vérifiez:
   - Le bouton se charge
   - Un dialogue affiche les résultats
   - Vous voyez les statistiques

---

## 🔍 Vérifier les données

### Via Supabase Dashboard

1. Allez sur **Supabase Console** → **SQL Editor**

2. Exécutez:
```sql
-- Voir quelques formations ONISEP
SELECT id, name, level, sector, type, source 
FROM formations 
WHERE source = 'onisep' 
LIMIT 10;

-- Statistiques par niveau
SELECT level, COUNT(*) as count
FROM formations
WHERE source = 'onisep'
GROUP BY level
ORDER BY count DESC;

-- Statistiques par secteur
SELECT sector, COUNT(*) as count
FROM formations
WHERE source = 'onisep'
GROUP BY sector
ORDER BY count DESC
LIMIT 10;
```

### Via l'UI de l'application

1. Allez sur **https://votre-app.com/admin/manage**

2. Onglet **Formations**

3. Vous verrez la liste de toutes les formations (Parcoursup + ONISEP mélangées)

4. Chaque ligne affichera:
   - Titre
   - Provider/Source
   - Niveau
   - Actions (Modifier/Supprimer)

---

## ⚠️ Troubleshooting

### Aucune formation ne s'affiche

**Cause possible:** Migration non appliquée ou fonction non déployée

**Solution:**
```bash
# 1. Vérifier les migrations
supabase migration list

# 2. Réappliquer si nécessaire
supabase db push

# 3. Vérifier la function
supabase functions list
```

### La pagination dit "Charger plus" mais rien ne charge

**Cause:** La fonction edge ne retourne pas les résultats

**Solution:**
```bash
# 1. Vérifier les logs de la fonction
supabase functions logs sync-onisep-formations

# 2. Redéployer la fonction
supabase functions deploy sync-onisep-formations --force
```

### Erreur "ONISEP API error"

**Cause:** L'API ONISEP est temporairement indisponible

**Solution:**
- Attendez quelques minutes
- Essayez à nouveau
- (L'API ONISEP est très stable, c'est rare)

### Les filtres ne marchent pas

**Cause:** Les colonnes `sector` ou `level` ne sont pas remplies

**Solution:**
```sql
-- Vérifier les données
SELECT COUNT(*) FROM formations WHERE source = 'onisep' AND sector IS NULL;
SELECT COUNT(*) FROM formations WHERE source = 'onisep' AND level IS NULL;

-- Si c'est vide, réimporter les données
```

### Très peu de formations importées

**Cause:** ONISEP n'a peut-être pas beaucoup de données ou le rate limiting

**Solution:**
- Essayez d'importer à nouveau (une autre session)
- Vérifiez que vous lancez depuis `/admin` avec le bouton
- Vérifiez les erreurs dans le dialogue de résultats

---

## 📈 Prochaines étapes

Après le déploiement réussi:

- [ ] Annoncer à vos utilisateurs les nouvelles formations ONISEP
- [ ] Configurer un import automatique hebdomadaire (futur)
- [ ] Ajouter des statistiques ONISEP au dashboard
- [ ] Intégrer ONISEP avec les recommandations RIASEC
- [ ] Exporter les formations pour des analyses

---

## 📞 Support & Questions

Pour des questions:
- Consultez `/docs/ONISEP_INTEGRATION.md` (architecture)
- Consultez `/docs/USING_ONISEP_FORMATIONS.md` (utilisation)
- Consultez les logs Supabase pour les erreurs
- Vérifiez le code dans `/src/services/onisepSyncService.js`

---

## ✨ Résumé de commandes

```bash
# Clone/fetch la branche
git fetch origin claude/add-training-data-ZY2k7
git checkout claude/add-training-data-ZY2k7

# Appliquer migration
supabase db push

# Déployer fonction edge
supabase functions deploy sync-onisep-formations

# Merger et déployer
git checkout main
git merge origin/claude/add-training-data-ZY2k7
git push origin main

# Vérifier en ligne
# https://votre-app.com/formations (voir le filtre source)
# https://votre-app.com/admin/manage (importer via UI)
```

---

**🎉 Vous êtes prêt à déployer! Bon courage!**
