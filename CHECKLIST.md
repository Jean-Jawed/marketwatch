# Checklist de Mise en Production - MarketWatch

## ✅ Avant le déploiement

### Fichiers du projet
- [ ] Tous les fichiers source sont présents
- [ ] Logo placé dans `/public/logo.png`
- [ ] Favicon placé dans `/public/favicon.png`
- [ ] `.gitignore` configuré correctement
- [ ] README.md complété

### Installation locale
- [ ] `npm install` exécuté sans erreurs
- [ ] `npm run dev` fonctionne en local
- [ ] Application accessible sur http://localhost:3000
- [ ] Recherche d'assets fonctionne
- [ ] Interface responsive testée

### Git & GitHub
- [ ] Repository GitHub créé
- [ ] Code initial committé
- [ ] Code pushé sur GitHub
- [ ] Branch `main` est la branche par défaut

## ✅ Configuration Vercel

### Connexion & Import
- [ ] Compte Vercel créé
- [ ] GitHub connecté à Vercel
- [ ] Projet importé depuis GitHub
- [ ] Framework détecté automatiquement (Vite)

### Build Settings
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Node.js Version: 18.x ou 20.x

### Vercel KV (Cache Redis)
- [ ] Database KV créée depuis l'onglet Storage
- [ ] Nom: `marketwatch-cache`
- [ ] Région sélectionnée
- [ ] Variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` générées
- [ ] Variables liées au projet

### Premier déploiement
- [ ] Premier build réussi
- [ ] Application accessible via URL Vercel
- [ ] Pas d'erreurs dans les logs

## ✅ Tests Post-Déploiement

### Fonctionnalités Core
- [ ] Page d'accueil charge correctement
- [ ] Logo et favicon s'affichent
- [ ] Recherche d'assets fonctionne
- [ ] Autocomplete affiche des résultats
- [ ] Sélection d'un asset charge le graphique
- [ ] Métriques financières s'affichent
- [ ] Volumes s'affichent (si disponibles)

### Timeframes
- [ ] 6H fonctionne
- [ ] 1J fonctionne
- [ ] 1S fonctionne
- [ ] 1M fonctionne
- [ ] 1A fonctionne
- [ ] 5A fonctionne

### Modes d'affichage
- [ ] Mode séparé - 1 graphique
- [ ] Mode séparé - 2 graphiques
- [ ] Mode séparé - 3 graphiques
- [ ] Mode séparé - 4 graphiques
- [ ] Mode comparaison avec 2+ assets
- [ ] Bouton actualiser fonctionne

### API Endpoints
Test avec curl ou navigateur:
- [ ] `/api/search?q=apple` retourne des résultats
- [ ] `/api/ticker?symbol=AAPL&range=1mo` retourne des données
- [ ] `/api/compare?symbols=AAPL,MSFT&range=1mo` retourne des données
- [ ] Rate limiting actif (max 200 req/h)
- [ ] Cache fonctionne (vérifier dans logs)

### Responsive Design
- [ ] Desktop (1920px) OK
- [ ] Laptop (1366px) OK
- [ ] Tablet (768px) OK
- [ ] Mobile (375px) OK
- [ ] Navigation tactile fonctionnelle

### Performance
- [ ] Temps de chargement < 3s
- [ ] Graphiques s'affichent rapidement
- [ ] Pas de lag lors du changement de timeframe
- [ ] Animations fluides

### Erreurs & Edge Cases
- [ ] Message clair si asset non trouvé
- [ ] Message clair si données indisponibles
- [ ] Message clair si rate limit dépassé
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Pas d'erreurs dans les logs Vercel

## ✅ Optimisations (Optionnel)

### SEO & Métadonnées
- [ ] Title personnalisé
- [ ] Meta description
- [ ] Open Graph tags
- [ ] Favicon correct

### Analytics
- [ ] Vercel Analytics activé
- [ ] Monitoring des erreurs

### Domaine Custom
- [ ] Domaine personnalisé configuré (si applicable)
- [ ] DNS configuré
- [ ] HTTPS actif

## ✅ Documentation

- [ ] README.md à jour
- [ ] DEPLOIEMENT.md vérifié
- [ ] Variables d'environnement documentées
- [ ] Architecture documentée

## ✅ Maintenance

### À surveiller régulièrement
- [ ] Logs Vercel pour détecter erreurs
- [ ] Usage Vercel (bandwidth, fonctions)
- [ ] Usage Vercel KV (requêtes, stockage)
- [ ] Performances via Analytics

### Mises à jour
- [ ] Dépendances npm à jour
- [ ] Versions Python à jour
- [ ] Fonctionnalités futures planifiées

## 🎉 Prêt pour la Production!

Une fois tous les points cochés, votre application MarketWatch est prête à être utilisée par vos utilisateurs!

### Partager l'application
URL de production: https://VOTRE_APP.vercel.app

### Support
En cas de problème, consultez:
- Les logs dans Vercel Dashboard
- La documentation dans DEPLOIEMENT.md
- La documentation officielle Vercel
