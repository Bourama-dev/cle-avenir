# 🎓 ONISEP Formation Data Integration

## Overview

This integration allows you to import French formation/training programs from the **ONISEP API** (Office National d'Information Sur les Enseignements et les Professions) directly into your Cle-Avenir database.

**ONISEP** provides comprehensive data on:
- High school formations (Lycée)
- Post-secondary training programs
- Professional development courses
- Apprenticeships (Alternance)

## Features

✅ **Free Public API** - No authentication required  
✅ **Complete Integration** - Supabase Edge Function for secure API calls  
✅ **Admin Dashboard** - Import formations with one click  
✅ **Database Sync** - Automatic storage and indexing  
✅ **Search & Filter** - Full-text search by level, sector, type  

## Architecture

### Components

1. **Supabase Edge Function** (`sync-onisep-formations`)
   - Fetches data from ONISEP public API
   - Handles pagination and filtering
   - Syncs to Supabase database

2. **Database Migration** (`0006_enrich_formations_table.sql`)
   - Extends formations table with necessary fields
   - Adds indexes for performance
   - Sets up RLS policies

3. **Frontend Service** (`onisepSyncService.js`)
   - Triggers synchronization
   - Searches formations
   - Retrieves statistics

4. **Admin Component** (`AdminFormationManager.jsx`)
   - UI for importing formations
   - Shows sync results and statistics
   - Manages formations manually

## Database Schema

### Formations Table

```sql
CREATE TABLE formations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,              -- Formation name
  title TEXT,                       -- Alternative title
  slug TEXT UNIQUE,                 -- URL-friendly identifier
  description TEXT,                 -- Formation description
  level TEXT,                       -- e.g., "Bac", "Bac+2", "Master"
  duration TEXT,                    -- Duration (e.g., "2 years")
  sector TEXT,                      -- Sector/domain
  type TEXT,                        -- Type of formation
  url TEXT,                         -- External URL
  sigle TEXT,                       -- Acronym
  external_id TEXT,                 -- ONISEP ID
  source TEXT,                      -- Data source (e.g., "onisep")
  metadata JSONB,                   -- Raw ONISEP data
  rating DECIMAL,                   -- User rating
  popularity INTEGER,               -- Popularity score
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT unique_external_source UNIQUE(external_id, source)
);
```

## Usage

### Option 1: Admin Dashboard

1. Navigate to the **Admin Panel**
2. Go to **Gestion des Formations** (Formation Management)
3. Click **Importer ONISEP** (Import ONISEP)
4. Wait for the sync to complete
5. View results and statistics

### Option 2: Script

```bash
# Sync first 100 formations
node src/scripts/syncOnisepFormations.js 100 0

# Sync next 50 formations
node src/scripts/syncOnisepFormations.js 50 100
```

### Option 3: Service API

```javascript
import { onisepSyncService } from '@/services/onisepSyncService';

// Start synchronization
const result = await onisepSyncService.syncFormationsFromOnisep({
  limit: 100,
  offset: 0,
  secteur: 'Informatique', // Optional
  niveau: 'Bac+2',          // Optional
  syncToDb: true
});

// Search formations
const formations = await onisepSyncService.searchFormations('informatique', {
  level: 'Bac+2',
  sector: 'Informatique',
  limit: 20
});

// Get available sectors
const sectors = await onisepSyncService.getAvailableSectors();

// Get statistics
const stats = await onisepSyncService.getOnisepStats();
```

## API Response Format

The ONISEP API returns formations in this format:

```javascript
{
  id: "12345",
  libelle: "BTS Informatique",
  intitule: "BTS Informatique",
  description: "Formation en informatique...",
  niveau: "Bac+2",
  duree: "2 ans",
  secteur: "Informatique",
  domaine: "Secteur tertiaire",
  type: "BTS",
  url: "https://onisep.fr/...",
  sigle: "BTS"
}
```

## Implementation Details

### Sync Process

1. **Fetch from ONISEP**
   ```
   GET https://data.onisep.fr/api/formations?limit=50&offset=0
   ```

2. **Transform Data**
   - Map ONISEP fields to formations table columns
   - Generate slug from name
   - Store raw metadata as JSONB
   - Assign source = "onisep"

3. **Database Upsert**
   - Check for duplicates using `external_id + source`
   - Insert new formations
   - Update existing ones

4. **Return Statistics**
   - Total formations retrieved
   - Number successfully synced
   - Any errors encountered

## Deployment

### Prerequisites

1. Supabase project with migrations applied
2. Edge Functions enabled
3. Service role key configured

### Deploy Edge Function

```bash
# From root directory
supabase functions deploy sync-onisep-formations
```

### Apply Migration

```bash
# Apply migration to Supabase
supabase db push
```

## Troubleshooting

### No formations imported?

1. Check browser console for errors
2. Verify Supabase Edge Functions are deployed
3. Ensure migrations have been applied
4. Check ONISEP API is accessible

### Some formations fail to sync?

- This is normal - data validation may reject some entries
- Check the "Errors" section in sync results
- Manually review problematic formations

### How to run just a sample?

```javascript
// Sync only 10 formations for testing
await onisepSyncService.syncFormationsFromOnisep({
  limit: 10,
  offset: 0,
  syncToDb: true
});
```

## Performance

- **First sync**: ~50-100 formations per request
- **Rate limiting**: ONISEP API has generous limits
- **Database indexes**: Optimized for searches by sector/level/type
- **Pagination**: Implemented to handle large datasets

## Future Enhancements

- [ ] Add scheduled sync (daily/weekly)
- [ ] Filter by specific sectors
- [ ] Implement formation recommendations based on RIASEC profile
- [ ] Add formation reviews and user ratings
- [ ] Sync additional fields (prerequisites, outcomes, etc.)
- [ ] Integration with job market data for salary insights

## References

- **ONISEP**: https://www.onisep.fr/
- **ONISEP Data API**: https://data.onisep.fr/api/
- **Supabase Functions**: https://supabase.com/docs/guides/functions
