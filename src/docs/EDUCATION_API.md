📘 Documentation API Éducation — CléAvenir
1. Objectif du module

Le module API Éducation – CléAvenir permet d’accéder à des données officielles, fiables et à jour sur les établissements scolaires français (écoles, collèges, lycées, CFA, etc.), issues de l’Open Data de l’Éducation Nationale (API v2.1).

👉 Ce module est utilisé pour :

contextualiser les recommandations d’orientation,

relier formations ⇄ établissements ⇄ territoires,

alimenter les parcours utilisateurs et les analyses internes,

proposer des fonctionnalités B2B (établissements, CFA, collectivités).

2. Architecture technique

L’architecture repose sur un middleware sécurisé, garantissant performance, sécurité et maîtrise des données.

Frontend (React / Next.js)
        ↓
Service client (educationApi.js)
        ↓
Supabase Edge Function (get-etablissements)
        ↓
API Open Data Éducation Nationale (data.education.gouv.fr)

Rôle de la Supabase Edge Function

🔐 Sécurisation des appels (JWT, rôles)

🔄 Normalisation et nettoyage des données

🚦 Limitation du volume et du rythme des requêtes

🧾 Logging (audit, debug, monitoring)

🧠 Préparation à l’enrichissement futur (ML, scoring, croisement APIs)

3. Endpoint
🔹 URL

POST

https://[PROJECT_REF].supabase.co/functions/v1/get-etablissements

4. Sécurité & Authentification
Headers requis
Header	Description
Authorization	Bearer USER_JWT
Content-Type	application/json
🔐 Règle d’accès

L’utilisateur doit obligatoirement avoir le rôle admin

Toute requête non autorisée est rejetée

5. Paramètres de requête (Body JSON)
Paramètre	Type	Description	Exemple
commune	string	Filtrer par commune	"Paris"
code_postal	string	Filtrer par code postal	"75015"
secteur	string	Secteur de l’établissement	"Public"
type	string	Type d’établissement	"Lycée"
limit	number	Nombre maximum de résultats (max 100)	20
offset	number	Décalage pour pagination	0
⚠️ Contraintes

limit est plafonné à 100 (hard cap)

Tous les filtres sont optionnels

Les champs sont combinables

6. Format de réponse — Succès
{
  "success": true,
  "meta": {
    "count": 1,
    "limit": 20,
    "offset": 0
  },
  "data": [
    {
      "uai": "0751234A",
      "nom": "Lycée Général Victor Hugo",
      "type": "Lycée",
      "secteur": "Public",
      "statut": "Actif",
      "adresse": {
        "ligne_1": "27 rue de la Convention",
        "code_postal": "75015",
        "commune": "Paris",
        "departement": "Paris",
        "region": "Île-de-France"
      },
      "geo": {
        "lat": 48.8412,
        "lon": 2.2934
      },
      "academie": "Paris",
      "telephone": "0145789654",
      "email": "ce.0751234a@ac-paris.fr"
    }
  ]
}

7. Détail des champs retournés
Champ	Description
uai	Identifiant unique national de l’établissement
nom	Nom officiel
type	Nature de l’établissement
secteur	Public ou Privé
statut	Actif / Fermé
adresse	Adresse normalisée
geo	Coordonnées géographiques
academie	Académie de rattachement
telephone	Numéro de contact
email	Email institutionnel
8. Gestion des erreurs
❌ Accès non autorisé
{
  "success": false,
  "error": {
    "code": 401,
    "message": "Accès refusé – rôle administrateur requis"
  }
}

❌ Erreur API externe
{
  "success": false,
  "error": {
    "code": 502,
    "message": "Erreur lors de l’appel à l’API Éducation Nationale"
  }
}

9. Exemple d’appel côté Frontend
export async function getEtablissements(filters) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/get-etablissements`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userJwt}`
      },
      body: JSON.stringify(filters)
    }
  );

  return response.json();
}

10. Bonnes pratiques & évolutivité

✅ Toujours paginer les résultats

✅ Prévoir un cache côté Edge Function

✅ Ne jamais appeler l’API Éducation directement depuis le frontend

🔜 Enrichissement prévu :

croisement avec formations (MonCompteFormation)

scoring géographique

recommandations IA contextualisées

11. Positionnement produit CléAvenir

Cette API n’est pas un simple connecteur.
Elle est un pilier fonctionnel de CléAvenir, permettant :

une orientation ancrée dans le réel

des recommandations exploitables immédiatement

une valeur forte pour le B2B (établissements, CFA, acteurs publics)

une crédibilité institutionnelle (données État)