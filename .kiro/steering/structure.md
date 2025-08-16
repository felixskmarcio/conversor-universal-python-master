# Project Structure & Organization

## Root Directory Layout
```
conversor-universal/
├── backend/           # Python Flask API server
├── src/              # Next.js frontend application  
├── docs/             # Project documentation
├── docker/           # Docker configuration files
├── scripts/          # Setup and deployment scripts
├── public/           # Static assets for frontend
├── printscreens/     # Project screenshots
└── .kiro/            # Kiro AI assistant configuration
```

## Backend Structure (`backend/`)
```
backend/
├── app.py            # Main Flask application entry point
├── config.py         # Configuration management (dev/prod/test)
├── requirements.txt  # Python dependencies
├── api/              # API endpoints and routes
│   ├── routes.py     # Main API routes
│   ├── auth.py       # Authentication logic
│   └── validators.py # Input validation
├── core/             # Business logic layer
│   ├── converter.py  # Document conversion engine
│   ├── security.py   # Security validations
│   └── utils.py      # Utility functions
└── models/           # Data models
    └── document.py   # Document model definitions
```

## Frontend Structure (`src/`)
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
└── lib/              # Utility libraries and helpers
```

## Configuration Files (Root)
- `package.json` - Node.js dependencies and scripts
- `next.config.ts` - Next.js build configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.mjs` - Code linting rules
- `docker-compose.yml` - Multi-container orchestration
- `Dockerfile` - Container build instructions

## Documentation (`docs/`)
- `API.md` - REST API documentation
- `SECURITY.md` - Security guidelines and measures
- `DEPLOYMENT.md` - Production deployment guide
- `CONTRIBUTING.md` - Contribution guidelines

## Key Architectural Patterns

### Backend Patterns
- **Layered Architecture**: API → Core → Models separation
- **Configuration Management**: Environment-specific configs in `config.py`
- **Security-First**: Input validation and sanitization at API layer
- **Modular Conversion**: Document processing engines in `core/converter.py`

### Frontend Patterns
- **Component-Based**: Reusable UI components with Radix UI
- **Custom Hooks**: Business logic abstraction in `hooks/`
- **Utility-First CSS**: Tailwind with custom design system
- **Type Safety**: Strict TypeScript throughout

### File Naming Conventions
- **Python**: `snake_case` for files and functions
- **TypeScript/React**: `kebab-case` for files, `PascalCase` for components
- **Configuration**: Descriptive names (e.g., `docker-compose.yml`)
- **Documentation**: `UPPERCASE.md` for important docs

### Import/Export Patterns
- **Backend**: Relative imports within modules, absolute for cross-module
- **Frontend**: Barrel exports from component directories
- **Path Aliases**: `@/*` mapped to `./src/*` in TypeScript

### Environment Management
- **Development**: Local Flask server + Next.js dev server
- **Production**: Docker containers with Nginx reverse proxy
- **Configuration**: Environment variables for sensitive data
- **Secrets**: Never commit secrets, use `.env` files (gitignored)