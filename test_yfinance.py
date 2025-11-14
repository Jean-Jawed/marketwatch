import yfinance as yf
import json

# Test simple yfinance
print("Test yfinance - récupération données AAPL")

# Créer un ticker
ticker = yf.Ticker("AAPL")

# Récupérer l'historique
print("Récupération historique 1 mois...")
hist = ticker.history(period="1mo", interval="1d")

# Récupérer les infos
print("Récupération infos ticker...")
info = ticker.info

# Préparer les résultats
result = {
    "symbol": "AAPL",
    "info": {
        "name": info.get('longName', 'N/A'),
        "currentPrice": info.get('currentPrice') or info.get('regularMarketPrice'),
        "changePercent": info.get('regularMarketChangePercent', 0),
        "fiftyTwoWeekHigh": info.get('fiftyTwoWeekHigh'),
        "fiftyTwoWeekLow": info.get('fiftyTwoWeekLow'),
        "averageVolume": info.get('averageVolume'),
        "marketCap": info.get('marketCap'),
        "peRatio": info.get('trailingPE'),
    },
    "history_sample": []
}

# Ajouter quelques lignes d'historique (les 5 premières)
for idx, row in hist.head(5).iterrows():
    result["history_sample"].append({
        "date": idx.strftime('%Y-%m-%d'),
        "open": float(row['Open']),
        "high": float(row['High']),
        "low": float(row['Low']),
        "close": float(row['Close']),
        "volume": int(row['Volume']) if 'Volume' in row else 0
    })

# Écrire dans test.txt
with open('test.txt', 'w', encoding='utf-8') as f:
    f.write("=" * 50 + "\n")
    f.write("TEST YFINANCE - AAPL\n")
    f.write("=" * 50 + "\n\n")
    f.write(json.dumps(result, indent=2, ensure_ascii=False))
    f.write("\n\n" + "=" * 50 + "\n")
    f.write(f"Nombre total de lignes d'historique: {len(hist)}\n")
    f.write(f"Historique vide: {hist.empty}\n")

print("\nRésultat écrit dans test.txt")
print(f"Lignes d'historique récupérées: {len(hist)}")
print(f"Infos récupérées: {len(info)} champs")