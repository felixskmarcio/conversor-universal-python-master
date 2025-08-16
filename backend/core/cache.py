#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Caching utilities for improved performance
"""

import hashlib
import pickle
import time
from pathlib import Path
from typing import Any, Optional, Callable, Dict
from functools import wraps
import logging

logger = logging.getLogger(__name__)


class FileCache:
    """Simple file-based cache for conversion results"""
    
    def __init__(self, cache_dir: Path, max_age: int = 3600):
        """
        Initialize file cache.
        
        Args:
            cache_dir: Directory to store cache files
            max_age: Maximum age of cache entries in seconds
        """
        self.cache_dir = Path(cache_dir)
        self.max_age = max_age
        self.cache_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_cache_key(self, *args, **kwargs) -> str:
        """Generate cache key from arguments"""
        key_data = str(args) + str(sorted(kwargs.items()))
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def _get_cache_path(self, key: str) -> Path:
        """Get cache file path for key"""
        return self.cache_dir / f"{key}.cache"
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            cache_path = self._get_cache_path(key)
            
            if not cache_path.exists():
                return None
            
            # Check if cache is expired
            if time.time() - cache_path.stat().st_mtime > self.max_age:
                cache_path.unlink(missing_ok=True)
                return None
            
            with open(cache_path, 'rb') as f:
                return pickle.load(f)
                
        except Exception as e:
            logger.warning(f"Cache read error: {e}")
            return None
    
    def set(self, key: str, value: Any) -> bool:
        """Set value in cache"""
        try:
            cache_path = self._get_cache_path(key)
            
            with open(cache_path, 'wb') as f:
                pickle.dump(value, f)
            
            return True
            
        except Exception as e:
            logger.warning(f"Cache write error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            cache_path = self._get_cache_path(key)
            cache_path.unlink(missing_ok=True)
            return True
        except Exception as e:
            logger.warning(f"Cache delete error: {e}")
            return False
    
    def clear(self) -> int:
        """Clear all cache entries"""
        count = 0
        try:
            for cache_file in self.cache_dir.glob("*.cache"):
                cache_file.unlink(missing_ok=True)
                count += 1
        except Exception as e:
            logger.warning(f"Cache clear error: {e}")
        
        return count
    
    def cleanup_expired(self) -> int:
        """Remove expired cache entries"""
        count = 0
        current_time = time.time()
        
        try:
            for cache_file in self.cache_dir.glob("*.cache"):
                if current_time - cache_file.stat().st_mtime > self.max_age:
                    cache_file.unlink(missing_ok=True)
                    count += 1
        except Exception as e:
            logger.warning(f"Cache cleanup error: {e}")
        
        return count


def cached(cache_instance: FileCache, key_func: Optional[Callable] = None):
    """
    Decorator for caching function results
    
    Args:
        cache_instance: Cache instance to use
        key_func: Optional function to generate cache key
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            if key_func:
                cache_key = key_func(*args, **kwargs)
            else:
                cache_key = cache_instance._get_cache_key(func.__name__, *args, **kwargs)
            
            # Try to get from cache
            cached_result = cache_instance.get(cache_key)
            if cached_result is not None:
                logger.debug(f"Cache hit for {func.__name__}")
                return cached_result
            
            # Execute function and cache result
            logger.debug(f"Cache miss for {func.__name__}")
            result = func(*args, **kwargs)
            cache_instance.set(cache_key, result)
            
            return result
        
        return wrapper
    return decorator


class MemoryCache:
    """Simple in-memory cache with LRU eviction"""
    
    def __init__(self, max_size: int = 100, max_age: int = 3600):
        """
        Initialize memory cache.
        
        Args:
            max_size: Maximum number of entries
            max_age: Maximum age of entries in seconds
        """
        self.max_size = max_size
        self.max_age = max_age
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.access_order: list = []
    
    def _cleanup_expired(self):
        """Remove expired entries"""
        current_time = time.time()
        expired_keys = [
            key for key, entry in self.cache.items()
            if current_time - entry['timestamp'] > self.max_age
        ]
        
        for key in expired_keys:
            self._remove_key(key)
    
    def _remove_key(self, key: str):
        """Remove key from cache and access order"""
        if key in self.cache:
            del self.cache[key]
        if key in self.access_order:
            self.access_order.remove(key)
    
    def _evict_lru(self):
        """Evict least recently used entry"""
        if self.access_order:
            lru_key = self.access_order[0]
            self._remove_key(lru_key)
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        self._cleanup_expired()
        
        if key not in self.cache:
            return None
        
        # Update access order
        if key in self.access_order:
            self.access_order.remove(key)
        self.access_order.append(key)
        
        return self.cache[key]['value']
    
    def set(self, key: str, value: Any):
        """Set value in cache"""
        self._cleanup_expired()
        
        # Remove existing entry
        if key in self.cache:
            self._remove_key(key)
        
        # Evict if at capacity
        while len(self.cache) >= self.max_size:
            self._evict_lru()
        
        # Add new entry
        self.cache[key] = {
            'value': value,
            'timestamp': time.time()
        }
        self.access_order.append(key)
    
    def delete(self, key: str):
        """Delete value from cache"""
        self._remove_key(key)
    
    def clear(self):
        """Clear all cache entries"""
        self.cache.clear()
        self.access_order.clear()
    
    def size(self) -> int:
        """Get current cache size"""
        return len(self.cache)