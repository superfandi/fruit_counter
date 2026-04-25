@echo off
echo.
echo ========================================
echo   FRUIT COUNTER - Web UI
echo ========================================
echo.

REM Cek apakah Python terinstall
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python tidak terinstall atau tidak ada di PATH
    echo Silakan install Python dari: https://www.python.org
    pause
    exit /b 1
)

REM Install/Update dependencies
echo [1] Mengecek dependencies...
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q

if errorlevel 1 (
    echo [ERROR] Gagal install dependencies
    pause
    exit /b 1
)

REM Jalankan aplikasi
echo [2] Memulai aplikasi...
echo.
python app.py

pause
