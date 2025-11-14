import yfinance as yf
import json

# Test identique à ce que fait l'API
symbol = "AAPL"
range_param = "1mo"
interval = "1d"

print(f"Test yfinance avec: {symbol}, range={range_param}, interval={interval}")
print("=" * 60)

try:
    # Créer le ticker
    ticker = yf.Ticker(symbol)
    
    # Récupérer l'historique (EXACTEMENT comme dans l'API)
    print(f"Appel: ticker.history(period='{range_param}', interval='{interval}')")
    hist = ticker.history(period=range_param, interval=interval)
    
    print(f"\nHistorique vide: {hist.empty}")
    print(f"Nombre de lignes: {len(hist)}")
    
    if hist.empty:
        print("\n❌ ERREUR: L'historique est vide (comme sur Vercel)")
        print("Données indisponibles pour", symbol)
    else:
        print("\n✅ SUCCESS: Données récupérées")
        print(f"\nPremières lignes de l'historique:")
        print(hist.head())
        
        # Récupérer les infos
        print("\nRécupération des infos ticker...")
        info = ticker.info
        
        ticker_info = {
            'name': info.get('longName', symbol),
            'currentPrice': info.get('currentPrice') or info.get('regularMarketPrice'),
            'changePercent': info.get('regularMarketChangePercent', 0),
            'marketCap': info.get('marketCap'),
        }
        
        print("\nInfos extraites:")
        print(json.dumps(ticker_info, indent=2))
        
except Exception as e:
    print(f"\n❌ EXCEPTION: {type(e).__name__}")
    print(f"Message: {str(e)}")
    import traceback
    print("\nTraceback complet:")
    traceback.print_exc()

print("\n" + "=" * 60)
print("Test terminé")