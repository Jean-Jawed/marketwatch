from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import yfinance as yf
import pandas as pd
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse params
            parsed = urlparse(self.path)
            params = parse_qs(parsed.query)
            symbols_param = params.get('symbols', [''])[0]
            range_param = params.get('range', ['1mo'])[0]

            if not symbols_param:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Symbols requis'}).encode())
                return

            symbols = [s.strip() for s in symbols_param.split(',')]
            
            if len(symbols) < 2:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Au moins 2 symbols requis pour comparaison'
                }).encode())
                return

            # Configurer session avec User-Agent
            session = requests.Session()
            session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })

            # Récupérer les données pour chaque symbole
            all_data = {}
            for symbol in symbols:
                try:
                    ticker = yf.Ticker(symbol, session=session)
                    hist = ticker.history(period=range_param, interval='1d')
                    if not hist.empty:
                        # Normaliser les prix (100 = prix de départ)
                        first_close = hist['Close'].iloc[0]
                        normalized = (hist['Close'] / first_close * 100).round(2)
                        all_data[symbol] = normalized
                except Exception as e:
                    print(f"Error fetching {symbol}: {e}")
                    continue

            if not all_data:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Aucune donnée disponible pour les symboles fournis'
                }).encode())
                return

            # Créer un DataFrame avec toutes les données
            df = pd.DataFrame(all_data)
            df = df.fillna(method='ffill').fillna(method='bfill')

            # Formater pour le frontend
            result_data = []
            for idx, row in df.iterrows():
                data_point = {'date': idx.strftime('%Y-%m-%d')}
                for symbol in symbols:
                    if symbol in row:
                        data_point[symbol] = float(row[symbol])
                result_data.append(data_point)

            result = {
                'symbols': symbols,
                'data': result_data
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