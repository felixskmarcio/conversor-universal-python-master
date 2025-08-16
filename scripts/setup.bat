@echo off
REM Conversor Universal - Setup Script for Windows
REM Automated installation and configuration

setlocal enabledelayedexpansion

echo ================================
echo 🔄 Conversor Universal - Setup Automatico
echo ================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python nao esta instalado
    echo 📥 Baixe Python 3.7+ de: https://python.org/downloads/
    pause
    exit /b 1
) else (
    echo ✅ Python encontrado
)

REM Check pip
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip nao esta instalado
    echo 📥 Instale pip e execute novamente
    pause
    exit /b 1
) else (
    echo ✅ pip encontrado
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Node.js nao encontrado
    echo 📥 Baixe Node.js de: https://nodejs.org/
    echo 💡 Continuando sem frontend...
    set SKIP_FRONTEND=1
) else (
    echo ✅ Node.js encontrado
    set SKIP_FRONTEND=0
)

echo.
echo 📦 Criando ambiente virtual...
python -m venv .venv
if errorlevel 1 (
    echo ❌ Erro ao criar ambiente virtual
    pause
    exit /b 1
)

echo ✅ Ambiente virtual criado
echo.

echo 🔄 Ativando ambiente virtual...
call .venv\Scripts\activate.bat

echo 📦 Atualizando pip...
python -m pip install --upgrade pip setuptools wheel

echo 📦 Instalando dependencias Python...
if exist "backend\requirements.txt" (
    pip install -r backend\requirements.txt
) else if exist "requirements.txt" (
    pip install -r requirements.txt
) else (
    echo ❌ requirements.txt nao encontrado
    pause
    exit /b 1
)

REM Install development dependencies if available
if exist "requirements-dev.txt" (
    echo 📦 Instalando dependencias de desenvolvimento...
    pip install -r requirements-dev.txt
)

REM Install frontend dependencies
if !SKIP_FRONTEND! EQU 0 (
    if exist "package.json" (
        echo 📦 Instalando dependencias do frontend...
        npm install
    ) else (
        echo ⚠️  package.json nao encontrado, pulando frontend
    )
)

echo.
echo 📁 Criando diretorios necessarios...
if not exist "logs" mkdir logs
if not exist "temp" mkdir temp
if not exist "uploads" mkdir uploads
if not exist "static" mkdir static

echo 🔧 Criando arquivo de ambiente...
if not exist ".env" (
    (
        echo # Conversor Universal - Environment Variables
        echo FLASK_ENV=development
        echo FLASK_DEBUG=True
        echo SECRET_KEY=change-this-in-production
        echo MAX_CONTENT_LENGTH=16777216
        echo UPLOAD_FOLDER=uploads
        echo TEMP_FOLDER=temp
        echo ALLOWED_EXTENSIONS=pdf,docx,doc,txt,html,htm,md,markdown
        echo RATE_LIMIT=100/hour
        echo.
        echo # Logging
        echo LOG_LEVEL=INFO
        echo LOG_FILE=logs/app.log
    ) > .env
    echo ✅ Arquivo .env criado
) else (
    echo ℹ️  Arquivo .env ja existe
)

echo 🔧 Criando script de inicializacao...
(
    echo @echo off
    echo echo 🔄 Iniciando Conversor Universal...
    echo echo.
    echo.
    echo echo 🔄 Ativando ambiente virtual...
    echo call .venv\Scripts\activate.bat
    echo.
    echo echo 🚀 Iniciando backend...
    echo if exist "backend\app.py" ^(
    echo     cd backend
    echo     start "Backend" python app.py
    echo     cd ..
    echo ^) else if exist "app.py" ^(
    echo     start "Backend" python app.py
    echo ^) else ^(
    echo     echo ❌ app.py nao encontrado
    echo     pause
    echo     exit /b 1
    echo ^)
    echo.
    echo if exist "package.json" ^(
    echo     echo 🚀 Iniciando frontend...
    echo     start "Frontend" npm run dev
    echo ^)
    echo.
    echo echo ✅ Servicos iniciados!
    echo echo 🌐 Backend:  http://localhost:5000
    echo if exist "package.json" echo 🌐 Frontend: http://localhost:3000
    echo echo.
    echo echo 📋 Pressione qualquer tecla para parar os servicos...
    echo pause >nul
) > start.bat

echo.
echo ✅ Instalacao concluida com sucesso!
echo.
echo ================================
echo 📋 Proximos passos:
echo ================================
echo 1. Configure o arquivo .env conforme necessario
echo.
echo 2. Inicie a aplicacao:
echo    start.bat
echo    # ou manualmente:
echo    python backend\app.py  # Backend
echo    npm run dev           # Frontend
echo.
echo 3. Acesse no navegador:
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo 📚 Documentacao disponivel em docs\
echo 🛠️  Para desenvolvimento, veja docs\CONTRIBUTING.md
echo.
echo ✅ Setup concluido! 🎉
echo.
pause