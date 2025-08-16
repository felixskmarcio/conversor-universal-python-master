#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Custom exception hierarchy for the document converter application.
Following PEP 8 and best practices for exception handling.
"""

from typing import Optional, Dict, Any


class ConverterError(Exception):
    """Base exception class for all converter-related errors."""
    
    def __init__(
        self, 
        message: str, 
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Initialize converter error.
        
        Args:
            message: Human-readable error message
            error_code: Machine-readable error code
            details: Additional error details
        """
        super().__init__(message)
        self.message = message
        self.error_code = error_code or self.__class__.__name__
        self.details = details or {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary for JSON serialization."""
        return {
            'error': self.error_code,
            'message': self.message,
            'details': self.details
        }


class ValidationError(ConverterError):
    """Raised when input validation fails."""
    pass


class SecurityError(ConverterError):
    """Raised when security validation fails."""
    pass


class ConversionError(ConverterError):
    """Raised when document conversion fails."""
    pass


class UnsupportedFormatError(ConversionError):
    """Raised when trying to convert unsupported format."""
    pass


class FileNotFoundError(ConverterError):
    """Raised when required file is not found."""
    pass


class FileTooLargeError(ValidationError):
    """Raised when file exceeds size limits."""
    pass


class InvalidMimeTypeError(SecurityError):
    """Raised when file has invalid MIME type."""
    pass


class PathTraversalError(SecurityError):
    """Raised when path traversal attempt is detected."""
    pass


class ProcessingTimeoutError(ConversionError):
    """Raised when processing takes too long."""
    pass


class DependencyError(ConverterError):
    """Raised when required dependency is missing."""
    pass