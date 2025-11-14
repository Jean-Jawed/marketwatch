# Guide de Déploiement MarketWatch

## 1. Prérequis

- Node.js 18+ et npm installés
- Compte GitHub
- Compte Vercel (gratuit)
- Git installé

## 2. Structure du Projet

```
marketwatch/
├── api/                      # Fonctions serverless Python
│   ├── utils/
│   │   ├── cache.py
│   │   └── rate_limit.py
│   ├── search.py
│   ├── ticker.py
│   ├── compare.py
│   └── requirements.txt
├── public/                   # Assets statiques
│   ├── logo.png             # À placer ici
│   └── favicon.png          # À placer ici
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── TimeframeSelector.jsx
│   │   ├── LayoutSelector.jsx
│   │   ├── Chart.jsx
│   │   ├── MetricsCard.jsx
│   │   └── LoadingSkeleton.jsx
│   ├── data/
│   │   └── assets.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .gitignore
└── README.md
```

## 3. Installation Locale

### Étape 1: Placer les fichiers
Copiez tous les fichiers sources dans un dossier `marketwatch`.

### Étape 2: Ajouter le logo et le favicon
Placez vos fichiers dans le dossier `public/`:
- `public/logo.png` - Logo de l'application (recommandé: 200x200px)
- `public/favicon.png` - Icône du site (recommandé: 32x32px)

### Étape 3: Installer les dépendances
```bash
cd marketwatch
npm install
```

### Étape 4: Test en local
```bash
npm run dev
```
L'application sera disponible sur http://localhost:3000

**Note**: Les fonctions serverless ne fonctionneront pas en local sans configuration supplémentaire. Le test complet nécessite le déploiement sur Vercel.

## 4. Configuration Git & GitHub

### Étape 1: Initialiser Git
```bash
git init
git add .
git commit -m "Initial commit - MarketWatch"
```

### Étape 2: Créer un repository GitHub
1. Allez sur https://github.com
2. Cliquez sur "New repository"
3. Nommez-le "marketwatch"
4. Ne cochez aucune option (README, .gitignore, etc.)
5. Cliquez sur "Create repository"

### Étape 3: Pousser le code
```bash
git remote add origin https://github.com/VOTRE_USERNAME/marketwatch.git
git branch -M main
git push -u origin main
```

## 5. Déploiement sur Vercel

### Étape 1: Créer un compte Vercel
1. Allez sur https://vercel.com
2. Inscrivez-vous avec GitHub
3. Autorisez Vercel à accéder à vos repositories

### Étape 2: Importer le projet
1. Cliquez sur "Add New..." → "Project"
2. Sélectionnez votre repository "marketwatch"
3. Cliquez sur "Import"

### Étape 3: Configuration du build
Vercel détectera automatiquement Vite. Vérifiez que:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Cliquez sur "Deploy" (ne configurez pas encore les variables d'environnement).

### Étape 4: Configuration Vercel KV (Redis Cache)

#### 4.1 Créer une instance Vercel KV
1. Dans votre projet Vercel, allez dans l'onglet "Storage"
2. Cliquez sur "Create Database"
3. Sélectionnez "KV" (Key-Value Store)
4. Nommez-la "marketwatch-cache"
5. Choisissez la région la plus proche de vos utilisateurs
6. Cliquez sur "Create"

#### 4.2 Connecter KV au projet
1. Vercel génère automatiquement les variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
2. Allez dans "Settings" → "Environment Variables"
3. Vérifiez que ces 2 variables sont présentes

### Étape 5: Configuration des variables d'environnement
Dans "Settings" → "Environment Variables", ajoutez si nécessaire:

```
KV_REST_API_URL=https://xxxxx.upstash.io
KV_REST_API_TOKEN=xxxxxxxxxx
```

Ces variables sont normalement auto-configurées lors de la création du KV.

### Étape 6: Redéploiement
1. Allez dans l'onglet "Deployments"
2. Cliquez sur les "..." du dernier déploiement
3. Cliquez sur "Redeploy"
4. Attendez la fin du déploiement

## 6. Vérification du Déploiement

### Tests à effectuer:
1. **Page d'accueil**: Vérifiez que le logo s'affiche
2. **Recherche**: Tapez "Apple" et vérifiez l'autocomplete
3. **Graphique**: Sélectionnez AAPL et vérifiez l'affichage
4. **Timeframes**: Testez les différentes périodes
5. **Mode comparaison**: Ajoutez plusieurs assets
6. **Responsive**: Testez sur mobile

### Vérifier les API:
```bash
# Test de recherche
curl https://VOTRE_APP.vercel.app/api/search?q=apple

# Test de ticker
curl https://VOTRE_APP.vercel.app/api/ticker?symbol=AAPL&range=1mo&interval=1d

# Test de comparaison
curl https://VOTRE_APP.vercel.app/api/compare?symbols=AAPL,MSFT&range=1mo
```

## 7. Configuration DNS (Optionnel)

Pour utiliser un domaine personnalisé:

1. Allez dans "Settings" → "Domains"
2. Ajoutez votre domaine
3. Suivez les instructions pour configurer les DNS

## 8. Monitoring & Logs

### Consulter les logs
1. Onglet "Logs" dans Vercel
2. Filtrez par fonction (search, ticker, compare)
3. Surveillez les erreurs

### Analytics
1. Onglet "Analytics" pour voir:
   - Nombre de visiteurs
   - Temps de chargement
   - Taux d'erreur

## 9. Maintenance

### Mise à jour du code
```bash
# Faire vos modifications
git add .
git commit -m "Description des changements"
git push
```
Vercel redéploiera automatiquement.

### Vider le cache Redis
```bash
# Via le dashboard Vercel KV
# Ou via CLI Vercel:
vercel kv flushall
```

### Surveiller les quotas
- **Vercel Free Tier**:
  - 100GB bandwidth/mois
  - 100GB-heures serverless/mois
  - Projets illimités
  
- **Upstash KV Free Tier**:
  - 10,000 requêtes/jour
  - 256MB de stockage

## 10. Dépannage

### Erreur "Module not found"
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Les API ne fonctionnent pas
- Vérifiez les variables d'environnement KV
- Consultez les logs dans Vercel
- Vérifiez le rate limiting (200 req/h)

### Données non affichées
- Vérifiez la console navigateur (F12)
- Testez l'API directement avec curl
- Vérifiez que yfinance peut accéder au symbol

### Cache ne fonctionne pas
- Vérifiez que KV est bien connecté
- Regardez les logs Python pour les erreurs Redis
- TTL par défaut: 5 minutes

## 11. Commandes Utiles

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Déployer via CLI Vercel
vercel

# Déployer en production
vercel --prod

# Voir les logs en temps réel
vercel logs
```

## 12. URLs du Projet

Après déploiement, vous aurez:
- **Application**: https://marketwatch-XXXXX.vercel.app
- **API Search**: https://marketwatch-XXXXX.vercel.app/api/search
- **API Ticker**: https://marketwatch-XXXXX.vercel.app/api/ticker
- **API Compare**: https://marketwatch-XXXXX.vercel.app/api/compare

---

**Support**: En cas de problème, consultez:
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Vite](https://vitejs.dev)
- [Documentation yfinance](https://pypi.org/project/yfinance/)
