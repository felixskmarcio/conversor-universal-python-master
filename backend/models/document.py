#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Document models and data structures
"""

from dataclasses import dataclass
from typing import Optional, Dict, Any
from pathlib import Path
from werkzeug.datastructures import FileStorage
from ..core.converter import DocumentFormat

@dataclass
class ConversionRequest:
    """Request model for document conversion"""
    filename: str
    target_format: DocumentFormat
    file_data: FileStorage
    options: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        """Validate request data"""
        if not self.filename:
            raise ValueError("Filename is required")
        if not self.target_format:
            raise ValueError("Target format is required")
        if not self.file_data:
            raise ValueError("File data is required")

@dataclass
class ConversionResponse:
    """Response model for document conversion"""
    success: bool
    message: str
    output_path: Optional[Path] = None
    filename: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    details: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            'success': self.success,
            'message': self.message,
            'filename': self.filename,
            'metadata': self.metadata,
            'details': self.details
        }

@dataclass
class DocumentInfo:
    """Document information model"""
    filename: str
    format: DocumentFormat
    size: int
    mime_type: str
    created_at: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None