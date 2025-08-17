@echo off
echo Limpando arquivos temporarios e cache...

REM Remover diretorios de cache Python
if exist "backend\__pycache__" (
    echo Removendo __pycache__ do backend...
    rmdir /s /q "backend\__pycache__"
)

if exist "backend\api\__pycache__" (
    echo Removendo __pycache__ do api...
    rmdir /s /q "backend\api\__pycache__"
)

if exist "backend\core\__pycache__" (
    echo Removendo __pycache__ do core...
    rmdir /s /q "backend\core\__pycache__"
)

if exist "backend\models\__pycache__" (
    echo Removendo __pycache__ dos models...
    rmdir /s /q "backend\models\__pycache__"
)

REM Remover arquivos .pyc
for /r %%i in (*.pyc) do (
    echo Removendo %%i...
    del /q "%%i"
)

REM Remover diretorio .next se existir
if exist ".next" (
    echo Removendo diretorio .next...
    rmdir /s /q ".next"
)

echo Limpeza concluida!
echo.
echo Arquivos temporarios removidos com sucesso.
pause