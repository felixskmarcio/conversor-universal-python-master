# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Quick Setup (Recommended)
```bash
# Windows - Automated setup with debug mode
.\activate.bat              # Complete setup with debug logging

# Linux/Mac - Automated setup
./scripts/setup.sh          # Complete setup script
```

### Backend (Python Flask)
```bash
# Manual development setup
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate.bat  # Windows
pip install -r backend/requirements.txt

# Run backend server
cd backend
python app.py  # Starts on http://localhost:5000

# Alternative startup methods
./scripts/setup.sh          # Linux/Mac automated setup
./scripts/setup.bat         # Windows automated setup
.\activate.bat              # Windows with debug mode
```

### Frontend (Next.js)
```bash
# Install dependencies
npm install

# Development server
npm run dev      # Starts on http://localhost:3000

# Build for production
npm run build
npm start

# Linting
npm run lint
```

### Docker Deployment
```bash
# Single container
docker build -t conversor-universal .
docker run -p 5000:8000 conversor-universal

# Full stack with docker-compose
docker-compose up -d
# Services: app (port 5000), redis, postgres, nginx (ports 80/443)
```

### Testing
```bash
# Python tests (if available)
pytest backend/tests/
pytest --cov=backend --cov-report=html

# Security scanning
safety check                    # Vulnerability check
bandit -r backend/ -f json      # Security analysis
```

## Architecture Overview

### Project Structure
This is a **full-stack document conversion application** with:

- **Backend**: Flask-based Python API (`backend/`) for document processing
- **Frontend**: Next.js React application (`src/`) for modern UI
- **Hybrid Architecture**: Backend serves both API endpoints and embedded HTML template

### Key Components

#### Backend Architecture (`backend/`)
- **Main Application**: `app.py` - Flask server with conversion engine
- **Configuration**: `config.py` - Environment-based config management
- **Core Converter**: `ConversorUniversalMelhorado` class handles all format conversions
- **API Endpoints**: 
  - `POST /converter` - File upload and conversion
  - `GET /formatos` - Supported formats list
  - `GET /` - Embedded HTML interface

#### Frontend Architecture (`src/`)
- **Next.js 15** with **React 19** and **TypeScript**
- **Tailwind CSS** with custom UI components (`src/components/ui/`)
- **Shadcn/ui** component library integration
- **React Dropzone** for file uploads
- **Responsive design** with modern UX patterns

### Document Conversion Engine
The core converter supports bidirectional conversion between:
- **PDF** ↔ DOCX, TXT, HTML, MD  
- **DOCX** ↔ PDF, TXT, HTML, MD
- **TXT** ↔ PDF, DOCX, HTML, MD
- **HTML** ↔ PDF, DOCX, TXT, MD
- **Markdown** ↔ PDF, DOCX, TXT, HTML

**Key Features:**
- **Structure Preservation**: Detects academic document structures (titles, institutions, references)
- **Smart Formatting**: Maintains formatting across conversions
- **Security Validation**: MIME type checking and file sanitization
- **Error Handling**: Robust error handling with detailed feedback

### Dependencies Management

#### Python Dependencies (`backend/requirements.txt`)
- **Flask 2.3.3** + **Flask-Cors** - Web framework
- **python-docx 0.8.11** - DOCX processing  
- **pdfplumber 0.9.0** + **reportlab 4.0.4** - PDF handling
- **beautifulsoup4 4.12.2** - HTML parsing
- **markdown 3.5.1** - Markdown processing
- **python-magic-bin** - File type detection

#### Node Dependencies (`package.json`)
- **Next.js 15.4.4** with **React 19.1.0**
- **@radix-ui components** - Accessible UI primitives (dropdown-menu, label, progress, separator, slot)
- **Tailwind CSS 4** with **@tailwindcss/typography** - Styling framework
- **Lucide React 0.526.0** - Icon library
- **React Dropzone 14.3.8** - File upload handling
- **Class Variance Authority** - Component styling utilities
- **Tailwindcss Animate** - Animation utilities

## Development Guidelines

### File Organization
- **Backend code**: Place in `backend/` directory
- **Frontend components**: Use `src/components/` with UI components in `src/components/ui/`
- **Configuration**: Use `backend/config.py` for backend settings
- **Static assets**: Place in `public/` for Next.js or `static/` for Flask

### API Integration
The frontend can integrate with backend via:
- **Direct API calls** to `http://localhost:5000/converter`
- **CORS enabled** for cross-origin requests from Next.js frontend
- **File upload** using `multipart/form-data` with format specification

### Security Considerations
- **File validation**: Always validate file types using both extension and MIME type
- **Size limits**: 16MB max file size (configurable in config.py)
- **Sanitization**: Files are processed in isolated temporary directories
- **Rate limiting**: Configurable request rate limits

### Environment Configuration
- Use `.env` files for environment variables
- **Development**: Automatic setup via `scripts/setup.sh` or `scripts/setup.bat`
- **Windows Debug Mode**: Use `activate.bat` for enhanced debugging with detailed logging
- **Production**: Use Docker with environment variables
- **Configuration classes**: `DevelopmentConfig`, `ProductionConfig`, `TestingConfig` in `config.py`

### Debug System (Windows)
The `activate.bat` script includes an advanced debug system:
- **Debug Logging**: Detailed logs saved to `setup_debug.log`
- **Visual Progress**: Color-coded output with step-by-step progress
- **Strategic Pauses**: Optional pauses between steps for better visibility
- **Error Tracking**: Comprehensive error logging and troubleshooting
- **Tool Verification**: Automatic verification of winget, Python, Node.js, and npm
- **Dependency Management**: Smart installation and verification of project dependencies

For more details, see `DEBUG_README.md` and `SISTEMA_DEBUG_COMPLETO.md`

## Integration Points

### Frontend ↔ Backend Communication
- **API Endpoint**: `POST /converter` accepts file + target format
- **Response**: Direct file download or JSON error response
- **Progress**: Real-time conversion feedback via UI animations

### Docker Integration
- **Multi-service**: Backend + Frontend + Redis + PostgreSQL + Nginx
- **Health checks**: Configured for all services
- **Volume mounts**: Persistent storage for logs, uploads, temp files
- **Environment variables**: Centralized configuration

### Extension Points
- **New formats**: Add to `formatos_suportados` dict and implement read/write methods
- **UI components**: Follow existing patterns in `src/components/ui/`
- **Conversion options**: Extend via `CONVERSION_SETTINGS` in config.py
- **Security**: Additional validation in `allowed_file()` function

This architecture enables both standalone use (embedded Flask UI) and modern web app deployment (Next.js + API), providing flexibility for different deployment scenarios.