#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Arquivo de Configuração do Conversor Universal
Personalize as configurações do aplicativo aqui.
"""

import os
from pathlib import Path

class Config:
    """Configurações principais do aplicativo"""
    
    # Configurações do servidor
    HOST = '0.0.0.0'  # '127.0.0.1' para acesso local apenas
    PORT = 5000
    DEBUG = True  # Altere para False em produção
    
    # Configurações de upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    ALLOWED_EXTENSIONS = {
        'pdf', 'docx', 'doc', 'txt', 'html', 'htm', 'md', 'markdown'
    }
    
    # Diretórios
    BASE_DIR = Path(__file__).parent
    UPLOAD_FOLDER = BASE_DIR / 'uploads'
    TEMP_FOLDER = BASE_DIR / 'temp'
    TEMPLATES_FOLDER = BASE_DIR / 'templates'
    
    # Configurações de conversão
    CONVERSION_SETTINGS = {
        'pdf': {
            'page_size': 'A4',  # A4, letter, legal
            'margin': 72,  # pontos (1 inch = 72 points)
            'font_size': 12,
            'font_family': 'Helvetica'
        },
        'docx': {
            'font_size': 12,
            'font_family': 'Calibri',
            'line_spacing': 1.15
        },
        'html': {
            'css_framework': 'bootstrap',  # bootstrap, bulma, custom
            'theme': 'light',  # light, dark
            'responsive': True
        },
        'markdown': {
            'extensions': ['tables', 'codehilite', 'toc'],
            'code_theme': 'github'  # github, monokai, solarized
        }
    }
    
    # Configurações de segurança
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-change-in-production'
    
    # Configurações de logging
    LOG_LEVEL = 'INFO'  # DEBUG, INFO, WARNING, ERROR
    LOG_FILE = BASE_DIR / 'logs' / 'conversor.log'
    
    # Configurações de performance
    MAX_WORKERS = 4  # Número de workers para processamento paralelo
    TIMEOUT = 300  # Timeout em segundos para conversões
    
    # Configurações de cache
    ENABLE_CACHE = True
    CACHE_TIMEOUT = 3600  # 1 hora em segundos
    
    # Configurações de interface
    UI_SETTINGS = {
        'theme_color': '#667eea',
        'accent_color': '#764ba2',
        'success_color': '#4CAF50',
        'error_color': '#f44336',
        'warning_color': '#ff9800',
        'language': 'pt-BR',  # pt-BR, en-US, es-ES
        'show_advanced_options': False,
        'enable_drag_drop': True,
        'auto_detect_format': True
    }
    
    # Configurações de qualidade
    QUALITY_SETTINGS = {
        'pdf_dpi': 300,  # DPI para imagens em PDF
        'image_compression': 85,  # Qualidade de compressão (0-100)
        'preserve_formatting': True,
        'extract_images': False,  # Extrair imagens durante conversão
        'ocr_enabled': False  # OCR para PDFs escaneados (requer tesseract)
    }
    
    # Mensagens personalizadas
    MESSAGES = {
        'pt-BR': {
            'upload_success': 'Arquivo enviado com sucesso!',
            'conversion_success': 'Conversão realizada com sucesso!',
            'conversion_error': 'Erro durante a conversão.',
            'file_too_large': 'Arquivo muito grande. Tamanho máximo: {max_size}MB',
            'invalid_format': 'Formato de arquivo não suportado.',
            'processing': 'Processando seu documento...',
            'download_ready': 'Download pronto!'
        },
        'en-US': {
            'upload_success': 'File uploaded successfully!',
            'conversion_success': 'Conversion completed successfully!',
            'conversion_error': 'Error during conversion.',
            'file_too_large': 'File too large. Maximum size: {max_size}MB',
            'invalid_format': 'Unsupported file format.',
            'processing': 'Processing your document...',
            'download_ready': 'Download ready!'
        }
    }
    
    @classmethod
    def init_app(cls, app):
        """Inicializa configurações no app Flask"""
        # Cria diretórios necessários
        cls.UPLOAD_FOLDER.mkdir(exist_ok=True)
        cls.TEMP_FOLDER.mkdir(exist_ok=True)
        cls.LOG_FILE.parent.mkdir(exist_ok=True)
        
        # Configura Flask
        app.config['MAX_CONTENT_LENGTH'] = cls.MAX_CONTENT_LENGTH
        app.config['UPLOAD_FOLDER'] = str(cls.UPLOAD_FOLDER)
        app.config['SECRET_KEY'] = cls.SECRET_KEY
        
        return app

class DevelopmentConfig(Config):
    """Configurações para desenvolvimento"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    ENABLE_CACHE = False

class ProductionConfig(Config):
    """Configurações para produção"""
    DEBUG = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    LOG_LEVEL = 'WARNING'
    HOST = '0.0.0.0'

    SECRET_KEY = os.environ.get('SECRET_KEY')
    if not SECRET_KEY:
        raise ValueError("A SECRET_KEY deve ser definida na variável de ambiente em produção.")

class TestingConfig(Config):
    """Configurações para testes"""
    TESTING = True
    DEBUG = True
    MAX_CONTENT_LENGTH = 1 * 1024 * 1024  # 1MB para testes

# Configuração padrão
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(config_name=None):
    """Retorna a configuração baseada no ambiente"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    return config.get(config_name, config['default'])