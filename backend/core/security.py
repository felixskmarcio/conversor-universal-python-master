#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Security validation and sanitization utilities
"""

import os
import magic
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from werkzeug.utils import secure_filename
from dataclasses import dataclass

@dataclass
class SecurityValidationResult:
    """Result of security validation"""
    is_valid: bool
    message: str
    risk_level: str = "low"  # low, medium, high, critical
    details: Optional[Dict] = None

class FileSecurityValidator:
    """Comprehensive file security validation"""
    
    # MIME type whitelist
    ALLOWED_MIME_TYPES = {
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'text/html',
        'text/markdown',
        'text/x-markdown'
    }
    
    # File extension whitelist
    ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.doc', '.txt', '.html', '.htm', '.md', '.markdown'}
    
    # Maximum file sizes (in bytes)
    MAX_FILE_SIZES = {
        '.pdf': 50 * 1024 * 1024,    # 50MB
        '.docx': 25 * 1024 * 1024,   # 25MB
        '.doc': 25 * 1024 * 1024,    # 25MB
        '.txt': 10 * 1024 * 1024,    # 10MB
        '.html': 10 * 1024 * 1024,   # 10MB
        '.htm': 10 * 1024 * 1024,    # 10MB
        '.md': 5 * 1024 * 1024,      # 5MB
        '.markdown': 5 * 1024 * 1024 # 5MB
    }
    
    # Dangerous file signatures (magic bytes)
    DANGEROUS_SIGNATURES = [
        b'\x4d\x5a',  # PE executable
        b'\x7f\x45\x4c\x46',  # ELF executable
        b'\xca\xfe\xba\xbe',  # Java class file
        b'\xfe\xed\xfa',  # Mach-O executable
    ]
    
    def __init__(self):
        self.magic_mime = magic.Magic(mime=True) if magic else None
    
    def validate_filename(self, filename: str) -> SecurityValidationResult:
        """Validate filename for security issues"""
        if not filename:
            return SecurityValidationResult(
                is_valid=False,
                message="Empty filename",
                risk_level="high"
            )
        
        # Check for path traversal attempts
        if '..' in filename or '/' in filename or '\\' in filename:
            return SecurityValidationResult(
                is_valid=False,
                message="Path traversal attempt detected",
                risk_level="critical",
                details={"filename": filename}
            )
        
        # Check for null bytes
        if '\x00' in filename:
            return SecurityValidationResult(
                is_valid=False,
                message="Null byte in filename",
                risk_level="high"
            )
        
        # Check extension
        ext = Path(filename).suffix.lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            return SecurityValidationResult(
                is_valid=False,
                message=f"File extension '{ext}' not allowed",
                risk_level="medium",
                details={"extension": ext, "allowed": list(self.ALLOWED_EXTENSIONS)}
            )
        
        return SecurityValidationResult(
            is_valid=True,
            message="Filename validation passed"
        )
    
    def validate_file_content(self, file_path: Path) -> SecurityValidationResult:
        """Validate file content for security issues"""
        try:
            # Check file size
            file_size = file_path.stat().st_size
            ext = file_path.suffix.lower()
            max_size = self.MAX_FILE_SIZES.get(ext, 16 * 1024 * 1024)  # Default 16MB
            
            if file_size > max_size:
                return SecurityValidationResult(
                    is_valid=False,
                    message=f"File too large: {file_size} bytes (max: {max_size})",
                    risk_level="medium",
                    details={"size": file_size, "max_size": max_size}
                )
            
            # Check MIME type
            if self.magic_mime:
                mime_type = self.magic_mime.from_file(str(file_path))
                if mime_type not in self.ALLOWED_MIME_TYPES:
                    return SecurityValidationResult(
                        is_valid=False,
                        message=f"MIME type '{mime_type}' not allowed",
                        risk_level="high",
                        details={"mime_type": mime_type, "allowed": list(self.ALLOWED_MIME_TYPES)}
                    )
            
            # Check for dangerous file signatures
            with open(file_path, 'rb') as f:
                header = f.read(1024)  # Read first 1KB
                
                for signature in self.DANGEROUS_SIGNATURES:
                    if header.startswith(signature):
                        return SecurityValidationResult(
                            is_valid=False,
                            message="Dangerous file signature detected",
                            risk_level="critical",
                            details={"signature": signature.hex()}
                        )
            
            return SecurityValidationResult(
                is_valid=True,
                message="File content validation passed"
            )
            
        except Exception as e:
            return SecurityValidationResult(
                is_valid=False,
                message=f"Validation error: {str(e)}",
                risk_level="high",
                details={"error": str(e)}
            )
    
    def sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe storage"""
        # Use Werkzeug's secure_filename
        safe_name = secure_filename(filename)
        
        # Additional sanitization
        safe_name = safe_name.replace(' ', '_')
        safe_name = ''.join(c for c in safe_name if c.isalnum() or c in '._-')
        
        # Ensure we have an extension
        if '.' not in safe_name:
            safe_name += '.txt'
        
        return safe_name
    
    def validate_upload(self, file_storage, filename: str = None) -> SecurityValidationResult:
        """Comprehensive upload validation"""
        if not file_storage:
            return SecurityValidationResult(
                is_valid=False,
                message="No file provided",
                risk_level="medium"
            )
        
        # Use provided filename or get from file storage
        filename = filename or file_storage.filename
        if not filename:
            return SecurityValidationResult(
                is_valid=False,
                message="No filename provided",
                risk_level="medium"
            )
        
        # Validate filename
        filename_result = self.validate_filename(filename)
        if not filename_result.is_valid:
            return filename_result
        
        # Create temporary file for content validation
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            file_storage.save(tmp_file.name)
            tmp_path = Path(tmp_file.name)
        
        try:
            # Validate content
            content_result = self.validate_file_content(tmp_path)
            return content_result
        finally:
            # Clean up temporary file
            tmp_path.unlink(missing_ok=True)

class InputSanitizer:
    """Sanitize user inputs"""
    
    @staticmethod
    def sanitize_text(text: str, max_length: int = 1000) -> str:
        """Sanitize text input"""
        if not text:
            return ""
        
        # Remove null bytes and control characters
        text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\r\t')
        
        # Limit length
        if len(text) > max_length:
            text = text[:max_length]
        
        return text.strip()
    
    @staticmethod
    def sanitize_format(format_str: str) -> Optional[str]:
        """Sanitize format parameter"""
        if not format_str:
            return None
        
        format_str = format_str.lower().strip()
        allowed_formats = {'pdf', 'docx', 'txt', 'html', 'md', 'markdown'}
        
        return format_str if format_str in allowed_formats else None