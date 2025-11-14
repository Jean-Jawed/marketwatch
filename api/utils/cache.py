import os
import json
from upstash_redis import Redis

# Configuration Redis (Vercel KV)
redis_client = None

def get_redis():
    global redis_client
    if redis_client is None:
        url = os.environ.get('KV_REST_API_URL')
        token = os.environ.get('KV_REST_API_TOKEN')
        if url and token:
            redis_client = Redis(url=url, token=token)
    return redis_client

def get_cache(key):
    """Récupère une valeur du cache"""
    try:
        redis = get_redis()
        if redis:
            value = redis.get(key)
            if value:
                return json.loads(value)
    except Exception as e:
        print(f"Cache get error: {e}")
    return None

def set_cache(key, value, ttl=300):
    """Stocke une valeur dans le cache avec TTL (défaut: 5 min)"""
    try:
        redis = get_redis()
        if redis:
            redis.setex(key, ttl, json.dumps(value))
            return True
    except Exception as e:
        print(f"Cache set error: {e}")
    return False
