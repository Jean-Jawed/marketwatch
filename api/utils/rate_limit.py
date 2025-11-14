import time
from collections import defaultdict

# Stockage en mémoire des requêtes par IP
# Note: En production avec plusieurs instances, utiliser Redis
request_counts = defaultdict(list)
RATE_LIMIT = 200  # requêtes par heure
RATE_WINDOW = 3600  # 1 heure en secondes

def check_rate_limit(ip_address):
    """
    Vérifie si l'IP a dépassé la limite de requêtes
    Retourne (is_allowed, remaining_requests)
    """
    current_time = time.time()
    
    # Nettoyer les anciennes entrées
    request_counts[ip_address] = [
        req_time for req_time in request_counts[ip_address]
        if current_time - req_time < RATE_WINDOW
    ]
    
    # Vérifier la limite
    if len(request_counts[ip_address]) >= RATE_LIMIT:
        return False, 0
    
    # Ajouter la requête actuelle
    request_counts[ip_address].append(current_time)
    remaining = RATE_LIMIT - len(request_counts[ip_address])
    
    return True, remaining

def get_client_ip(request):
    """Extrait l'IP du client depuis les headers"""
    # Vérifier les headers Vercel
    forwarded = request.headers.get('x-forwarded-for')
    if forwarded:
        return forwarded.split(',')[0].strip()
    
    real_ip = request.headers.get('x-real-ip')
    if real_ip:
        return real_ip
    
    return request.remote_addr or 'unknown'
