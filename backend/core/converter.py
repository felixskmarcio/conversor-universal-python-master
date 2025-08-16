#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Document Conversion Engine - Refactored with Design Patterns
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from pathlib import Path
import tempfile
import shutil
from dataclasses import dataclass
from enum import Enum

class DocumentFormat(Enum):
    """Supported document formats"""
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    HTML = "html"
    MARKDOWN = "md"

@dataclass
class ConversionResult:
    """Result of a document conversion operation"""
    success: bool
    message: str
    output_path: Optional[Path] = None
    metadata: Optional[Dict[str, Any]] = None
    error_details: Optional[str] = None

@dataclass
class DocumentMetadata:
    """Document metadata structure"""
    title: Optional[str] = None
    author: Optional[str] = None
    format: Optional[DocumentFormat] = None
    page_count: Optional[int] = None
    word_count: Optional[int] = None
    structure_elements: Optional[List[str]] = None

class DocumentReader(ABC):
    """Abstract base class for document readers"""
    
    @abstractmethod
    def can_read(self, file_path: Path) -> bool:
        """Check if this reader can handle the file"""
        pass
    
    @abstractmethod
    def read(self, file_path: Path) -> str:
        """Read document content"""
        pass
    
    @abstractmethod
    def extract_metadata(self, file_path: Path) -> DocumentMetadata:
        """Extract document metadata"""
        pass

class DocumentWriter(ABC):
    """Abstract base class for document writers"""
    
    @abstractmethod
    def can_write(self, format: DocumentFormat) -> bool:
        """Check if this writer can handle the format"""
        pass
    
    @abstractmethod
    def write(self, content: str, output_path: Path, metadata: Optional[DocumentMetadata] = None) -> ConversionResult:
        """Write document content"""
        pass

class DocumentProcessor:
    """Strategy pattern for document processing"""
    
    def __init__(self):
        self.readers: List[DocumentReader] = []
        self.writers: List[DocumentWriter] = []
        self.temp_dir = Path(tempfile.mkdtemp())
    
    def register_reader(self, reader: DocumentReader):
        """Register a document reader"""
        self.readers.append(reader)
    
    def register_writer(self, writer: DocumentWriter):
        """Register a document writer"""
        self.writers.append(writer)
    
    def get_reader(self, file_path: Path) -> Optional[DocumentReader]:
        """Get appropriate reader for file"""
        for reader in self.readers:
            if reader.can_read(file_path):
                return reader
        return None
    
    def get_writer(self, format: DocumentFormat) -> Optional[DocumentWriter]:
        """Get appropriate writer for format"""
        for writer in self.writers:
            if writer.can_write(format):
                return writer
        return None
    
    def convert(self, input_path: Path, output_format: DocumentFormat, 
                output_path: Optional[Path] = None) -> ConversionResult:
        """Convert document using strategy pattern"""
        try:
            # Get appropriate reader
            reader = self.get_reader(input_path)
            if not reader:
                return ConversionResult(
                    success=False,
                    message=f"No reader available for {input_path.suffix}",
                    error_details="Unsupported input format"
                )
            
            # Get appropriate writer
            writer = self.get_writer(output_format)
            if not writer:
                return ConversionResult(
                    success=False,
                    message=f"No writer available for {output_format.value}",
                    error_details="Unsupported output format"
                )
            
            # Read content and metadata
            content = reader.read(input_path)
            metadata = reader.extract_metadata(input_path)
            
            # Generate output path if not provided
            if not output_path:
                output_path = self.temp_dir / f"{input_path.stem}_converted.{output_format.value}"
            
            # Write converted content
            result = writer.write(content, output_path, metadata)
            
            return result
            
        except Exception as e:
            return ConversionResult(
                success=False,
                message="Conversion failed",
                error_details=str(e)
            )
    
    def __del__(self):
        """Cleanup temporary directory"""
        if hasattr(self, 'temp_dir') and self.temp_dir.exists():
            shutil.rmtree(self.temp_dir, ignore_errors=True)

# Factory pattern for creating processors
class DocumentProcessorFactory:
    """Factory for creating configured document processors"""
    
    @staticmethod
    def create_default_processor() -> DocumentProcessor:
        """Create processor with default readers and writers"""
        processor = DocumentProcessor()
        
        # Register readers (to be implemented)
        # processor.register_reader(PDFReader())
        # processor.register_reader(DOCXReader())
        # processor.register_reader(TXTReader())
        # processor.register_reader(HTMLReader())
        # processor.register_reader(MarkdownReader())
        
        # Register writers (to be implemented)
        # processor.register_writer(PDFWriter())
        # processor.register_writer(DOCXWriter())
        # processor.register_writer(TXTWriter())
        # processor.register_writer(HTMLWriter())
        # processor.register_writer(MarkdownWriter())
        
        return processor