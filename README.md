# MarketWatch

Application web de visualisation de marchés financiers permettant d'afficher des graphiques de cours pour actions, cryptos, matières premières, forex et indices.

## Stack Technique

### Frontend
- **React** (Vite)
- **Recharts** - Graphiques interactifs
- **Tailwind CSS** - Styling moderne
- **Lucide React** - Icônes

### Backend
- **Vercel Serverless Functions** (Python)
- **yfinance** - Données financières temps réel
- **pandas/numpy** - Traitement des données
- **Vercel KV (upstash-redis)** - Cache (TTL 5 min)

### Déploiement
- **Vercel** - Hébergement et serverless functions

## Fonctionnalités

- 🔍 Recherche d'assets avec autocomplete (actions, cryptos, matières premières, forex, indices)
- 📊 Timeframes: 6h, 1J, 1S, 1M, 1A, 5A
- 📈 Modes d'affichage: 1-4 graphiques simultanés ou comparaison overlay
- 💹 Métriques financières: Prix, variation, high/low, volume, market cap, P/E ratio
- 📉 Indicateurs techniques: MA 20/50/200, RSI, volumes
- 🎨 Interface moderne avec animations fluides
- 📱 Responsive mobile

## Architecture

```
marketwatch/
├── src/
│   ├── components/     # Composants React
│   ├── services/       # API calls
│   ├── utils/          # Helpers
│   └── data/           # Assets statiques
├── api/                # Vercel serverless functions (Python)
└── public/             # Assets statiques (logo, favicon)
```

## Sécurité & Performance

- Rate limiting: 200 req/h par IP
- Cache Redis: TTL 5 min
- CORS: domaine de production uniquement
- Max 1000 points par graphique
- Debounce sur recherche (300ms)

---

**By Jawed 2025** - [Jawed.fr](https://jawed.fr)
