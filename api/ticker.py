from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import yfinance as yf
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse params
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            symbol = params.get('symbol', [''])[0]
            range_param = params.get('range', ['1mo'])[0]
            interval = params.get('interval', ['1d'])[0]

            if not symbol:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Symbol requis'}).encode())
                return

            # Configurer session avec User-Agent pour éviter le blocage Yahoo
            session = requests.Session()
            session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })

            # Récupérer les données depuis yfinance
            ticker = yf.Ticker(symbol, session=session)
            
            # Historique des prix
            hist = ticker.history(period=range_param, interval=interval)
            
            if hist.empty:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': f'Données indisponibles pour {symbol}'
                }).encode())
                return

            # Formater les données historiques
            history_data = []
            for idx, row in hist.iterrows():
                history_data.append({
                    'date': idx.strftime('%Y-%m-%d %H:%M'),
                    'open': float(row['Open']),
                    'high': float(row['High']),
                    'low': float(row['Low']),
                    'close': float(row['Close']),
                    'volume': int(row['Volume']) if 'Volume' in row else 0
                })

            # Informations du ticker
            info = ticker.info
            ticker_info = {
                'name': info.get('longName', symbol),
                'currentPrice': info.get('currentPrice') or info.get('regularMarketPrice'),
                'changePercent': info.get('regularMarketChangePercent', 0),
                'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh'),
                'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow'),
                'averageVolume': info.get('averageVolume'),
                'marketCap': info.get('marketCap'),
                'peRatio': info.get('trailingPE'),
            }

            result = {
                'symbol': symbol,
                'info': ticker_info,
                'history': history_data
            }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            print(f"Error: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': f'Erreur serveur: {str(e)}'
            }).encode())