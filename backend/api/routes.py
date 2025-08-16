#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
API Routes - Clean separation of concerns
"""

from flask import Blueprint, request, jsonify, send_file
from werkzeug.exceptions import RequestEntityTooLarge
from pathlib import Path
import logging
from typing import Dict, Any

from ..core.converter import DocumentProcessorFactory, DocumentFormat
from ..core.security import FileSecurityValidator, InputSanitizer
from ..models.document import ConversionRequest, ConversionResponse

# Create blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

# Initialize components
security_validator = FileSecurityValidator()
document_processor = DocumentProcessorFactory.create_default_processor()
logger = logging.getLogger(__name__)

class APIError(Exception):
    """Custom API exception"""
    def __init__(self, message: str, status_code: int = 400, details: Dict = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

@api_bp.errorhandler(APIError)
def handle_api_error(error: APIError):
    """Handle custom API errors"""
    response = {
        'success': False,
        'error': error.message,
        'details': error.details
    }
    return jsonify(response), error.status_code

@api_bp.errorhandler(RequestEntityTooLarge)
def handle_file_too_large(error):
    """Handle file too large errors"""
    return jsonify({
        'success': False,
        'error': 'File too large',
        'details': {'max_size': '16MB'}
    }), 413

@api_bp.errorhandler(Exception)
def handle_generic_error(error):
    """Handle unexpected errors"""
    logger.error(f"Unexpected error: {str(error)}", exc_info=True)
    return jsonify({
        'success': False,
        'error': 'Internal server error',
        'details': {'message': 'An unexpected error occurred'}
    }), 500

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0',
        'timestamp': '2024-01-01T00:00:00Z'
    })

@api_bp.route('/formats', methods=['GET'])
def list_formats():
    """List supported formats"""
    formats = {
        'supported_formats': [format.value for format in DocumentFormat],
        'conversions': {
            'pdf': ['docx', 'txt', 'html', 'md'],
            'docx': ['pdf', 'txt', 'html', 'md'],
            'txt': ['pdf', 'docx', 'html', 'md'],
            'html': ['pdf', 'docx', 'txt', 'md'],
            'md': ['pdf', 'docx', 'txt', 'html']
        }
    }
    return jsonify(formats)

@api_bp.route('/convert', methods=['POST'])
def convert_document():
    """Convert document endpoint"""
    try:
        # Validate request
        if 'file' not in request.files:
            raise APIError('No file provided', 400)
        
        file = request.files['file']
        target_format = request.form.get('target_format')
        
        if not file or not file.filename:
            raise APIError('No file selected', 400)
        
        # Sanitize inputs
        target_format = InputSanitizer.sanitize_format(target_format)
        if not target_format:
            raise APIError('Invalid or missing target format', 400)
        
        # Security validation
        validation_result = security_validator.validate_upload(file)
        if not validation_result.is_valid:
            raise APIError(
                validation_result.message,
                400 if validation_result.risk_level in ['low', 'medium'] else 403,
                validation_result.details
            )
        
        # Create conversion request
        conversion_request = ConversionRequest(
            filename=security_validator.sanitize_filename(file.filename),
            target_format=DocumentFormat(target_format),
            file_data=file
        )
        
        # Process conversion
        result = process_conversion(conversion_request)
        
        # Return response
        if result.success:
            return send_file(
                result.output_path,
                as_attachment=True,
                download_name=result.filename
            )
        else:
            raise APIError(result.message, 500, result.details)
            
    except APIError:
        raise
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}", exc_info=True)
        raise APIError('Conversion failed', 500, {'error': str(e)})

def process_conversion(request: ConversionRequest) -> ConversionResponse:
    """Process document conversion"""
    try:
        # Save uploaded file temporarily
        temp_input = Path(f"/tmp/{request.filename}")
        request.file_data.save(str(temp_input))
        
        # Convert document
        result = document_processor.convert(
            input_path=temp_input,
            output_format=request.target_format
        )
        
        if result.success:
            return ConversionResponse(
                success=True,
                message="Conversion successful",
                output_path=result.output_path,
                filename=f"{temp_input.stem}_converted.{request.target_format.value}"
            )
        else:
            return ConversionResponse(
                success=False,
                message=result.message,
                details=result.error_details
            )
            
    except Exception as e:
        logger.error(f"Processing error: {str(e)}", exc_info=True)
        return ConversionResponse(
            success=False,
            message="Processing failed",
            details=str(e)
        )
    finally:
        # Cleanup
        if temp_input.exists():
            temp_input.unlink(missing_ok=True)