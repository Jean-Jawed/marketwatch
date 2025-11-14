from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import requests
import os
from datetime import datetime, timedelta

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

            # Récupérer la clé API Polygon.io
            api_key = os.environ.get('POLYGON_API_KEY')
            if not api_key:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Clé API non configurée'}).encode())
                return

            # Convertir le range en dates
            end_date = datetime.now()
            if range_param == '1d':
                start_date = end_date - timedelta(days=1)
            elif range_param == '5d':
                start_date = end_date - timedelta(days=5)
            elif range_param == '1mo':
                start_date = end_date - timedelta(days=30)
            elif range_param == '1y':
                start_date = end_date - timedelta(days=365)
            elif range_param == '5y':
                start_date = end_date - timedelta(days=365*5)
            else:
                start_date = end_date - timedelta(days=30)

            start_str = start_date.strftime('%Y-%m-%d')
            end_str = end_date.strftime('%Y-%m-%d')

            # Récupérer les données pour chaque symbole
            all_data = {}
            for symbol in symbols:
                try:
                    aggs_url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_str}/{end_str}"
                    response = requests.get(aggs_url, params={'adjusted': 'true', 'sort': 'asc', 'apiKey': api_key})
                    
                    if response.status_code == 200:
                        data = response.json()
                        if data.get('status') == 'OK' and data.get('results'):
                            # Créer un dictionnaire date -> prix de clôture
                            symbol_data = {}
                            first_close = None
                            
                            for bar in data['results']:
                                timestamp = bar['t'] / 1000
                                date_obj = datetime.fromtimestamp(timestamp)
                                date_str = date_obj.strftime('%Y-%m-%d')
                                close_price = float(bar['c'])
                                
                                if first_close is None:
                                    first_close = close_price
                                
                                # Normaliser (100 = prix de départ)
                                normalized = round((close_price / first_close) * 100, 2)
                                symbol_data[date_str] = normalized
                            
                            all_data[symbol] = symbol_data
                            
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

            # Créer un ensemble de toutes les dates
            all_dates = set()
            for symbol_data in all_data.values():
                all_dates.update(symbol_data.keys())
            
            # Trier les dates
            sorted_dates = sorted(list(all_dates))

            # Formater pour le frontend
            result_data = []
            for date in sorted_dates:
                data_point = {'date': date}
                for symbol in symbols:
                    if symbol in all_data and date in all_data[symbol]:
                        data_point[symbol] = all_data[symbol][date]
                    elif symbol in all_data:
                        # Forward fill: utiliser la dernière valeur connue
                        prev_value = 100
                        for d in sorted_dates:
                            if d == date:
                                break
                            if d in all_data[symbol]:
                                prev_value = all_data[symbol][d]
                        data_point[symbol] = prev_value
                
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