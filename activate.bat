@echo off
setlocal enabledelayedexpansion

REM ================================================================
REM CONVERSOR UNIVERSAL - SETUP AUTOMATICO
REM ================================================================

REM Limpa a tela e configura o titulo
cls
title Conversor Universal - Setup Automatico
mode con: cols=80 lines=30

REM Banner principal
color 0B
echo.
echo ================================================================
echo                                                              
echo      CONVERSOR UNIVERSAL DE DOCUMENTOS - SETUP              
echo                                                              
echo        Configuracao Automatica e Inteligente                
echo                                                              
echo ================================================================
echo.
color 07
echo [INFO] Iniciando verificacao do sistema...
echo.

REM ================================================================
REM ETAPA 1: VERIFICACAO DE FERRAMENTAS
REM ================================================================

color 0E
echo [1] ETAPA 1: Verificacao de Ferramentas
echo ========================================
color 07
echo.

REM Verifica winget
echo [INFO] Verificando winget...
winget --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] winget nao encontrado. Instale o App Installer da Microsoft Store.
    echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
    color 07
    pause >nul
    exit /b 1
) else (
    color 0A
    echo [SUCESSO] winget disponivel
    color 07
)
echo.

REM Verifica Python
echo [INFO] Verificando Python...
set PYTHON_CMD=python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    set PYTHON_CMD=py
    py --version >nul 2>&1
    if !errorlevel! neq 0 (
        color 0E
        echo [AVISO] Python nao encontrado. Iniciando instalacao...
        echo [PROGRESSO] Baixando e instalando Python 3.11...
        color 07
        winget install Python.Python.3.11
        timeout /t 2 >nul
        py --version >nul 2>&1
        if !errorlevel! neq 0 (
            color 0C
            echo [ERRO] Python nao foi instalado corretamente
            echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
            color 07
            pause >nul
            exit /b 1
        )
        color 0A
        echo [SUCESSO] Python instalado com sucesso!
        color 07
        set PYTHON_CMD=py
    ) else (
        for /f "tokens=2" %%i in ('py --version 2^>nul') do (
            color 0A
            echo [SUCESSO] Python encontrado %%i
            color 07
        )
        echo [INFO] Usando comando: py
    )
) else (
    for /f "tokens=2" %%i in ('python --version 2^>nul') do (
        color 0A
        echo [SUCESSO] Python encontrado %%i
        color 07
    )
    echo [INFO] Usando comando: python
)
echo.

REM Verifica Node.js
echo [INFO] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0E
    echo [AVISO] Node.js nao encontrado. Iniciando instalacao...
    echo [PROGRESSO] Baixando e instalando Node.js...
    color 07
    winget install OpenJS.NodeJS
    timeout /t 2 >nul
    node --version >nul 2>&1
    if !errorlevel! neq 0 (
        color 0C
        echo [ERRO] Node.js nao foi instalado corretamente
        echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
        color 07
        pause >nul
        exit /b 1
    )
    color 0A
    echo [SUCESSO] Node.js instalado com sucesso!
    color 07
) else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do (
        color 0A
        echo [SUCESSO] Node.js encontrado %%i
        color 07
    )
)

REM Verifica npm
echo [INFO] Verificando npm...
call npm --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERRO] npm nao encontrado
    color 07
) else (
    color 0A
    echo [SUCESSO] npm encontrado
    color 07
)
echo.

REM ================================================================
REM ETAPA 2: CONFIGURACAO DO PYTHON
REM ================================================================

color 0E
echo [2] ETAPA 2: Configuracao do Python
echo ========================================
color 07
echo.

echo [INFO] Verificando dependencias Python...
%PYTHON_CMD% -c "import flask" 2>nul
if %errorlevel% neq 0 (
    color 0E
    echo [AVISO] Dependencias Python nao encontradas. Iniciando instalacao...
    color 07
    echo.
    
    echo [PROGRESSO] Atualizando ferramentas base do Python...
    %PYTHON_CMD% -m pip install --upgrade pip setuptools wheel >nul 2>&1
    
    REM Instala requirements.txt da raiz se existir
    if exist "requirements.txt" (
        echo [PROGRESSO] Instalando dependencias do requirements.txt (raiz)...
        %PYTHON_CMD% -m pip install -r requirements.txt >nul 2>&1
        if !errorlevel! neq 0 (
            color 0C
            echo [ERRO] Falha na instalacao das dependencias Python (raiz)
            echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
            color 07
            pause >nul
            exit /b 1
        )
    )
    
    REM Instala requirements.txt do backend se existir
    if exist "backend\requirements.txt" (
        echo [PROGRESSO] Instalando dependencias do requirements.txt (backend)...
        %PYTHON_CMD% -m pip install -r backend\requirements.txt >nul 2>&1
        if !errorlevel! neq 0 (
            color 0C
            echo [ERRO] Falha na instalacao das dependencias Python (backend)
            echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
            color 07
            pause >nul
            exit /b 1
        )
    ) else (
        REM Se nenhum requirements.txt foi encontrado, instala dependencias basicas
        if not exist "requirements.txt" (
            echo [PROGRESSO] Instalando dependencias basicas...
            %PYTHON_CMD% -m pip install flask flask-cors python-docx pdfplumber >nul 2>&1
            if !errorlevel! neq 0 (
                color 0C
                echo [ERRO] Falha na instalacao das dependencias Python
                echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
                color 07
                pause >nul
                exit /b 1
            )
        )
    )
    color 0A
    echo [SUCESSO] Dependencias Python instaladas com sucesso!
    color 07
) else (
    color 0A
    echo [SUCESSO] Dependencias Python ja estao instaladas
    color 07
)
echo.

REM ================================================================
REM ETAPA 3: CONFIGURACAO DO FRONTEND
REM ================================================================

color 0E
echo [3] ETAPA 3: Configuracao do Frontend
echo ========================================
color 07
echo.

if exist "package.json" (
    echo [INFO] Verificando dependencias do frontend...
    if not exist "node_modules" (
        echo [PROGRESSO] Instalando dependencias do frontend...
        npm install >nul 2>&1
        if !errorlevel! neq 0 (
            color 0C
            echo [ERRO] Falha na instalacao das dependencias do frontend
            echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
            color 07
            pause >nul
            exit /b 1
        )
        color 0A
        echo [SUCESSO] Dependencias do frontend instaladas!
        color 07
    ) else (
        color 0A
        echo [SUCESSO] Dependencias do frontend ja estao instaladas
        color 07
    )
    echo.
) else (
    color 0E
    echo [AVISO] Projeto frontend nao encontrado (package.json)
    color 07
    echo.
)

REM ================================================================
REM FINALIZACAO
REM ================================================================

cls
color 0A
echo.
echo ================================================================
echo                                                              
echo        [SUCESSO] SETUP CONCLUIDO COM SUCESSO!                
echo                                                              
echo        Conversor Universal esta pronto para uso!            
echo                                                              
echo ================================================================
color 07
echo.
color 0B
echo [INSTRUCOES] COMO INICIAR O SISTEMA:
echo ========================================
color 07
echo.
color 0E
echo [1] Passo 1 - Backend (API):
color 0F
echo     %PYTHON_CMD% backend\app.py
color 07
echo.
color 0E
echo [2] Passo 2 - Frontend (Interface):
color 0F
echo     npm run dev
color 07
echo.
color 0B
echo [ENDERECOS] ENDERECOS DE ACESSO:
echo ========================================
color 07
echo.
color 0A
echo [WEB] Frontend: http://localhost:3000
echo [API] Backend:  http://localhost:5000
color 07
echo.
color 0D
echo [DICA] Mantenha ambos os terminais abertos durante o uso!
color 07
echo.
echo ========================================
color 0E
echo Pressione qualquer tecla para finalizar...
color 07
pause >nul

endlocal