/**
 * Fruit Counter - Frontend JavaScript
 * =====================================
 */

// ═══════════════════════════════════════════════════════════════════════════
// Global State & Configuration
// ═══════════════════════════════════════════════════════════════════════════

const app = {
    session: {
        client: '',
        meal_time: '',
        fruit_label: ''
    },
    current_results: {
        total: 0,
        counts: {},
        image: null
    },
    camera: {
        active: false,
        interval: null,
        min_area: 1500
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// Initialize App
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    setupEventListeners();
    console.log('✅ App initialized');
});

/**
 * Load configuration dari backend
 */
async function loadConfig() {
    try {
        const res = await fetch('/api/config');
        const config = await res.json();

        // Populate fruit dropdown
        const fruitSelect = document.getElementById('fruitType');
        fruitSelect.innerHTML = '<option value="all">🍎 Semua Buah</option>';
        
        config.fruits.forEach(fruit => {
            const opt = document.createElement('option');
            opt.value = fruit.key;
            opt.textContent = `🍎 ${fruit.label}`;
            fruitSelect.appendChild(opt);
        });

        console.log('✅ Config loaded');
    } catch (e) {
        showError('Gagal memuat konfigurasi: ' + e.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Event Listeners Setup
// ═══════════════════════════════════════════════════════════════════════════

function setupEventListeners() {
    // Form inputs
    document.getElementById('clientName').addEventListener('change', updateSession);
    document.getElementById('mealTime').addEventListener('change', updateSession);
    document.getElementById('fruitType').addEventListener('change', updateSession);

    // Sensitivity slider
    document.getElementById('minAreaSlider').addEventListener('input', (e) => {
        document.getElementById('minAreaValue').textContent = e.target.value;
        app.camera.min_area = parseInt(e.target.value);
    });

    // Mode buttons
    document.getElementById('cameraMode').addEventListener('click', openCameraMode);
    document.getElementById('imageMode').addEventListener('click', () => {
        document.getElementById('imageUpload').click();
    });

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Result actions
    document.getElementById('saveExcelBtn').addEventListener('click', saveToExcel);
    document.getElementById('resetBtn').addEventListener('click', resetResults);
    
    // Excel actions
    document.getElementById('previewExcelBtn').addEventListener('click', previewExcelData);
    document.getElementById('openExcelBtn').addEventListener('click', openExcelFile);
    document.getElementById('downloadExcelBtn').addEventListener('click', downloadExcelFile);
    
    // Excel modal
    document.getElementById('closeExcelModal').addEventListener('click', closeExcelModal);
    document.getElementById('refreshExcelBtn').addEventListener('click', previewExcelData);
    document.getElementById('downloadFromPreviewBtn').addEventListener('click', downloadExcelFile);

    // Camera modal
    document.getElementById('closeCameraModal').addEventListener('click', closeCameraMode);
    document.getElementById('stopCameraBtn').addEventListener('click', closeCameraMode);
    document.getElementById('captureScreenshot').addEventListener('click', captureScreenshot);
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when a link is clicked
        const navLinks = mobileMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Keyboard shortcut (ESC to close camera modal)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const cameraModal = document.getElementById('cameraModal');
            const excelModal = document.getElementById('excelModal');
            
            if (!cameraModal.classList.contains('hidden')) {
                closeCameraMode();
            } else if (!excelModal.classList.contains('hidden')) {
                closeExcelModal();
            }
        }
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', toggleFAQ);
    });

    // Tool Buttons - Connect to main functionality
    const toolButtons = document.querySelectorAll('.tools-section .rounded-lg button');
    if (toolButtons.length > 0) {
        toolButtons[0].addEventListener('click', () => document.getElementById('cameraMode').click());
        toolButtons[1].addEventListener('click', () => document.getElementById('imageUpload').click());
        toolButtons[2].addEventListener('click', () => document.getElementById('minAreaSlider').focus());
        toolButtons[3].addEventListener('click', () => document.getElementById('saveExcelBtn').click());
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// Contact Form Handler
// ═══════════════════════════════════════════════════════════════════════════

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Validasi
    if (!name || !email || !subject || !message) {
        showError('Silakan lengkapi semua field!');
        return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Format email tidak valid!');
        return;
    }

    try {
        // Simulasi pengiriman (dalam praktik, ini akan mengirim ke backend)
        const contactData = {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toLocaleString('id-ID')
        };

        // Simpan ke localStorage sebagai contoh
        const existingData = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        existingData.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(existingData));

        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        const successModal = document.getElementById('successModal');
        document.getElementById('successMessage').textContent = `Terima kasih, ${name}! Pesan Anda telah dikirim. Kami akan menghubungi Anda segera.`;
        successModal.classList.remove('hidden');

        console.log('✅ Pesan kontak berhasil dikirim:', contactData);
    } catch (error) {
        showError('Gagal mengirim pesan: ' + error.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// FAQ Toggle Handler
// ═══════════════════════════════════════════════════════════════════════════

function toggleFAQ(e) {
    const content = this.querySelector('.faq-content');
    const icon = this.querySelector('i');
    
    // Tutup semua FAQ lain
    document.querySelectorAll('.faq-item .faq-content').forEach(item => {
        if (item !== content) {
            item.classList.add('hidden');
        }
    });

    // Toggle FAQ saat ini
    content.classList.toggle('hidden');
    
    // Ubah icon direction
    if (!content.classList.contains('hidden')) {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
    } else {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Session Management
// ═══════════════════════════════════════════════════════════════════════════

function updateSession() {
    const client = document.getElementById('clientName').value.trim();
    const mealTime = document.getElementById('mealTime').value;
    const fruitKey = document.getElementById('fruitType').value;

    if (!client || !mealTime || !fruitKey) {
        console.warn('⚠️ Incomplete session info');
        return;
    }

    app.session.client = client;
    app.session.meal_time = mealTime;
    app.session.fruit_label = document.querySelector('#fruitType option:checked').textContent;

    // Send to backend
    fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client: client,
            meal_time: mealTime,
            fruit_label: app.session.fruit_label
        })
    }).catch(e => console.error('Session update error:', e));

    console.log('✅ Session updated:', app.session);
}

// ═══════════════════════════════════════════════════════════════════════════
// Image Upload & Processing
// ═══════════════════════════════════════════════════════════════════════════

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate session
    if (!validateSession()) return;

    // Show loading
    showLoading(true);

    try {
        // Read file locally for preview
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('previewImage').src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Send to backend for processing
        const formData = new FormData();
        formData.append('image', file);
        formData.append('fruit_key', document.getElementById('fruitType').value);
        formData.append('min_area', app.camera.min_area);

        const res = await fetch('/api/process-image', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Processing failed');

        const result = await res.json();
        
        // Update results
        app.current_results = {
            total: result.total,
            counts: result.counts,
            image: result.image
        };

        // Display results
        document.getElementById('previewImage').src = result.image;
        displayResults();
        document.getElementById('saveExcelBtn').disabled = false;

        console.log('✅ Image processed:', result);

    } catch (e) {
        showError('Gagal memproses gambar: ' + e.message);
    } finally {
        showLoading(false);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Camera Mode
// ═══════════════════════════════════════════════════════════════════════════

function openCameraMode() {
    // Validate session
    if (!validateSession()) return;

    // Show modal
    document.getElementById('cameraModal').classList.remove('hidden');
    app.camera.active = true;

    // Start camera loop
    startCameraStream();
}

function closeCameraMode() {
    console.log('🎬 Closing camera mode...');
    
    app.camera.active = false;
    
    if (app.camera.interval) {
        clearInterval(app.camera.interval);
        app.camera.interval = null;
    }

    document.getElementById('cameraModal').classList.add('hidden');
    console.log('✅ Camera mode closed');
}

async function startCameraStream() {
    if (!app.camera.active) return;

    try {
        const params = new URLSearchParams({
            fruit_key: document.getElementById('fruitType').value,
            min_area: app.camera.min_area
        });

        const res = await fetch(`/api/camera-frame?${params}`);
        if (!res.ok) throw new Error('Camera error');

        const data = await res.json();
        document.getElementById('cameraStream').src = data.image;
        document.getElementById('cameraTotal').textContent = data.total;

        // Update breakdown
        const breakdown = document.getElementById('cameraBreakdown');
        if (Object.keys(data.counts).length === 0) {
            breakdown.innerHTML = '<p class="text-gray-400">Tidak ada buah</p>';
        } else {
            breakdown.innerHTML = Object.entries(data.counts)
                .map(([label, count]) => 
                    `<div class="flex justify-between"><span>${label}:</span><span class="text-yellow-400 font-bold">${count}</span></div>`
                )
                .join('');
        }

        // Schedule next frame
        if (app.camera.active) {
            app.camera.interval = setTimeout(startCameraStream, 100);
        }

    } catch (e) {
        console.error('Camera stream error:', e);
        if (app.camera.active) {
            app.camera.interval = setTimeout(startCameraStream, 1000);
        }
    }
}

async function captureScreenshot() {
    try {
        // Get current frame data
        const params = new URLSearchParams({
            fruit_key: document.getElementById('fruitType').value,
            min_area: app.camera.min_area
        });

        const res = await fetch(`/api/camera-frame?${params}`);
        const data = await res.json();

        // Update results
        app.current_results = {
            total: data.total,
            counts: data.counts,
            image: data.image
        };

        // Save to Excel
        await saveToExcel();

        showSuccess('Screenshot tersimpan dan data ditambahkan ke Excel!');

    } catch (e) {
        showError('Gagal mengambil screenshot: ' + e.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Results Display
// ═══════════════════════════════════════════════════════════════════════════

function displayResults() {
    const { total, counts } = app.current_results;

    // Update total
    document.getElementById('totalCount').textContent = total;

    // Update breakdown
    const breakdown = document.getElementById('resultsBreakdown');
    if (Object.keys(counts).length === 0) {
        breakdown.innerHTML = '<div class="text-gray-400 text-center p-4">Tidak ada buah terdeteksi</div>';
    } else {
        breakdown.innerHTML = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([label, count]) => `
                <div class="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <span class="font-semibold">${label}</span>
                    <span class="bg-purple-600 text-white px-3 py-1 rounded font-bold">${count}</span>
                </div>
            `).join('');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Excel Export
// ═══════════════════════════════════════════════════════════════════════════

async function saveToExcel() {
    if (!app.current_results.total && Object.keys(app.current_results.counts).length === 0) {
        showError('Tidak ada data untuk disimpan');
        return;
    }

    try {
        const res = await fetch('/api/save-excel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client: app.session.client,
                meal_time: app.session.meal_time,
                fruit_label: app.session.fruit_label,
                counts: app.current_results.counts,
                total: app.current_results.total,
                excel_path: 'hasil_hitung_buah.xlsx'
            })
        });

        if (!res.ok) throw new Error('Save failed');

        const data = await res.json();
        showSuccess(data.message || 'Data berhasil disimpan ke Excel!');
        closeCameraMode();

    } catch (e) {
        showError('Gagal menyimpan ke Excel: ' + e.message);
    }
}

function resetResults() {
    // Clear inputs
    document.getElementById('imageUpload').value = '';
    document.getElementById('previewImage').src = 
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23333" width="800" height="600"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="%23999" text-anchor="middle" dy=".3em"%3EPreview Gambar akan muncul di sini%3C/text%3E%3C/svg%3E';
    
    // Reset results
    app.current_results = { total: 0, counts: {}, image: null };
    document.getElementById('totalCount').textContent = '0';
    document.getElementById('resultsBreakdown').innerHTML = 
        '<div class="text-gray-400 text-center p-4">Tidak ada data</div>';
    
    // Disable save button
    document.getElementById('saveExcelBtn').disabled = true;

    console.log('✅ Results reset');
}

// ═══════════════════════════════════════════════════════════════════════════
// Excel Management Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Preview data dari file Excel
 */
async function previewExcelData() {
    const excelPath = 'hasil_hitung_buah.xlsx';
    
    try {
        // Show modal
        document.getElementById('excelModal').classList.remove('hidden');
        document.getElementById('excelFileName').textContent = excelPath;
        
        // Show loading
        document.getElementById('excelTableBody').innerHTML = 
            '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i>Loading data...</td></tr>';
        
        // Fetch data
        const res = await fetch(`/api/excel-data?file=${excelPath}`);
        
        if (!res.ok) {
            throw new Error('File Excel tidak ditemukan');
        }
        
        const data = await res.json();
        
        if (data.rows.length === 0) {
            document.getElementById('excelTableBody').innerHTML = 
                '<tr><td colspan="7" class="px-4 py-8 text-center text-gray-400">Belum ada data</td></tr>';
            return;
        }
        
        // Populate table
        const tbody = document.getElementById('excelTableBody');
        tbody.innerHTML = data.rows.map(row => `
            <tr class="hover:bg-gray-500/50 transition">
                <td class="px-4 py-3">${row.no || '-'}</td>
                <td class="px-4 py-3">${row.client || '-'}</td>
                <td class="px-4 py-3">${row.meal_time || '-'}</td>
                <td class="px-4 py-3">${row.fruit || '-'}</td>
                <td class="px-4 py-3 text-center font-bold text-yellow-400">${row.jumlah || 0}</td>
                <td class="px-4 py-3">${row.tanggal || '-'}</td>
                <td class="px-4 py-3">${row.waktu || '-'}</td>
            </tr>
        `).join('');
        
        // Update summary
        const totalBuah = data.rows.reduce((sum, row) => sum + (parseInt(row.jumlah) || 0), 0);
        document.getElementById('excelRowCount').textContent = data.total_rows;
        document.getElementById('summaryTotal').textContent = data.total_rows;
        document.getElementById('summaryFruit').textContent = totalBuah;
        
        // Get last date
        if (data.rows.length > 0) {
            const lastRow = data.rows[data.rows.length - 1];
            document.getElementById('summaryDate').textContent = lastRow.tanggal || '-';
        }
        
        console.log('✅ Excel data loaded:', data);
        
    } catch (e) {
        showError('Error loading Excel: ' + e.message);
        console.error(e);
    }
}

/**
 * Buka file Excel di aplikasi default
 */
async function openExcelFile() {
    const excelPath = 'hasil_hitung_buah.xlsx';
    
    try {
        const res = await fetch(`/api/open-excel?file=${excelPath}`);
        const data = await res.json();
        
        if (res.ok) {
            showSuccess(`✅ File Excel dibuka!\n${excelPath}`);
            console.log('✅ Excel file opened:', data);
        } else {
            showError('Error: ' + data.error);
        }
    } catch (e) {
        showError('Gagal membuka file: ' + e.message);
        console.error(e);
    }
}

/**
 * Download file Excel
 */
function downloadExcelFile() {
    const excelPath = 'hasil_hitung_buah.xlsx';
    
    try {
        // Create download link
        const link = document.createElement('a');
        link.href = `/api/download-excel?file=${excelPath}`;
        link.download = excelPath;
        link.click();
        
        showSuccess(`📥 File Excel diunduh!\n${excelPath}`);
        console.log('✅ Excel file downloaded');
        
    } catch (e) {
        showError('Gagal download: ' + e.message);
    }
}

/**
 * Close Excel preview modal
 */
function closeExcelModal() {
    document.getElementById('excelModal').classList.add('hidden');
}

// ═══════════════════════════════════════════════════════════════════════════
// Validation & Utility Functions
// ═══════════════════════════════════════════════════════════════════════════

function validateSession() {
    const client = document.getElementById('clientName').value.trim();
    const mealTime = document.getElementById('mealTime').value;
    const fruitKey = document.getElementById('fruitType').value;

    if (!client) {
        showError('⚠️ Nama klien harus diisi');
        return false;
    }
    if (!mealTime) {
        showError('⚠️ Waktu penyediaan harus dipilih');
        return false;
    }
    if (!fruitKey) {
        showError('⚠️ Jenis buah harus dipilih');
        return false;
    }

    return true;
}

function showLoading(show) {
    document.getElementById('loadingSpinner').classList.toggle('hidden', !show);
}

function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.remove('hidden');
}

// Log app status
console.log('🍎 Fruit Counter App Loaded');
