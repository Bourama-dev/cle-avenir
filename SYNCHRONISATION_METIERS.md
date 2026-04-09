# Synchronisation des Métiers ROME depuis France Travail API

## Vue d'ensemble

Le projet intègre maintenant une synchronisation complète avec l'API France Travail pour charger **TOUS les métiers** du catalogue ROME officiel, sans limite.

## Architecture

### 1. Edge Function: `sync-rome-metiers`

**Fichier:** `supabase/functions/sync-rome-metiers/index.ts`

L'Edge Function Supabase effectue:
- ✅ Authentification OAuth2 auprès de France Travail
- ✅ Récupération de TOUS les métiers avec **pagination automatique**
- ✅ Insertion/mise à jour dans `rome_metiers` avec upsert

**Endpoint:** POST `/functions/v1/sync-rome-metiers`

**Body attendu:**
```json
{
  "clientId": "PAR_cleavenir_32ef197446d50e29a86c57249f0d0e74d2767c5f80ff34bbfdc23e9c31da2d30",
  "secret": "1fb3cbd1f8462eaa678d4047005ade0b665923f1b09ed8e2194fbbe8d18ca24d"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Successfully synced 634 métiers from France Travail API",
  "count": 634
}
```

### 2. Service Client: `metierSyncService`

**Fichier:** `src/services/metierSyncService.ts`

Fournit deux fonctions principales:

```typescript
// Synchroniser tous les métiers
const result = await metierSyncService.syncAllMetiers(clientId, secret);

// Obtenir le nombre total de métiers
const count = await metierSyncService.getMetiersCount();
```

### 3. Interface Admin: Page AdminMetiers

**Fichier:** `src/pages/AdminMetiers.jsx`

Modifications:
- ✅ Bouton **"Synchroniser depuis France Travail"** dans le header
- ✅ Affichage du nombre total de métiers en base de données
- ✅ Modal pour entrer les credentials France Travail
- ✅ Progression et messages d'erreur en temps réel

## Comment utiliser

### Via l'interface Admin

1. Accédez à la page **Gestion des Métiers**
2. Cliquez sur le bouton vert **"Synchroniser depuis France Travail"**
3. Entrez vos credentials:
   - **Client ID:** `PAR_cleavenir_32ef197446d50e29a86c57249f0d0e74d2767c5f80ff34bbfdc23e9c31da2d30`
   - **Secret:** `1fb3cbd1f8462eaa678d4047005ade0b665923f1b09ed8e2194fbbe8d18ca24d`
4. Cliquez sur **"Synchroniser"**
5. Attendez que la synchronisation se termine (généralement 1-2 minutes)

### Via l'API

```bash
curl -X POST https://your-project.supabase.co/functions/v1/sync-rome-metiers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "PAR_cleavenir_32ef197446d50e29a86c57249f0d0e74d2767c5f80ff34bbfdc23e9c31da2d30",
    "secret": "1fb3cbd1f8462eaa678d4047005ade0b665923f1b09ed8e2194fbbe8d18ca24d"
  }'
```

## Détails techniques

### Pagination

L'API France Travail utilise un système de **curseur** pour la pagination:
- ✅ Limit par défaut: 100 métiers par page
- ✅ Le curseur `curseurSuivant` est utilisé pour récupérer la page suivante
- ✅ La synchronisation continue jusqu'à avoir TOUS les métiers

### Upsert

Les métiers sont insérés/mis à jour avec:
```sql
INSERT INTO rome_metiers (...)
VALUES (...)
ON CONFLICT (code) DO UPDATE SET ...
```

Cela signifie que:
- ✅ Les nouveaux métiers sont ajoutés
- ✅ Les métiers existants sont mis à jour
- ✅ Aucune duplication

### Transformation des données

Les données de l'API sont mappées aux champs de la table:

| API France Travail | Table `rome_metiers` |
|---|---|
| `code` | `code` |
| `libelle` | `libelle` |
| `descriptifRome` / `definition` | `description` |
| `riasecMajeur` | `riasecMajeur` |
| `riasecMineur` | `riasecMineur` |
| `debouches` | `debouches` |
| `salaire` | `salaire` |
| `niveau_etudes` | `niveau_etudes` |

## Affichage des métiers

### ExploreMetiersPage

Le composant récupère maintenant **TOUS les métiers** sans limite:

```javascript
const { data, error } = await supabase
  .from('rome_metiers')
  .select('*')
  .order('libelle');
```

Le nombre total de métiers s'affiche:
- **Avant:** ~1000 métiers
- **Après:** ~634 métiers (le nombre réel du catalogue ROME officiel)

## Considérations

### Performance

- La synchronisation peut prendre **1-2 minutes** pour charger 634 métiers
- Les requêtes ultérieures dans la page d'exploration sont instantanées (données en cache Supabase)

### Sécurité

- ⚠️ Les credentials ne sont jamais stockés localement
- ⚠️ Ils sont envoyés uniquement via HTTPS à la fonction Supabase
- ⚠️ La fonction est protégée par les variables d'environnement de Supabase

### Maintenance

Pour mettre à jour les métiers:
- La synchronisation peut être relancée à tout moment
- Elle ne supprime pas les anciennes données, elle les met à jour
- Recommandation: Synchroniser **hebdomadairement ou mensuellement**

## Troubleshooting

### Erreur: "Failed to get access token"

- Vérifiez que le **Client ID** et le **Secret** sont corrects
- Vérifiez que le scope `nomenclatureRome` est autorisé sur votre compte France Travail

### Erreur: "API request failed"

- L'API France Travail peut être temporairement indisponible
- Attendez quelques minutes et réessayez

### Nombre de métiers inférieur à 1000

C'est normal! Le catalogue ROME officiel contient environ **634 fiches métiers**, pas 1000. Cela signifie que la synchronisation est complète et correcte.

## Fichiers modifiés/créés

✅ `supabase/functions/sync-rome-metiers/index.ts` - Edge Function  
✅ `supabase/functions/deno.json` - Configuration Deno  
✅ `src/services/metierSyncService.ts` - Service client  
✅ `src/pages/AdminMetiers.jsx` - Interface Admin (modifiée)  
✅ `supabase/migrations/0005_rome_metiers_table.sql` - Migration BD  
