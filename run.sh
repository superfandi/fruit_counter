#!/bin/bash

echo ""
echo "========================================"
echo "   FRUIT COUNTER - Web UI"
echo "========================================"
echo ""

# Cek apakah Python terinstall
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 tidak terinstall"
    echo "Silakan install Python dari: https://www.python.org"
    exit 1
fi

# Install/Update dependencies
echo "[1] Mengecek dependencies..."
python3 -m pip install --upgrade pip -q
pip3 install -r requirements.txt -q

if [ $? -ne 0 ]; then
    echo "[ERROR] Gagal install dependencies"
    exit 1
fi

# Jalankan aplikasi
echo "[2] Memulai aplikasi..."
echo ""
python3 app.py
