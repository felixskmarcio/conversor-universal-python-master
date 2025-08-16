#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Centralized logging configuration
"""

import logging
import logging.handlers
import sys
from pathlib import Path
from typing import Optional
import json
from datetime import datetime


class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON"""
        log_entry = {
            'timestamp': datetime.fromtimestamp(record.created).isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # Add exception info if present
        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)
        
        # Add extra fields
        for key, value in record.__dict__.items():
            if key not in ['name', 'msg', 'args', 'levelname', 'levelno', 'pathname',
                          'filename', 'module', 'lineno', 'funcName', 'created',
                          'msecs', 'relativeCreated', 'thread', 'threadName',
                          'processName', 'process', 'getMessage', 'exc_info',
                          'exc_text', 'stack_info']:
                log_entry[key] = value
        
        return json.dumps(log_entry, ensure_ascii=False)


class SecurityFilter(logging.Filter):
    """Filter to remove sensitive information from logs"""
    
    SENSITIVE_PATTERNS = [
        'password', 'token', 'key', 'secret', 'auth',
        'credential', 'session', 'cookie'
    ]
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Filter sensitive information from log records"""
        message = record.getMessage().lower()
        
        # Check if message contains sensitive information
        for pattern in self.SENSITIVE_PATTERNS:
            if pattern in message:
                record.msg = "[REDACTED - Sensitive information]"
                record.args = ()
                break
        
        return True


def setup_logging(
    log_level: str = 'INFO',
    log_dir: Optional[Path] = None,
    app_name: str = 'conversor',
    enable_json: bool = False,
    enable_console: bool = True
) -> logging.Logger:
    """
    Set up centralized logging configuration.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_dir: Directory for log files
        app_name: Application name for log files
        enable_json: Enable JSON formatting
        enable_console: Enable console logging
    
    Returns:
        Configured logger instance
    """
    # Create logger
    logger = logging.getLogger(app_name)
    logger.setLevel(getattr(logging, log_level.upper()))
    
    # Clear existing handlers
    logger.handlers.clear()
    
    # Create formatters
    if enable_json:
        formatter = JSONFormatter()
    else:
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s'
        )
    
    # Console handler
    if enable_console:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)
        console_handler.addFilter(SecurityFilter())
        logger.addHandler(console_handler)
    
    # File handlers
    if log_dir:
        log_dir = Path(log_dir)
        log_dir.mkdir(parents=True, exist_ok=True)
        
        # Main log file (rotating)
        file_handler = logging.handlers.RotatingFileHandler(
            log_dir / f'{app_name}.log',
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=5
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        file_handler.addFilter(SecurityFilter())
        logger.addHandler(file_handler)
        
        # Error log file
        error_handler = logging.handlers.RotatingFileHandler(
            log_dir / f'{app_name}_error.log',
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=5
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        error_handler.addFilter(SecurityFilter())
        logger.addHandler(error_handler)
        
        # Security log file
        security_handler = logging.handlers.RotatingFileHandler(
            log_dir / f'{app_name}_security.log',
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=10
        )
        security_handler.setLevel(logging.WARNING)
        security_handler.setFormatter(formatter)
        logger.addHandler(security_handler)
    
    return logger


def get_request_logger() -> logging.Logger:
    """Get logger for request tracking"""
    logger = logging.getLogger('conversor.requests')
    return logger


def get_security_logger() -> logging.Logger:
    """Get logger for security events"""
    logger = logging.getLogger('conversor.security')
    return logger


def get_performance_logger() -> logging.Logger:
    """Get logger for performance monitoring"""
    logger = logging.getLogger('conversor.performance')
    return logger


def log_request(request_id: str, method: str, path: str, ip: str, user_agent: str = None):
    """Log incoming request"""
    logger = get_request_logger()
    logger.info(
        "Request received",
        extra={
            'request_id': request_id,
            'method': method,
            'path': path,
            'client_ip': ip,
            'user_agent': user_agent
        }
    )


def log_security_event(event_type: str, details: dict, severity: str = 'WARNING'):
    """Log security event"""
    logger = get_security_logger()
    level = getattr(logging, severity.upper())
    logger.log(
        level,
        f"Security event: {event_type}",
        extra={
            'event_type': event_type,
            'security_details': details
        }
    )


def log_performance(operation: str, duration: float, details: dict = None):
    """Log performance metrics"""
    logger = get_performance_logger()
    logger.info(
        f"Performance: {operation}",
        extra={
            'operation': operation,
            'duration_ms': duration * 1000,
            'performance_details': details or {}
        }
    )