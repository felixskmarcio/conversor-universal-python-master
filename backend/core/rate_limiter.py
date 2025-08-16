#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rate limiting utilities for API protection
"""

import time
from typing import Dict, Optional
from dataclasses import dataclass
from collections import defaultdict
import threading


@dataclass
class RateLimitConfig:
    """Rate limit configuration"""
    requests_per_minute: int = 60
    requests_per_hour: int = 1000
    burst_limit: int = 10
    window_size: int = 60  # seconds


class RateLimiter:
    """Thread-safe rate limiter using sliding window algorithm"""
    
    def __init__(self, config: RateLimitConfig):
        self.config = config
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = threading.RLock()
    
    def _cleanup_old_requests(self, client_id: str, current_time: float):
        """Remove requests older than the window"""
        window_start = current_time - self.config.window_size
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if req_time > window_start
        ]
    
    def is_allowed(self, client_id: str) -> tuple[bool, Dict[str, int]]:
        """
        Check if request is allowed for client.
        
        Returns:
            Tuple of (is_allowed, rate_limit_info)
        """
        with self.lock:
            current_time = time.time()
            
            # Clean up old requests
            self._cleanup_old_requests(client_id, current_time)
            
            # Count requests in current window
            requests_in_window = len(self.requests[client_id])
            
            # Check rate limits
            if requests_in_window >= self.config.requests_per_minute:
                return False, {
                    'requests_remaining': 0,
                    'reset_time': int(current_time + self.config.window_size),
                    'retry_after': self.config.window_size
                }
            
            # Add current request
            self.requests[client_id].append(current_time)
            
            return True, {
                'requests_remaining': self.config.requests_per_minute - requests_in_window - 1,
                'reset_time': int(current_time + self.config.window_size),
                'retry_after': 0
            }
    
    def get_client_stats(self, client_id: str) -> Dict[str, int]:
        """Get current stats for client"""
        with self.lock:
            current_time = time.time()
            self._cleanup_old_requests(client_id, current_time)
            
            return {
                'requests_in_window': len(self.requests[client_id]),
                'requests_remaining': max(0, self.config.requests_per_minute - len(self.requests[client_id])),
                'window_reset': int(current_time + self.config.window_size)
            }


class IPRateLimiter:
    """IP-based rate limiter with different limits for different endpoints"""
    
    def __init__(self):
        self.limiters = {
            'default': RateLimiter(RateLimitConfig(
                requests_per_minute=60,
                burst_limit=10
            )),
            'convert': RateLimiter(RateLimitConfig(
                requests_per_minute=10,  # More restrictive for conversion
                burst_limit=3
            )),
            'upload': RateLimiter(RateLimitConfig(
                requests_per_minute=20,
                burst_limit=5
            ))
        }
    
    def is_allowed(self, ip_address: str, endpoint: str = 'default') -> tuple[bool, Dict[str, int]]:
        """Check if request is allowed for IP and endpoint"""
        limiter = self.limiters.get(endpoint, self.limiters['default'])
        return limiter.is_allowed(ip_address)
    
    def get_stats(self, ip_address: str, endpoint: str = 'default') -> Dict[str, int]:
        """Get rate limit stats for IP and endpoint"""
        limiter = self.limiters.get(endpoint, self.limiters['default'])
        return limiter.get_client_stats(ip_address)


# Flask decorator for rate limiting
def rate_limit(endpoint: str = 'default'):
    """Decorator to apply rate limiting to Flask routes"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            from flask import request, jsonify, g
            
            # Get client IP
            client_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
            if client_ip:
                client_ip = client_ip.split(',')[0].strip()
            
            # Check rate limit
            if not hasattr(g, 'rate_limiter'):
                g.rate_limiter = IPRateLimiter()
            
            is_allowed, rate_info = g.rate_limiter.is_allowed(client_ip, endpoint)
            
            if not is_allowed:
                response = jsonify({
                    'error': 'Rate limit exceeded',
                    'message': f'Too many requests. Try again in {rate_info["retry_after"]} seconds.',
                    'rate_limit': rate_info
                })
                response.status_code = 429
                response.headers['Retry-After'] = str(rate_info['retry_after'])
                return response
            
            # Add rate limit headers to response
            response = f(*args, **kwargs)
            if hasattr(response, 'headers'):
                response.headers['X-RateLimit-Limit'] = str(60)  # requests per minute
                response.headers['X-RateLimit-Remaining'] = str(rate_info['requests_remaining'])
                response.headers['X-RateLimit-Reset'] = str(rate_info['reset_time'])
            
            return response
        
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator