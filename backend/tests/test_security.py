#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Security validation tests
"""

import pytest
import tempfile
from pathlib import Path
from werkzeug.datastructures import FileStorage
from io import BytesIO

from ..core.security import FileSecurityValidator, InputSanitizer, SecurityValidationResult


class TestFileSecurityValidator:
    """Test file security validation"""
    
    def setup_method(self):
        """Setup test fixtures"""
        self.validator = FileSecurityValidator()
    
    def test_validate_filename_valid(self):
        """Test valid filename validation"""
        result = self.validator.validate_filename("document.pdf")
        assert result.is_valid
        assert result.risk_level == "low"
    
    def test_validate_filename_path_traversal(self):
        """Test path traversal detection"""
        result = self.validator.validate_filename("../../../etc/passwd")
        assert not result.is_valid
        assert result.risk_level == "critical"
        assert "path traversal" in result.message.lower()
    
    def test_validate_filename_null_byte(self):
        """Test null byte detection"""
        result = self.validator.validate_filename("document\x00.pdf")
        assert not result.is_valid
        assert result.risk_level == "high"
    
    def test_validate_filename_invalid_extension(self):
        """Test invalid extension rejection"""
        result = self.validator.validate_filename("malware.exe")
        assert not result.is_valid
        assert result.risk_level == "medium"
    
    def test_validate_file_content_size_limit(self):
        """Test file size validation"""
        # Create oversized file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
            tmp.write(b'x' * (60 * 1024 * 1024))  # 60MB
            tmp_path = Path(tmp.name)
        
        try:
            result = self.validator.validate_file_content(tmp_path)
            assert not result.is_valid
            assert "too large" in result.message.lower()
        finally:
            tmp_path.unlink(missing_ok=True)
    
    def test_validate_upload_complete_flow(self):
        """Test complete upload validation flow"""
        # Create valid file
        file_content = b'%PDF-1.4\n%Test PDF content'
        file_storage = FileStorage(
            stream=BytesIO(file_content),
            filename='test.pdf',
            content_type='application/pdf'
        )
        
        result = self.validator.validate_upload(file_storage)
        assert result.is_valid
    
    def test_sanitize_filename(self):
        """Test filename sanitization"""
        dangerous_name = "../../../etc/passwd<script>alert('xss')</script>"
        safe_name = self.validator.sanitize_filename(dangerous_name)
        
        assert ".." not in safe_name
        assert "/" not in safe_name
        assert "<" not in safe_name
        assert ">" not in safe_name


class TestInputSanitizer:
    """Test input sanitization"""
    
    def test_sanitize_text_basic(self):
        """Test basic text sanitization"""
        text = "Hello\x00World\x01Test"
        sanitized = InputSanitizer.sanitize_text(text)
        assert "\x00" not in sanitized
        assert "\x01" not in sanitized
        assert "HelloWorldTest" == sanitized
    
    def test_sanitize_text_length_limit(self):
        """Test text length limiting"""
        long_text = "x" * 2000
        sanitized = InputSanitizer.sanitize_text(long_text, max_length=100)
        assert len(sanitized) == 100
    
    def test_sanitize_format_valid(self):
        """Test valid format sanitization"""
        assert InputSanitizer.sanitize_format("PDF") == "pdf"
        assert InputSanitizer.sanitize_format("  DOCX  ") == "docx"
    
    def test_sanitize_format_invalid(self):
        """Test invalid format rejection"""
        assert InputSanitizer.sanitize_format("exe") is None
        assert InputSanitizer.sanitize_format("") is None
        assert InputSanitizer.sanitize_format(None) is None


@pytest.fixture
def sample_files():
    """Create sample files for testing"""
    files = {}
    
    # Valid PDF
    pdf_content = b'%PDF-1.4\n%Test PDF content'
    files['valid_pdf'] = FileStorage(
        stream=BytesIO(pdf_content),
        filename='test.pdf',
        content_type='application/pdf'
    )
    
    # Malicious file
    exe_content = b'MZ\x90\x00'  # PE executable header
    files['malicious_exe'] = FileStorage(
        stream=BytesIO(exe_content),
        filename='malware.pdf',  # Disguised as PDF
        content_type='application/pdf'
    )
    
    return files


def test_security_integration(sample_files):
    """Integration test for security validation"""
    validator = FileSecurityValidator()
    
    # Test valid file
    result = validator.validate_upload(sample_files['valid_pdf'])
    assert result.is_valid
    
    # Test malicious file
    result = validator.validate_upload(sample_files['malicious_exe'])
    assert not result.is_valid
    assert result.risk_level in ['high', 'critical']