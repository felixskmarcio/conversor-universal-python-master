@echo off
setlocal enabledelayedexpansion

REM ================================================================
REM TESTE DO SISTEMA DE DEBUG - CONVERSOR UNIVERSAL
REM ================================================================

REM Configuracao de debug
set DEBUG_MODE=1
set LOG_FILE=test_debug.log
set PAUSE_BETWEEN_STEPS=1

REM Limpa log anterior
if exist "%LOG_FILE%" del "%LOG_FILE%"

REM Funcao de log inicial
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO TESTE DO SISTEMA DE DEBUG ===== >> %LOG_FILE%
    echo [DEBUG] Data/Hora: %date% %time% >> %LOG_FILE%
    echo [DEBUG] Diretorio atual: %cd% >> %LOG_FILE%
    echo. >> %LOG_FILE%
)

cls
title Teste do Sistema de Debug - Conversor Universal
mode con: cols=80 lines=25

color 0B
echo.
echo ================================================================
echo                                                              
echo           TESTE DO SISTEMA DE DEBUG                         
echo                                                              
echo        Verificacao das Funcionalidades de Debug            
echo                                                              
echo ================================================================
echo.
color 07

echo [INFO] Iniciando teste do sistema de debug...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Log sendo salvo em: %LOG_FILE%
    echo [DEBUG] Pausas entre etapas: %PAUSE_BETWEEN_STEPS%
)
echo.

REM Pausa estrategica 1
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0E
    echo [PAUSA] Pressione qualquer tecla para iniciar os testes...
    color 07
    pause >nul
)

REM ================================================================
REM TESTE 1: VERIFICACAO DE COMANDOS BASICOS
REM ================================================================

color 0E
echo [1] TESTE 1: Verificacao de Comandos Basicos
echo =============================================
color 07
echo.

if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO TESTE 1: COMANDOS BASICOS ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
)

REM Teste echo
echo [INFO] Testando comando echo...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Executando: echo teste >> %LOG_FILE%
)
echo teste >nul
set ECHO_RESULT=%errorlevel%
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Resultado echo: %ECHO_RESULT% >> %LOG_FILE%
)
if %ECHO_RESULT% equ 0 (
    color 0A
    echo [SUCESSO] Comando echo funcionando
    color 07
) else (
    color 0C
    echo [ERRO] Comando echo com problema
    color 07
)

REM Teste dir
echo [INFO] Testando comando dir...
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Executando: dir /b >> %LOG_FILE%
)
dir /b >nul 2>&1
set DIR_RESULT=%errorlevel%
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Resultado dir: %DIR_RESULT% >> %LOG_FILE%
)
if %DIR_RESULT% equ 0 (
    color 0A
    echo [SUCESSO] Comando dir funcionando
    color 07
) else (
    color 0C
    echo [ERRO] Comando dir com problema
    color 07
)

echo.

REM Pausa de debug
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0D
    echo [DEBUG] Teste 1 concluido. Pressione qualquer tecla para continuar...
    color 07
    pause >nul
)

REM ================================================================
REM TESTE 2: VERIFICACAO DE VARIAVEIS
REM ================================================================

color 0E
echo [2] TESTE 2: Verificacao de Variaveis
echo =====================================
color 07
echo.

if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO TESTE 2: VARIAVEIS ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
)

REM Teste de variavel simples
echo [INFO] Testando variaveis simples...
set TEST_VAR=valor_teste
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Definindo: TEST_VAR=valor_teste >> %LOG_FILE%
    echo [DEBUG] Valor da variavel: %TEST_VAR% >> %LOG_FILE%
)
if "%TEST_VAR%"=="valor_teste" (
    color 0A
    echo [SUCESSO] Variavel simples funcionando
    color 07
) else (
    color 0C
    echo [ERRO] Variavel simples com problema
    color 07
)

REM Teste de variavel com expansao atrasada
echo [INFO] Testando expansao atrasada...
set COUNTER=0
for /l %%i in (1,1,3) do (
    set /a COUNTER+=1
    if "%DEBUG_MODE%"=="1" (
        echo [DEBUG] Loop %%i: COUNTER=!COUNTER! >> %LOG_FILE%
    )
)
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Valor final COUNTER: !COUNTER! >> %LOG_FILE%
)
if !COUNTER! equ 3 (
    color 0A
    echo [SUCESSO] Expansao atrasada funcionando
    color 07
) else (
    color 0C
    echo [ERRO] Expansao atrasada com problema
    color 07
)

echo.

REM Pausa de debug
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0D
    echo [DEBUG] Teste 2 concluido. Pressione qualquer tecla para continuar...
    color 07
    pause >nul
)

REM ================================================================
REM TESTE 3: VERIFICACAO DE CORES E FORMATACAO
REM ================================================================

color 0E
echo [3] TESTE 3: Verificacao de Cores e Formatacao
echo ==============================================
color 07
echo.

if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== INICIANDO TESTE 3: CORES E FORMATACAO ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
)

echo [INFO] Testando cores do terminal...

color 0A
echo [TESTE] Cor verde (sucesso)
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Testando cor verde >> %LOG_FILE%
)

color 0C
echo [TESTE] Cor vermelha (erro)
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Testando cor vermelha >> %LOG_FILE%
)

color 0E
echo [TESTE] Cor amarela (aviso)
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Testando cor amarela >> %LOG_FILE%
)

color 0D
echo [TESTE] Cor magenta (debug)
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Testando cor magenta >> %LOG_FILE%
)

color 07
echo [TESTE] Cor branca (normal)
if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] Testando cor branca >> %LOG_FILE%
)

color 0A
echo [SUCESSO] Teste de cores concluido
color 07

echo.

REM Pausa de debug
if "%PAUSE_BETWEEN_STEPS%"=="1" (
    color 0D
    echo [DEBUG] Teste 3 concluido. Pressione qualquer tecla para finalizar...
    color 07
    pause >nul
)

REM ================================================================
REM FINALIZACAO DO TESTE
REM ================================================================

if "%DEBUG_MODE%"=="1" (
    echo [DEBUG] ===== FINALIZANDO TESTE DO SISTEMA DE DEBUG ===== >> %LOG_FILE%
    echo [DEBUG] Timestamp: %time% >> %LOG_FILE%
    echo [DEBUG] Todos os testes concluidos >> %LOG_FILE%
    echo [DEBUG] ===== FIM DO LOG DE TESTE ===== >> %LOG_FILE%
)

cls
color 0A
echo.
echo ================================================================
echo                                                              
echo        [SUCESSO] TESTE DE DEBUG CONCLUIDO!                  
echo                                                              
echo        Sistema de debug esta funcionando corretamente!      
echo                                                              
echo ================================================================
color 07

if "%DEBUG_MODE%"=="1" (
    echo.
    color 0D
    echo [DEBUG] Log de teste salvo em: %LOG_FILE%
    echo [DEBUG] Verifique o arquivo para detalhes completos
    color 07
)

echo.
color 0B
echo [RESUMO] Funcionalidades testadas:
echo   - Sistema de logging detalhado
echo   - Pausas estrategicas entre etapas
echo   - Captura de codigos de resultado
echo   - Expansao atrasada de variaveis
echo   - Cores e formatacao do terminal
echo   - Timestamps e rastreamento
color 07

echo.
color 0E
echo [DICA] Para testar o script principal com debug:
echo        .\activate.bat
color 07

echo.
echo ========================================
color 0E
echo Pressione qualquer tecla para finalizar...
color 07
pause >nul

endlocal