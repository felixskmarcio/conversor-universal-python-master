#!/bin/bash
# Conversor Universal - Setup Script for Linux/Mac
# Automated installation and configuration

set -e  # Exit on any error

echo "🔄 Conversor Universal - Setup Automático"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 não está instalado"
        return 1
    else
        print_success "$1 encontrado"
        return 0
    fi
}

# Check system requirements
print_status "Verificando requisitos do sistema..."

# Check Python
if check_command python3; then
    python_version=$(python3 --version | cut -d' ' -f2)
    print_status "Python version: $python_version"
    
    # Check if version is >= 3.7
    if python3 -c "import sys; exit(0 if sys.version_info >= (3, 7) else 1)"; then
        print_success "Python version OK"
    else
        print_error "Python 3.7+ é necessário"
        exit 1
    fi
else
    print_error "Python 3 não está instalado"
    print_status "Instale Python 3.7+ e execute novamente"
    exit 1
fi

# Check pip
if ! check_command pip3; then
    print_warning "pip3 não encontrado, tentando instalar..."
    curl https://bootstrap.pypa.io/get-pip.py | python3
fi

# Check Node.js (for frontend)
if check_command node; then
    node_version=$(node --version)
    print_status "Node.js version: $node_version"
    
    if ! check_command npm; then
        print_error "npm não está instalado"
        exit 1
    fi
else
    print_warning "Node.js não encontrado, instalando..."
    
    # Install Node.js based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if check_command brew; then
            brew install node
        else
            print_error "Homebrew não encontrado. Instale Node.js manualmente"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
fi

# Check system packages
print_status "Verificando dependências do sistema..."

case "$OSTYPE" in
    "linux-gnu"*)
        # Ubuntu/Debian
        print_status "Detectado: Linux (Ubuntu/Debian)"
        
        sudo apt-get update
        sudo apt-get install -y \
            python3-dev \
            python3-venv \
            build-essential \
            poppler-utils \
            libmagic1 \
            libmagic-dev \
            pandoc
        ;;
    "darwin"*)
        # macOS
        print_status "Detectado: macOS"
        
        if check_command brew; then
            brew install poppler libmagic pandoc
        else
            print_error "Homebrew não encontrado. Instale manualmente:"
            print_status "https://brew.sh/"
            exit 1
        fi
        ;;
    *)
        print_warning "OS não reconhecido, pulando instalação de dependências do sistema"
        ;;
esac

# Create project structure
print_status "Criando estrutura do projeto..."

# Create virtual environment
print_status "Criando ambiente virtual..."
python3 -m venv .venv

# Activate virtual environment
print_status "Ativando ambiente virtual..."
source .venv/bin/activate

# Upgrade pip
print_status "Atualizando pip..."
pip install --upgrade pip setuptools wheel

# Install Python dependencies
print_status "Instalando dependências Python..."
if [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt
elif [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    print_error "Arquivo requirements.txt não encontrado"
    exit 1
fi

# Install development dependencies if available
if [ -f "requirements-dev.txt" ]; then
    print_status "Instalando dependências de desenvolvimento..."
    pip install -r requirements-dev.txt
fi

# Install frontend dependencies
if [ -f "package.json" ]; then
    print_status "Instalando dependências do frontend..."
    npm install
else
    print_status "package.json não encontrado, pulando frontend"
fi

# Create necessary directories
print_status "Criando diretórios necessários..."
mkdir -p logs
mkdir -p temp
mkdir -p uploads
mkdir -p static

# Set permissions
chmod 755 scripts/*.sh 2>/dev/null || true

# Create environment file
print_status "Criando arquivo de ambiente..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Conversor Universal - Environment Variables
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
MAX_CONTENT_LENGTH=16777216
UPLOAD_FOLDER=uploads
TEMP_FOLDER=temp
ALLOWED_EXTENSIONS=pdf,docx,doc,txt,html,htm,md,markdown
RATE_LIMIT=100/hour

# Database (if needed)
# DATABASE_URL=sqlite:///app.db

# Redis (if needed)
# REDIS_URL=redis://localhost:6379/0

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
EOF
    print_success "Arquivo .env criado"
else
    print_status "Arquivo .env já existe"
fi

# Run initial tests
print_status "Executando testes iniciais..."
if command -v pytest &> /dev/null; then
    if [ -d "backend/tests" ] || [ -d "tests" ]; then
        pytest --version > /dev/null && pytest -v || print_warning "Alguns testes falharam"
    else
        print_status "Diretório de testes não encontrado"
    fi
else
    print_status "pytest não instalado, pulando testes"
fi

# Create startup script
print_status "Criando script de inicialização..."
cat > start.sh << 'EOF'
#!/bin/bash
# Startup script for Conversor Universal

echo "🔄 Iniciando Conversor Universal..."

# Activate virtual environment
source .venv/bin/activate

# Start backend
echo "Iniciando backend..."
if [ -f "backend/app.py" ]; then
    cd backend
    python app.py &
    BACKEND_PID=$!
    cd ..
elif [ -f "app.py" ]; then
    python app.py &
    BACKEND_PID=$!
else
    echo "❌ app.py não encontrado"
    exit 1
fi

# Start frontend (if exists)
if [ -f "package.json" ]; then
    echo "Iniciando frontend..."
    npm run dev &
    FRONTEND_PID=$!
fi

echo "✅ Serviços iniciados!"
echo "Backend: http://localhost:5000"
if [ -f "package.json" ]; then
    echo "Frontend: http://localhost:3000"
fi

# Wait for interruption
trap 'echo "Parando serviços..."; kill $BACKEND_PID 2>/dev/null; kill $FRONTEND_PID 2>/dev/null; exit' INT

wait
EOF

chmod +x start.sh

# Final instructions
print_success "✅ Instalação concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "==================="
echo "1. Ative o ambiente virtual:"
echo "   source .venv/bin/activate"
echo ""
echo "2. Configure o arquivo .env conforme necessário"
echo ""
echo "3. Inicie a aplicação:"
echo "   ./start.sh"
echo "   # ou manualmente:"
echo "   python backend/app.py  # Backend"
echo "   npm run dev           # Frontend"
echo ""
echo "4. Acesse no navegador:"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "📚 Documentação disponível em docs/"
echo "🛠️  Para desenvolvimento, veja docs/CONTRIBUTING.md"
echo ""
print_success "Setup concluído! 🎉"