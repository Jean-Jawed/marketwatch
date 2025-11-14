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

            # Récupérer la clé API Polygon.io
            api_key = os.environ.get('POLYGON_API_KEY')
            print(f"DEBUG: API Key present: {api_key is not None}")
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

            # Formater les dates pour Polygon.io
            start_str = start_date.strftime('%Y-%m-%d')
            end_str = end_date.strftime('%Y-%m-%d')

            # Déterminer le timespan pour Polygon.io
            if interval in ['5m', '15m', '30m']:
                timespan = 'minute'
                multiplier = int(interval.replace('m', ''))
            elif interval == '1h':
                timespan = 'hour'
                multiplier = 1
            elif interval == '1d':
                timespan = 'day'
                multiplier = 1
            elif interval == '1wk':
                timespan = 'week'
                multiplier = 1
            else:
                timespan = 'day'
                multiplier = 1

            # Récupérer les données historiques depuis Polygon.io
            aggs_url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/{multiplier}/{timespan}/{start_str}/{end_str}"
            print(f"DEBUG: Calling URL: {aggs_url}")
            aggs_response = requests.get(aggs_url, params={'adjusted': 'true', 'sort': 'asc', 'apiKey': api_key})
            print(f"DEBUG: Status code: {aggs_response.status_code}")
            print(f"DEBUG: Response: {aggs_response.text[:200]}")
            
            if aggs_response.status_code != 200:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': f'Données indisponibles pour {symbol}'
                }).encode())
                return

            aggs_data = aggs_response.json()
            
            if aggs_data.get('status') != 'OK' or not aggs_data.get('results'):
                print(f"DEBUG: Polygon response status: {aggs_data.get('status')}")
                print(f"DEBUG: Results present: {aggs_data.get('results') is not None}")
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
            for bar in aggs_data['results']:
                timestamp = bar['t'] / 1000  # Convertir ms en secondes
                date_obj = datetime.fromtimestamp(timestamp)
                history_data.append({
                    'date': date_obj.strftime('%Y-%m-%d %H:%M'),
                    'open': float(bar['o']),
                    'high': float(bar['h']),
                    'low': float(bar['l']),
                    'close': float(bar['c']),
                    'volume': int(bar['v'])
                })

            # Récupérer les infos du ticker (snapshot)
            snapshot_url = f"https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/{symbol}"
            snapshot_response = requests.get(snapshot_url, params={'apiKey': api_key})
            
            ticker_info = {
                'name': symbol,
                'currentPrice': None,
                'changePercent': 0,
                'fiftyTwoWeekHigh': None,
                'fiftyTwoWeekLow': None,
                'averageVolume': None,
                'marketCap': None,
                'peRatio': None,
            }

            if snapshot_response.status_code == 200:
                snapshot_data = snapshot_response.json()
                if snapshot_data.get('status') == 'OK' and snapshot_data.get('ticker'):
                    ticker = snapshot_data['ticker']
                    day = ticker.get('day', {})
                    prev_day = ticker.get('prevDay', {})
                    
                    ticker_info['currentPrice'] = day.get('c')
                    
                    # Calculer le changePercent
                    if prev_day.get('c') and day.get('c'):
                        prev_close = prev_day['c']
                        current = day['c']
                        ticker_info['changePercent'] = ((current - prev_close) / prev_close) * 100

            # Récupérer les détails du ticker pour plus d'infos
            details_url = f"https://api.polygon.io/v3/reference/tickers/{symbol}"
            details_response = requests.get(details_url, params={'apiKey': api_key})
            
            if details_response.status_code == 200:
                details_data = details_response.json()
                if details_data.get('status') == 'OK' and details_data.get('results'):
                    details = details_data['results']
                    ticker_info['name'] = details.get('name', symbol)
                    ticker_info['marketCap'] = details.get('market_cap')

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