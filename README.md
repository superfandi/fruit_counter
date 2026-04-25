# 🍎 Fruit Counter - Web UI Version

Aplikasi penghitung buah menggunakan OpenCV dengan Interface Web modern (HTML + Tailwind CSS + JavaScript).

## ✨ Fitur

- ✅ **Mode Kamera Live** - Real-time fruit detection dari webcam
- ✅ **Upload Gambar** - Proses gambar dari file
- ✅ **Deteksi Multi-warna** - Merah, Oranye, Kuning, Hijau, Ungu
- ✅ **Pengaturan Sensitivitas** - Slider untuk minimum area detection
- ✅ **Export Excel** - Otomatis simpan hasil ke file Excel
- ✅ **UI Modern** - Tailwind CSS dengan dark mode
- ✅ **Responsive** - Bekerja di desktop dan tablet

## 📦 Instalasi

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Jalankan Aplikasi

```bash
python app.py
```

### 3. Buka di Browser

```
http://localhost:5000
```

## 🎮 Cara Pakai

### Mode Web UI

1. **Isi Informasi Sesi:**
   - Nama Klien (wajib)
   - Waktu Penyediaan (Lunch/Dinner/Supper)
   - Jenis Buah yang Ingin Dihitung

2. **Pilih Mode:**
   - 📷 **Mode Kamera** - Ambil gambar real-time dari webcam
   - 🖼️ **Upload Gambar** - Pilih file gambar dari komputer

3. **Proses:**
   - Sistem otomatis mendeteksi dan menghitung buah
   - Lihat hasil di panel sebelah kanan

4. **Simpan:**
   - Klik "Simpan ke Excel" untuk export hasil
   - File disimpan ke `hasil_hitung_buah.xlsx`

5. **Kamera Live:**
   - Tekan "Mode Kamera" untuk membuka kamera streaming
   - Gunakan slider untuk adjust sensitivitas deteksi
   - "Ambil Screenshot" untuk capture dan simpan hasil
   - "Tutup & Simpan" untuk menutup dan export ke Excel

## 🛠️ Struktur Project

```
Tugas PKL 1 - Copy/
├── fruit_counter.py          # Core OpenCV logic
├── app.py                    # Flask web server
├── requirements.txt          # Dependencies
├── README.md                 # Dokumentasi ini
├── templates/
│   └── index.html           # HTML utama (Tailwind CSS)
└── static/
    └── app.js               # Frontend JavaScript
```

## 🔧 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/` | GET | Halaman utama |
| `/api/config` | GET | Ambil konfigurasi (fruits, meals) |
| `/api/session` | POST | Set informasi sesi |
| `/api/min-area` | POST | Update sensitivitas |
| `/api/process-image` | POST | Proses gambar upload |
| `/api/camera-frame` | GET | Ambil frame kamera |
| `/api/save-excel` | POST | Simpan ke Excel |
| `/api/download-excel` | GET | Download file Excel |

## 📊 Format Output Excel

| No | Nama Klien | Waktu Penyediaan | Jenis Buah | Jumlah | Tanggal | Waktu |
|----|-----------|------------------|-----------|--------|--------|-------|
| 1 | Klien A | Lunch | Apel | 5 | 24/04/2026 | 14:30:00 |
| 2 | Klien A | Lunch | Jeruk | 3 | 24/04/2026 | 14:30:00 |
| ... | ... | ... | ... | ... | ... | ... |
| **TOTAL** | ... | ... | **8 buah** |

## 🎨 Customization

### Ubah Rentang Warna Deteksi

Edit di `fruit_counter.py`:

```python
FRUIT_COLORS = {
    "merah": [
        (np.array([0,  120, 70]),  np.array([10, 255, 255]), (50,  50, 220), "Apel/Semangka"),
        # ... HSV range dan warna display
    ],
    # ...
}
```

### Ubah Tema Warna

Edit di `templates/index.html`:

```html
<style>
    .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    /* Customize warna utama */
</style>
```

### Ubah Sensitivitas Default

Edit di `app.py`:

```python
parser.add_argument("--min-area", type=int, default=1500)  # Default value
```

## 🐛 Troubleshooting

### Kamera tidak terdeteksi
- Pastikan webcam sudah terpasang dan tidak digunakan aplikasi lain
- Coba ubah `camera_id` dari 0 ke 1, 2, dst.

### Error: "Module not found"
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Excel file tidak tergenerate
- Pastikan folder workspace punya permission write
- Cek path `hasil_hitung_buah.xlsx` di terminal

### Frontend tidak load
- Refresh browser (Ctrl+F5)
- Cek console browser (F12) untuk error messages
- Pastikan Flask server running di port 5000

## 📝 CLI Mode Lama (Tanpa Web UI)

Masih bisa menggunakan mode CLI seperti sebelumnya:

```bash
# Mode kamera
python fruit_counter.py

# Mode gambar
python fruit_counter.py gambar.jpg

# Dengan save output
python fruit_counter.py gambar.jpg --save hasil.jpg
```

## 🔐 Security Notes

- Aplikasi berjalan di localhost (127.0.0.1)
- Untuk akses remote, ubah `host='0.0.0.0'` di `app.py`
- Upload file size limit: ~25MB (Flask default)

## 📄 Lisensi

MIT License - Bebas digunakan untuk keperluan apapun

## 👨‍💻 Dikembangkan dengan

- **OpenCV** - Computer Vision
- **Flask** - Web Framework
- **Tailwind CSS** - UI Framework
- **NumPy** - Numeric Computing
- **openpyxl** - Excel Export

---

**Versi:** 2.0 Web UI  
**Last Updated:** 24 April 2026
