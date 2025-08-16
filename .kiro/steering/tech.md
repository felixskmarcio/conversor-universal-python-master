# Technology Stack & Build System

## Architecture
**Full-stack application** with Python Flask backend and Next.js frontend, containerized with Docker for production deployment.

## Backend Stack
- **Framework**: Flask 2.3.3 with Flask-CORS
- **Language**: Python 3.9+ 
- **Document Processing**: 
  - `python-docx` (DOCX manipulation)
  - `pdfplumber` (PDF extraction)
  - `reportlab` (PDF generation)
  - `beautifulsoup4` (HTML parsing)
  - `markdown` (Markdown processing)
- **Security**: Input validation, MIME type checking, sandboxed processing
- **Server**: Gunicorn for production, Flask dev server for development

## Frontend Stack
- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4 with custom animations
- **Components**: Radix UI primitives (@radix-ui/react-*)
- **Icons**: Lucide React
- **File Upload**: react-dropzone

## Development Tools
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript with strict mode
- **CSS**: PostCSS with Tailwind
- **Package Manager**: npm (package-lock.json present)

## Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for local development
- **Reverse Proxy**: Nginx for production
- **Caching**: Redis for sessions and rate limiting
- **Database**: PostgreSQL (optional, for conversion history)

## Common Commands

### Development
```bash
# Backend development
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python app.py

# Frontend development  
npm install
npm run dev

# Full stack with Docker
docker-compose up -d
```

### Production
```bash
# Build and deploy
docker-compose -f docker-compose.yml up -d

# Manual production setup
pip install -r requirements.txt
gunicorn -c gunicorn.conf.py backend.app:app

# Frontend build
npm run build
npm start
```

### Testing & Quality
```bash
# Python testing (when implemented)
pytest
pytest --cov=backend

# Security scanning
safety check
bandit -r backend/

# Frontend linting
npm run lint
```

## Configuration Files
- `backend/config.py`: Application configuration with environment-specific settings
- `docker-compose.yml`: Multi-service orchestration
- `gunicorn.conf.py`: Production WSGI server configuration
- `next.config.ts`: Next.js build configuration
- `tailwind.config.ts`: Styling framework configuration