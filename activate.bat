@echo off
setlocal enabledelayedexpansion

REM ================================================================
REM CONVERSOR UNIVERSAL - SETUP AUTOMATICO COM DEBUG
REM ================================================================

REM Configuracao de debug e logging
set DEBUG_MODE=1
set LOG_FILE=setup_debug.log
set PAUSE_BETWEEN_STEPS=1

REM Funcao de log
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Iniciando script activate.bat em modo debug >> %LOG_FILE%
    echo [DEBUG] Data/Hora: %date% %time% >> %LOG_FILE%
    echo [DEBUG] Diretorio atual: %cd% >> %LOG_FILE%
    echo. >> %LOG_FILE%
)

REM Limpa a tela e configura o titulo
cls
title Conversor Universal - Setup Automatico [DEBUG MODE]
mode con: cols=80 lines=30

REM Banner principal
color 0B
echo.
echo ================================================================
echo                                                              
echo      CONVERSOR UNIVERSAL DE DOCUMENTOS - SETUP              
echo                                                              
echo        Configuracao Automatica e Inteligente                
echo                   [MODO DEBUG ATIVO]                       
echo                                                              
echo ================================================================
echo.
color 07
echo [INFO] Iniciando verificacao do sistema...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Log sendo salvo em: %LOG_FILE%
    echo [DEBUG] Pausas entre etapas: %PAUSE_BETWEEN_STEPS%
)
echo.

REM Log inicial
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Banner exibido com sucesso >> %LOG_FILE%
    echo [DEBUG] Iniciando verificacao do sistema >> %LOG_FILE%
)

REM Pausa estrategica 1
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0E
    echo [PAUSA] Pressione qualquer tecla para continuar com a verificacao de ferramentas...
    color 07
    pause >nul
)

REM ================================================================
REM ETAPA 1: VERIFICACAO DE FERRAMENTAS
REM ================================================================

color 0E
echo [1] ETAPA 1: Verificacao de Ferramentas
echo ========================================
color 07
echo.

REM Log da etapa 1
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO ETAPA 1: VERIFICACAO DE FERRAMENTAS ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
)

REM Verifica winget
echo [INFO] Verificando winget...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Executando: winget --version >> %LOG_FILE%
)
winget --version >nul 2>&1
set WINGET_RESULT=%errorlevel%
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Resultado winget: %WINGET_RESULT% >> %LOG_FILE%
)
if %WINGET_RESULT% neq 0 (
    color 0C
    echo [ERRO] winget nao encontrado. Instale o App Installer da Microsoft Store.
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] ERRO: winget nao encontrado >> %LOG_FILE%
    )
    echo.
    echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
    color 07
    pause >nul
    exit /b 1
) else (
    color 0A
    echo [SUCESSO] winget disponivel para instalacoes automaticas
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] SUCESSO: winget encontrado >> %LOG_FILE%
    )
    color 07
)
echo.

REM Pausa de debug
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0D
    echo [DEBUG] Winget verificado. Pressione qualquer tecla para continuar...
    color 07
    pause >nul
)

REM Verifica Python
echo [INFO] Verificando Python...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Iniciando verificacao do Python >> %LOG_FILE%
)
set PYTHON_CMD=python
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Testando comando: python --version >> %LOG_FILE%
)
python --version >nul 2>&1
set PYTHON_RESULT=%errorlevel%
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Resultado python: %PYTHON_RESULT% >> %LOG_FILE%
)
if %PYTHON_RESULT% neq 0 (
    set PYTHON_CMD=py
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Testando comando alternativo: py --version >> %LOG_FILE%
    )
    py --version >nul 2>&1
    set PY_RESULT=%errorlevel%
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Resultado py: !PY_RESULT! >> %LOG_FILE%
    )
    if !PY_RESULT! neq 0 (
        color 0E
        echo [AVISO] Python nao encontrado. Iniciando instalacao...
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Python nao encontrado, iniciando instalacao >> %LOG_FILE%
        )
        echo [PROGRESSO] Baixando e instalando Python 3.11...
        echo [####################] 100%%
        color 07
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Executando: winget install Python.Python.3.11 >> %LOG_FILE%
        )
        winget install Python.Python.3.11
         set INSTALL_RESULT=%errorlevel%
         if "%DEBUG_MODE%"=="1" (
             echo [DEBUG] Resultado instalacao Python: !INSTALL_RESULT! >> %LOG_FILE%
         )
         REM Verifica se Python foi instalado testando o comando
         timeout /t 2 >nul
         py --version >nul 2>&1
         set PYTHON_TEST=%errorlevel%
         if "%DEBUG_MODE%"=="1" (
             echo [DEBUG] Teste pos-instalacao Python: !PYTHON_TEST! >> %LOG_FILE%
         )
         if !PYTHON_TEST! neq 0 (
             color 0C
             echo [ERRO] Python nao foi instalado corretamente
             if "%DEBUG_MODE%"=="1" (
                 echo [DEBUG] ERRO: Python nao funciona apos instalacao >> %LOG_FILE%
             )
             echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
             color 07
             pause >nul
             exit /b 1
         )
        color 0A
        echo [SUCESSO] Python instalado com sucesso!
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] SUCESSO: Python instalado >> %LOG_FILE%
        )
        color 07
        set PYTHON_CMD=py
    ) else (
        for /f "tokens=2" %%i in ('py --version 2^>nul') do (
            color 0A
            echo [SUCESSO] Python encontrado %%i
            if "%DEBUG_MODE%"=="1" (
                echo [DEBUG] SUCESSO: Python encontrado via py - %%i >> %LOG_FILE%
            )
            color 07
        )
        echo [INFO] Usando comando: py
    )
) else (
    for /f "tokens=2" %%i in ('python --version 2^>nul') do (
        color 0A
        echo [SUCESSO] Python encontrado %%i
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] SUCESSO: Python encontrado via python - %%i >> %LOG_FILE%
        )
        color 07
    )
    echo [INFO] Usando comando: python
)
echo.

REM Pausa de debug
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0D
    echo [DEBUG] Python verificado (CMD: %PYTHON_CMD%). Pressione qualquer tecla para continuar...
    color 07
    pause >nul
)

REM Verifica Node.js
echo [INFO] Verificando Node.js...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Executando: node --version >> %LOG_FILE%
)
node --version >nul 2>&1
set NODE_RESULT=%errorlevel%
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Resultado node: %NODE_RESULT% >> %LOG_FILE%
)
if %NODE_RESULT% neq 0 (
    color 0E
    echo [AVISO] Node.js nao encontrado. Iniciando instalacao...
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Node.js nao encontrado, iniciando instalacao >> %LOG_FILE%
    )
    echo [PROGRESSO] Baixando e instalando Node.js...
    echo [####################] 100%%
    color 07
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Executando: winget install OpenJS.NodeJS >> %LOG_FILE%
    )
    winget install OpenJS.NodeJS
         set INSTALL_RESULT=%errorlevel%
         if "%DEBUG_MODE%"=="1" (
             echo [DEBUG] Resultado instalacao Node.js: !INSTALL_RESULT! >> %LOG_FILE%
         )
         REM Verifica se Node.js foi instalado testando o comando
         timeout /t 2 >nul
         node --version >nul 2>&1
         set NODE_TEST=%errorlevel%
         if "%DEBUG_MODE%"=="1" (
             echo [DEBUG] Teste pos-instalacao Node.js: !NODE_TEST! >> %LOG_FILE%
         )
         if !NODE_TEST! neq 0 (
             color 0C
             echo [ERRO] Node.js nao foi instalado corretamente
             if "%DEBUG_MODE%"=="1" (
                 echo [DEBUG] ERRO: Node.js nao funciona apos instalacao >> %LOG_FILE%
             )
             echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
             color 07
             pause >nul
             exit /b 1
         )
    color 0A
    echo [SUCESSO] Node.js instalado com sucesso!
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] SUCESSO: Node.js instalado >> %LOG_FILE%
    )
    color 07
) else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do (
        color 0A
        echo [SUCESSO] Node.js encontrado %%i
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] SUCESSO: Node.js encontrado - %%i >> %LOG_FILE%
        )
        color 07
    )
)

REM Pausa de debug
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0D
    echo [DEBUG] Node.js verificado. Pressione qualquer tecla para continuar...
    color 07
    pause >nul
)

REM Verifica npm
echo [INFO] Verificando npm...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Executando: call npm --version >> %LOG_FILE%
)
call npm --version >nul 2>&1
set NPM_RESULT=%errorlevel%
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Resultado npm: %NPM_RESULT% >> %LOG_FILE%
)
if %NPM_RESULT% neq 0 (
    color 0C
    echo [ERRO] npm nao encontrado
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] ERRO: npm nao encontrado >> %LOG_FILE%
    )
    color 07
) else (
    color 0A
    echo [SUCESSO] npm encontrado
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] SUCESSO: npm encontrado >> %LOG_FILE%
    )
    color 07
)
echo.

REM Log fim da etapa 1
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== FIM DA ETAPA 1: VERIFICACAO DE FERRAMENTAS ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
    echo. >> %LOG_FILE%
)

REM Pausa estrategica 2
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0E
    echo [PAUSA] Etapa 1 concluida. Pressione qualquer tecla para continuar com a configuracao do Python...
    color 07
    pause >nul
)

REM ================================================================
REM ETAPA 2: CONFIGURACAO DO PYTHON
REM ================================================================

color 0E
echo [2] ETAPA 2: Configuracao do Python
echo ========================================
color 07
echo.

REM Log da etapa 2
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO ETAPA 2: CONFIGURACAO DO PYTHON ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
    echo [DEBUG] Comando Python a ser usado: %PYTHON_CMD% >> %LOG_FILE%
)

echo [INFO] Verificando dependencias Python...
echo [INFO] Testando dependencias principais...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Testando dependencia: flask >> %LOG_FILE%
)
echo.

%PYTHON_CMD% -c "import flask" 2>nul
set FLASK_RESULT=%errorlevel%
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Resultado teste flask: %FLASK_RESULT% >> %LOG_FILE%
)
if %FLASK_RESULT% neq 0 (
    color 0E
    echo [AVISO] Dependencias Python nao encontradas. Iniciando instalacao...
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Dependencias nao encontradas, iniciando instalacao >> %LOG_FILE%
    )
    color 07
    echo.
    
    echo [PROGRESSO] Atualizando ferramentas base do Python...
    echo [#####...............] 25%%
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Executando: %PYTHON_CMD% -m pip install --upgrade pip setuptools wheel >> %LOG_FILE%
    )
    %PYTHON_CMD% -m pip install --upgrade pip setuptools wheel >nul 2>&1
    set PIP_UPGRADE_RESULT=%errorlevel%
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Resultado upgrade pip: !PIP_UPGRADE_RESULT! >> %LOG_FILE%
    )
    echo [##########..........] 50%%
    
    REM Instala requirements.txt da raiz se existir
    if exist "requirements.txt" (
        echo [PROGRESSO] Instalando dependencias do requirements.txt (raiz)...
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Arquivo requirements.txt (raiz) encontrado >> %LOG_FILE%
            echo [DEBUG] Executando: %PYTHON_CMD% -m pip install -r requirements.txt >> %LOG_FILE%
        )
        echo [############........] 60%%
        %PYTHON_CMD% -m pip install -r requirements.txt >nul 2>&1
        set ROOT_REQUIREMENTS_RESULT=%errorlevel%
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Resultado instalacao requirements (raiz): !ROOT_REQUIREMENTS_RESULT! >> %LOG_FILE%
        )
        if !ROOT_REQUIREMENTS_RESULT! neq 0 (
            color 0C
            echo [ERRO] Falha na instalacao das dependencias Python (raiz)
            if "%DEBUG_MODE%"=="1" (
                echo [DEBUG] ERRO: Falha na instalacao do requirements.txt (raiz) >> %LOG_FILE%
            )
            echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
            color 07
            pause >nul
            exit /b 1
        )
        echo [##############......] 70%%
    )
    
    REM Instala requirements.txt do backend se existir
    if exist "backend\requirements.txt" (
        echo [PROGRESSO] Instalando dependencias do requirements.txt (backend)...
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Arquivo requirements.txt (backend) encontrado >> %LOG_FILE%
            echo [DEBUG] Executando: %PYTHON_CMD% -m pip install -r backend\requirements.txt >> %LOG_FILE%
        )
        echo [#################...] 85%%
        %PYTHON_CMD% -m pip install -r backend\requirements.txt >nul 2>&1
        set BACKEND_REQUIREMENTS_RESULT=%errorlevel%
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Resultado instalacao requirements (backend): !BACKEND_REQUIREMENTS_RESULT! >> %LOG_FILE%
        )
        if !BACKEND_REQUIREMENTS_RESULT! neq 0 (
            color 0C
            echo [ERRO] Falha na instalacao das dependencias Python (backend)
            if "%DEBUG_MODE%"=="1" (
                echo [DEBUG] ERRO: Falha na instalacao do requirements.txt (backend) >> %LOG_FILE%
            )
            echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
            color 07
            pause >nul
            exit /b 1
        )
        echo [####################] 100%%
    ) else (
        REM Se nenhum requirements.txt foi encontrado, instala dependencias basicas
        if not exist "requirements.txt" (
            echo [PROGRESSO] Instalando dependencias basicas...
            if "%DEBUG_MODE%"=="1" (
                echo [DEBUG] Nenhum arquivo requirements.txt encontrado, instalando dependencias basicas >> %LOG_FILE%
                echo [DEBUG] Executando: %PYTHON_CMD% -m pip install flask flask-cors python-docx pdfplumber >> %LOG_FILE%
            )
            echo [#################...] 85%%
            %PYTHON_CMD% -m pip install flask flask-cors python-docx pdfplumber >nul 2>&1
            set BASIC_DEPS_RESULT=%errorlevel%
            if "%DEBUG_MODE%"=="1" (
                echo [DEBUG] Resultado instalacao dependencias basicas: !BASIC_DEPS_RESULT! >> %LOG_FILE%
            )
            if !BASIC_DEPS_RESULT! neq 0 (
                color 0C
                echo [ERRO] Falha na instalacao das dependencias Python
                if "%DEBUG_MODE%"=="1" (
                    echo [DEBUG] ERRO: Falha na instalacao das dependencias basicas >> %LOG_FILE%
                )
                echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
                color 07
                pause >nul
                exit /b 1
            )
            echo [####################] 100%%
        )
    )
    color 0A
    echo [SUCESSO] Dependencias Python instaladas com sucesso!
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] SUCESSO: Dependencias Python instaladas >> %LOG_FILE%
    )
    color 07
) else (
    color 0A
    echo [SUCESSO] Dependencias Python ja estao instaladas
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] SUCESSO: Dependencias Python ja instaladas >> %LOG_FILE%
    )
    color 07
)
echo.

REM Log fim da etapa 2
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== FIM DA ETAPA 2: CONFIGURACAO DO PYTHON ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
    echo. >> %LOG_FILE%
)

REM Pausa estrategica 3
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0E
    echo [PAUSA] Etapa 2 concluida. Pressione qualquer tecla para continuar com a configuracao do frontend...
    color 07
    pause >nul
)

REM ================================================================
REM ETAPA 3: CONFIGURACAO DO FRONTEND
REM ================================================================

color 0E
echo [3] ETAPA 3: Configuracao do Frontend
echo ========================================
color 07
echo.

REM Log da etapa 3
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO ETAPA 3: CONFIGURACAO DO FRONTEND ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
)

if exist "frontend\package.json" (
    echo [INFO] Verificando dependencias do frontend...
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Arquivo frontend\package.json encontrado >> %LOG_FILE%
        echo [DEBUG] Mudando para diretorio frontend >> %LOG_FILE%
    )
    cd frontend
    if not exist "node_modules" (
        echo [PROGRESSO] Instalando dependencias do frontend...
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Diretorio node_modules nao encontrado, iniciando npm install >> %LOG_FILE%
        )
        echo [#####...............] 25%%
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Executando: npm install >> %LOG_FILE%
        )
        npm install >nul 2>&1
        set NPM_INSTALL_RESULT=%errorlevel%
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] Resultado npm install: !NPM_INSTALL_RESULT! >> %LOG_FILE%
        )
        if !NPM_INSTALL_RESULT! neq 0 (
            color 0C
            echo [ERRO] Falha na instalacao das dependencias do frontend
            if "%DEBUG_MODE%"=="1" (
                echo [DEBUG] ERRO: Falha no npm install >> %LOG_FILE%
            )
            cd ..
            echo [ERRO] Instalacao cancelada. Pressione qualquer tecla para sair...
            color 07
            pause >nul
            exit /b 1
        )
        echo [####################] 100%%
        color 0A
        echo [SUCESSO] Dependencias do frontend instaladas!
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] SUCESSO: npm install concluido >> %LOG_FILE%
        )
        color 07
    ) else (
        color 0A
        echo [SUCESSO] Dependencias do frontend ja estao instaladas
        if "%DEBUG_MODE%"=="1" (
            echo [DEBUG] SUCESSO: node_modules ja existe >> %LOG_FILE%
        )
        color 07
    )
    cd ..
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Retornando ao diretorio principal >> %LOG_FILE%
    )
    echo.
) else (
    color 0E
    echo [AVISO] Projeto frontend nao encontrado
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] AVISO: frontend\package.json nao encontrado >> %LOG_FILE%
    )
    color 07
    echo.
)

REM Log fim da etapa 3
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== FIM DA ETAPA 3: CONFIGURACAO DO FRONTEND ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
    echo. >> %LOG_FILE%
)

REM Pausa estrategica 4
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0E
    echo [PAUSA] Etapa 3 concluida. Pressione qualquer tecla para finalizar o setup...
    color 07
    pause >nul
)

REM ================================================================
REM FINALIZACAO
REM ================================================================

REM Log final
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO FINALIZACAO ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
    echo [DEBUG] Setup concluido com sucesso >> %LOG_FILE%
    echo [DEBUG] ===== FIM DO LOG DE DEBUG ===== >> %LOG_FILE%
)

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
if "%DEBUG_MODE%"=="1" (
    echo.
    color 0D
    echo [DEBUG] Log detalhado salvo em: %LOG_FILE%
    color 07
)
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
echo     cd frontend && npm start
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
if "%DEBUG_MODE%"=="1" (
    color 0B
    echo [DEBUG] Para desativar o modo debug, edite as variaveis no inicio do script:
    echo         set DEBUG_MODE=0
    echo         set PAUSE_BETWEEN_STEPS=0
    color 07
    echo.
)
echo ========================================
color 0E
echo Pressione qualquer tecla para finalizar...
color 07
pause >nul

endlocal