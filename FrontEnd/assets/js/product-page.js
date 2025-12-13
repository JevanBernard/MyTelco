const API_URL = "http://127.0.0.1:8000/api/products";

let allProducts = [];
let selectedProduct = null;
let selectedPaymentMethod = 'pulsa';

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupFilters();
});

async function fetchProducts() {
    const container = document.getElementById('productsContainer');
    
    try {
        if (window.lucide) {
            container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;"><i data-lucide="loader-2" class="animate-spin" width="40" style="color:#FEA100"></i></div>`;
            window.lucide.createIcons();
        } else {
            container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;">Loading...</div>`;
        }

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Gagal koneksi Backend");
        
        allProducts = await response.json();
        renderProducts(allProducts);
        
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="text-align:center;color:red;grid-column:1/-1;">Gagal memuat produk. Pastikan Backend nyala.</p>`;
    }
}

function renderProducts(list) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#888;">Produk tidak ditemukan.</p>`;
        return;
    }

    list.forEach(p => {
        const productData = encodeURIComponent(JSON.stringify(p));
        
        const benefits = [
            p.validity ? `Masa Aktif ${p.validity} Hari` : "Selamanya",
            p.description || "Koneksi Stabil"
        ].slice(0, 2);

        const html = `
            <div class="product" onclick="window.openModal('${productData}')" style="cursor:pointer">
                <div class="label">${p.category}</div>
                <div class="quota">
                    ${p.data_quota ? p.data_quota.replace('GB', '').trim() : '-'} 
                    <span>${p.data_quota && p.data_quota.includes('GB') ? 'GB' : ''}</span>
                </div>
                <div class="title">${p.name}</div>
                
                <ul>
                    ${benefits.map(b => `<li><img src="./assets/img/icon/check-circle.svg">${b}</li>`).join('')}
                </ul>
                
                <div class="prices">
                    <p>Harga</p>
                    <div class="price">Rp ${formatPrice(p.price)}</div>
                </div>

                <div class="cta">
                    <img src="./assets/img/icon/arrow-white-product.svg">
                </div>
            </div>
        `;
        container.innerHTML += html;
    });

    if (window.lucide) window.lucide.createIcons();
}

window.openModal = (encodedJson) => {
    try {
        selectedProduct = JSON.parse(decodeURIComponent(encodedJson));
        const modal = document.getElementById('purchaseModal');
        
        renderStep1_Detail();
        
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('active'), 10);
    } catch (e) {
        console.error("Gagal membuka modal:", e);
    }
};

window.closeModal = () => {
    const modal = document.getElementById('purchaseModal');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

function renderStep1_Detail() {
    const content = document.getElementById('modalContent');
    const p = selectedProduct;
    const benefits = getMarketingBenefits(p.category);
    const terms = [
        "Login menggunakan nomor MyTelco.",
        "Harga sudah termasuk PPN 11%.",
        "Kuota berlaku 24 jam."
    ];

    content.innerHTML = `
        <!-- HEADER -->
        <div class="modal-detail-header">
            <div class="detail-title">Detail Produk</div>
            <button class="btn-close" onclick="window.closeModal()">
                <i data-lucide="x" width="32"></i>
            </button>
        </div>

        <!-- CONTENT -->
        <div class="modal-scroll-area">
            
            <!-- Identitas Produk (Circle Icon + Nama Besar) -->
            <div class="product-identity">
                <div class="product-icon-box">
                    <i data-lucide="package" width="32" color="#FEA100"></i>
                </div>
                <div>
                    <div class="product-name-large">${p.name}</div>
                    <div class="product-meta">${p.data_quota} • ${p.validity} Hari</div>
                </div>
            </div>

            <!-- Deskripsi (Box Border) -->
            <div class="info-section">
                <div class="section-label">
                    <i data-lucide="info" width="24" color="#fff"></i> Deskripsi Paket
                </div>
                <div class="section-text">
                    ${p.description || "Paket terbaik untuk kebutuhan digital harian Anda."}
                </div>
            </div>

            <!-- Keuntungan -->
            <div class="info-section" style="border:none; padding:0 24px; background:transparent;">
                <div class="section-label" style="margin-bottom:16px;">
                    Keuntungan Paket
                </div>
                <ul class="detail-list">
                    ${benefits.map(item => `
                        <li>
                            <i data-lucide="check-circle" color="#FEA100" width="24"></i>
                            <span>${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <!-- S&K (Box Border) -->
            <div class="info-section">
                <div class="section-label">
                    <i data-lucide="file-text" width="24" color="#fff"></i> Syarat & Ketentuan
                </div>
                <ul class="detail-list muted">
                    ${terms.map(item => `<li>• ${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="modal-footer-action">
            <div class="price-container">
                <div class="price-label">Total Harga</div>
                <div class="final-price">Rp ${formatPrice(p.price)}</div>
            </div>
            <button onclick="window.renderStep2_Payment()" class="btn-buy-now">
                Beli Sekarang
            </button>
        </div>
    `;
    
    if(window.lucide) window.lucide.createIcons();
}

window.renderStep2_Payment = () => {
    const content = document.getElementById('modalContent');
    const p = selectedProduct;
    
    const methods = [
        { id: 'pulsa', name: 'Pulsa', icon: 'wallet', balance: 'Rp 12.500' },
        { id: 'gopay', name: 'GoPay', icon: 'credit-card', balance: '' }, 
        { id: 'ovo', name: 'OVO', icon: 'credit-card', balance: '' },
        { id: 'dana', name: 'Dana', icon: 'credit-card', balance: '' }
    ];

    const methodsHTML = methods.map((m, index) => {
        const isSelected = index === 0;
        const iconColor = isSelected ? '#FEA100' : '#888';
        const checkIcon = isSelected ? 'check-circle' : 'circle';
        const cardClass = isSelected ? 'payment-card selected' : 'payment-card';

        if (isSelected) selectedPaymentMethod = m.id;

        return `
            <div class="${cardClass}" 
                 onclick="window.selectPaymentMethod(this, '${m.id}')"
                 data-id="${m.id}">
                 
                <div class="payment-left" style="display:flex; align-items:center; gap:1rem;">
                    <div style="background:#222; padding:8px; border-radius:8px;">
                        <i data-lucide="${m.icon}" style="color:${iconColor}"></i>
                    </div>
                    
                    <div>
                        <div style="font-weight:600; color:white;">${m.name}</div>
                        ${m.balance ? `<div style="font-size:0.75rem; color:#888;">Saldo: ${m.balance}</div>` : ''}
                    </div>
                </div>

                <i data-lucide="${checkIcon}" class="check-indicator" style="color:${iconColor}"></i>
            </div>
        `;
    }).join('');

    content.innerHTML = `
        <div class="modal-detail-header">
            <h3 class="detail-title">Pembayaran</h3>
        </div>

        <div class="modal-scroll-area">
            <div class="payment-header-box" style="background:#111; border:1px solid #333; padding:1.5rem; border-radius:16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div style="color:#94A3B8;">Total Tagihan</div>
                <div style="font-size:1.5rem; font-weight:700; color:#FFDB43;">Rp ${formatPrice(p.price)}</div>
            </div>

            <h4 style="color:white; margin-bottom:1rem; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">Pilih Metode</h4>

            <div class="payment-list" style="display:flex; flex-direction:column; gap:10px;">
                ${methodsHTML}
            </div>
            
            <p style="color:#666; font-size:0.8rem; text-align:center; margin-top:2rem;">
                <i data-lucide="lock" style="width:12px; display:inline; vertical-align:middle;"></i> 
                Transaksi aman & terenkripsi
            </p>
        </div>

        <div class="modal-footer-action">
            <button onclick="window.processTx()" class="btn-buy-now">
                Bayar Sekarang
            </button>
            <button onclick="window.openModal('${encodeURIComponent(JSON.stringify(selectedProduct))}')" style="background:transparent; border:none; color:#888; margin-top:1rem; cursor:pointer; font-size:0.9rem; width:100%;">
                Batalkan
            </button>
        </div>
    `;
    
    if(window.lucide) window.lucide.createIcons();
};

window.selectPaymentMethod = (element, methodId) => {
    selectedPaymentMethod = methodId;

    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
        
        const mainIcon = card.querySelector('.payment-left svg') || card.querySelector('.payment-left i');
        if (mainIcon) {
            mainIcon.style.color = '#888';
            mainIcon.setAttribute('stroke', '#888');
        }

        const checkIcon = card.querySelector('.check-indicator');
        if (checkIcon) {
            checkIcon.setAttribute('data-lucide', 'circle');
            checkIcon.style.color = '#444'; 
            checkIcon.setAttribute('stroke', '#444');
        }
    });

    if (element) {
        element.classList.add('selected');
        
        const activeMainIcon = element.querySelector('.payment-left svg') || element.querySelector('.payment-left i');
        if (activeMainIcon) {
            activeMainIcon.style.color = '#FEA100';
            activeMainIcon.setAttribute('stroke', '#FEA100');
        }

        const activeCheckIcon = element.querySelector('.check-indicator');
        if (activeCheckIcon) {
            activeCheckIcon.setAttribute('data-lucide', 'check-circle');
            activeCheckIcon.style.color = '#FEA100';
            activeCheckIcon.setAttribute('stroke', '#FEA100');
        }
    }
    
    if(window.lucide) window.lucide.createIcons();
};

window.processTx = async () => {
    const content = document.getElementById('modalContent');
    const userJson = localStorage.getItem('user');
    
    // 1. Validasi Login
    if (!userJson) {
        alert("Silakan login terlebih dahulu untuk membeli paket.");
        window.location.href = 'auth.html#login';
        return;
    }

    const user = JSON.parse(userJson);
    const userId = user.id || user.user_id; // Handle variasi nama field

    // 2. Tampilan Loading
    content.innerHTML = `
        <div class="success-view">
            <i data-lucide="loader-2" class="animate-spin" width="64" style="color:#FEA100; margin-bottom:1.5rem;"></i>
            <h3 style="color:white;">Memproses Transaksi...</h3>
            <p style="color:#888;">Mohon tunggu sebentar</p>
        </div>
    `;
    if(window.lucide) window.lucide.createIcons();

    // 3. Kirim Data ke Backend FastAPI
    try {
        const payload = {
            user_id: userId,
            product_id: selectedProduct.product_id,
            amount: selectedProduct.price,
            method: selectedPaymentMethod
        };

        console.log("Sending Purchase:", payload);

        const response = await fetch('http://127.0.0.1:8000/api/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Transaksi Gagal");
        }

        // 4. Tampilan Sukses (Jika Backend OK)
        setTimeout(() => {
            content.innerHTML = `
                <div class="success-view">
                    <div style="width:80px; height:80px; background:#00E676; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:1.5rem; box-shadow:0 0 30px rgba(0,230,118,0.3);">
                        <i data-lucide="check" width="48" color="#000"></i>
                    </div>
                    <h2 style="color:white; margin-bottom:0.5rem; font-size:1.8rem;">Pembayaran Berhasil!</h2>
                    <p style="color:#94A3B8; margin-bottom:2.5rem; line-height:1.6;">
                        Paket <b>${selectedProduct.name}</b> telah aktif.<br>
                        Data profil Anda telah diperbarui.
                    </p>
                    <a href="dashboard.html" class="btn-buy-now" style="text-decoration:none; display:block; line-height:1.5;">
                        Lihat Dashboard
                    </a>
                </div>
            `;
            if(window.lucide) window.lucide.createIcons();
        }, 1000);

    } catch (error) {
        console.error("Purchase Error:", error);
        content.innerHTML = `
            <div class="success-view">
                <div style="width:80px; height:80px; background:#FF4D4D; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:1.5rem;">
                    <i data-lucide="x" width="48" color="#fff"></i>
                </div>
                <h2 style="color:white; margin-bottom:0.5rem;">Transaksi Gagal</h2>
                <p style="color:#94A3B8; margin-bottom:2rem;">${error.message}</p>
                <button onclick="window.closeModal()" class="btn-buy-now" style="background:#333; color:white;">
                    Tutup
                </button>
            </div>
        `;
        if(window.lucide) window.lucide.createIcons();
    }
};

function formatPrice(value) {
    value = Number(value);
    if (isNaN(value)) return "0";
    if (value >= 1000000) return (value / 1000000).toFixed(1).replace('.0','') + "jt";
    if (value >= 1000) return (value / 1000).toFixed(0) + "rb";
    return value.toString();
}

function getMarketingBenefits(category) {
    const cat = category.toLowerCase();
    if (cat.includes('streaming')) {
        return ['Kualitas Video HD/4K', 'Tanpa Iklan Mengganggu', 'Termasuk Kuota Utama', 'Bisa Download Offline'];
    } else if (cat.includes('booster') || cat.includes('game')) {
        return ['Ping Rendah (Low Latency)', 'Prioritas Jaringan 5G', 'Tidak Memotong Kuota Utama', 'Koneksi Stabil'];
    } else if (cat.includes('roaming')) {
        return ['Otomatis Terhubung', 'Partner Jaringan Premium', 'Support di 50+ Negara', 'Bantuan Darurat 24/7'];
    } else if (cat.includes('voice')) {
        return ['Suara Jernih VoLTE', 'Tanpa Batas Waktu', 'Bisa ke Semua Operator', 'Jaringan Luas'];
    } else {
        return ['Jaringan 5G MyTelco', 'Full Speed 24 Jam', 'Bisa Tethering Sepuasnya', 'Sisa Kuota Akumulasi'];
    }
}

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const key = e.target.value.toLowerCase();
            renderProducts(allProducts.filter(p => p.name.toLowerCase().includes(key)));
        });
    }
    
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', () => {
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            cat.classList.add('active');
            
            const text = cat.querySelector('p').innerText.trim();
            const target = text === 'Semua Paket' ? null : mapCategoryName(text);
            
            if(!target) renderProducts(allProducts);
            else renderProducts(allProducts.filter(p => p.category.includes(target) || target.includes(p.category)));
        });
    });
}

function mapCategoryName(uiName) {
    const map = {
        "Internet & Chat": "General Offer",
        "Nonton Film": "Streaming Partner Pack",
        "Booster": "Data Booster",
        "Travelling": "Roaming Pass",
        "Keluarga": "Family Plan Offer",
        "Bundling Device": "Device Upgrade Offer",
        "Loyalty": "Retention Offer",
        "Top-Up Promo": "Top-up Promo",
        "Voice Bundle": "Voice Bundle"
    };
    return map[uiName] || uiName;
}
