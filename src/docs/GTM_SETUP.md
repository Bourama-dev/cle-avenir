# Configuration Google Tag Manager

## 1. Créer un compte GTM

1. Aller sur https://tagmanager.google.com/
2. Créer un nouveau compte
3. Sélectionner "Web" comme plateforme
4. Copier votre ID GTM (format: GTM-XXXXXXX)

## 2. Remplacer l'ID GTM

Remplacer `GTM-XXXXXXX` par votre ID dans:
- `/index.html` (2 endroits)
- `/src/services/gtmTracking.js` (optionnel)

## 3. Événements trackés

### Engagement
- `test_start` - Début du test
- `test_answer` - Réponse à une question
- `test_complete` - Fin du test
- `results_view` - Visualisation des résultats
- `career_click` - Clic sur un métier
- `page_view` - Vue de page

### Conversion
- `sign_up` - Inscription
- `login` - Connexion

### Erreurs
- `exception` - Erreur/exception

## 4. Vérifier le tracking

1. Ouvrir Google Tag Manager
2. Aller dans "Preview"
3. Entrer l'URL de votre site
4. Faire le test et vérifier les événements

## 5. Publier les changements

1. Dans GTM, cliquer sur "Submit"
2. Ajouter une description
3. Cliquer sur "Publish"

## 6. Voir les données

1. Aller dans Google Analytics 4
2. Aller dans "Événements"
3. Vérifier que les événements arrivent