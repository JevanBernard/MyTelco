export default class Register {
    async render() {
        return `
            <div class="login-container">
                <!-- BAGIAN KIRI: Visual -->
                <aside class="login-visual">
                    <div class="brand-header">
                        <a href="index.html">
                            <img src="assets/img/logo.png" alt="MyTelco" class="login-logo">
                        </a>
                    </div>
                    <div class="illustration-wrapper">
                        <img src="assets/img/hero-illustration.png" alt="Register Ilustrasi" class="login-3d-img">
                        <div class="orbit-circle"></div>
                    </div>
                </aside>

                <!-- BAGIAN KANAN: Form Register -->
                <section class="login-form-area">
                    <div class="form-content">
                        <header class="form-header">
                            <h1>Bergabunglah!</h1>
                            <p>Daftarkan diri Anda untuk menikmati fitur AI.</p>
                        </header>

                        <form id="registerForm">
                            <div class="form-group">
                                <div class="input-wrapper">
                                    <img src="assets/img/icon/user.svg" class="input-icon" alt="User">
                                    <input type="text" id="fullName" placeholder="Nama Lengkap" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="input-wrapper">
                                    <img src="assets/img/icon/phone.svg" class="input-icon" alt="Phone">
                                    <input type="tel" id="phone" placeholder="Nomor Telepon" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="input-wrapper">
                                    <img src="assets/img/icon/check-circle.svg" class="input-icon" alt="Lock">
                                    <input type="password" id="regPassword" placeholder="Kata Sandi Baru" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="input-wrapper">
                                    <img src="assets/img/icon/check-circle.svg" class="input-icon" alt="Lock">
                                    <input type="password" id="confirmPassword" placeholder="Ulangi Kata Sandi" required>
                                </div>
                            </div>

                            <button type="submit" class="btn-login" style="background: linear-gradient(90deg, #ffb700, #ffcc33); color: black;">
                                Daftar Akun
                            </button>
                        </form>

                        <footer class="form-footer">
                            <p>Sudah punya akun? <a href="auth.html#login">Masuk di sini</a></p>
                        </footer>

                        <div id="registerMessage" class="message-box"></div>
                    </div>
                </section>
            </div>

            <!-- CUSTOM ALERT (Updated for Survey Flow) -->
            <div id="customAlert" class="custom-alert">
                <div class="alert-icon">
                    <img src="assets/img/icon/check-circle.svg" alt="Success">
                </div>
                <div class="alert-body">
                    <h3>Registrasi Berhasil!</h3>
                    <p>Akun Anda siap. Mari isi survey singkat untuk personalisasi.</p>
                </div>
                <button id="alertBtn" class="alert-btn">Mulai Survey</button>
            </div>

            <!-- STYLE ALERT -->
            <style>
                .custom-alert {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.9);
                    background-color: #0a0a0a;
                    border: 1px solid #fea100;
                    border-radius: 16px;
                    padding: 30px;
                    width: 320px;
                    text-align: center;
                    box-shadow: 0 0 50px rgba(254, 161, 0, 0.3); /* Glow effect */
                    display: none; /* Hidden by default */
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    z-index: 10000;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .custom-alert.show {
                    display: flex;
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }

                .alert-icon img {
                    width: 50px;
                    height: 50px;
                    /* Filter agar icon jadi kuning/emas */
                    filter: invert(78%) sepia(68%) saturate(980%) hue-rotate(359deg) brightness(103%) contrast(106%);
                }

                .custom-alert h3 {
                    margin: 0 0 5px 0;
                    color: #fff;
                    font-family: 'Poppins', sans-serif;
                    font-size: 1.2rem;
                }

                .custom-alert p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 0.9rem;
                }

                .alert-btn {
                    background: linear-gradient(90deg, #fea100, #ffdb43);
                    border: none;
                    padding: 12px 30px;
                    border-radius: 50px;
                    font-weight: 700;
                    color: #000;
                    cursor: pointer;
                    width: 100%;
                    font-family: 'Poppins', sans-serif;
                    transition: transform 0.2s;
                }
                
                .alert-btn:hover {
                    transform: scale(1.05);
                }
            </style>
        `;
    }

    async afterRender() {
        const form = document.querySelector('#registerForm');
        const messageElement = document.querySelector('#registerMessage');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Elemen Custom Alert
        const customAlert = document.getElementById('customAlert');
        const alertBtn = document.getElementById('alertBtn');

        if (!form) return;

        // Logic Tombol Alert -> Redirect ke Survey
        if (alertBtn) {
            alertBtn.addEventListener('click', () => {
                customAlert.classList.remove('show');
                // Redirect ke halaman survey
                window.location.href = 'survey.html';
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            messageElement.style.display = 'none';
            messageElement.className = 'message-box';
            
            const fullName = document.querySelector('#fullName').value;
            const phone = document.querySelector('#phone').value;
            const password = document.querySelector('#regPassword').value;
            const confirmPassword = document.querySelector('#confirmPassword').value;

            // Validasi
            if (password !== confirmPassword) {
                messageElement.textContent = 'Password tidak cocok!';
                messageElement.classList.add('error');
                messageElement.style.display = 'block';
                return;
            }

            if (password.length < 3) {
                messageElement.textContent = 'Password minimal 3 karakter!';
                messageElement.classList.add('error');
                messageElement.style.display = 'block';
                return;
            }

            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Memproses...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        name: fullName,
                        username: phone, 
                        password: password 
                    }),
                });

                const result = await response.json();

                console.log("Full Response dari Node.js:", result);

                if (response.ok && result.success) {
                    // --- PERBAIKAN LOGIKA PENYIMPANAN ---
                    // Cek berbagai kemungkinan nama property
                    const userId = result.data?.id || result.data?.user_id;

                    if (userId) {
                        console.log("User ID ditangkap:", userId);
                        localStorage.setItem('temp_user_id', userId);
                    } else {
                        console.error("GAWAT: Backend success tapi tidak ada ID!", result);
                        alert("Terjadi kesalahan sistem: User ID tidak ditemukan.");
                        return; // Stop disini jangan lanjut
                    }
                    
                    localStorage.setItem('temp_reg_name', fullName);

                    customAlert.style.display = 'flex';
                    void customAlert.offsetWidth; 
                    customAlert.classList.add('show');
                    return; 
                } else {
                    throw new Error(result.message || 'Registrasi gagal.');
                }
            } catch (error) {
                console.error('Error:', error);
                messageElement.textContent = error.message;
                messageElement.classList.add('error');
                messageElement.style.display = 'block';
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}