export default class Login {
    async render() {
        // MENGGUNAKAN HTML DESAIN LAMA ANDA (Tanpa Perubahan Tampilan)
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
                        <img src="assets/img/hero-illustration.png" alt="Ilustrasi Login" class="login-3d-img">
                        <div class="orbit-circle"></div>
                    </div>
                </aside>

                <!-- BAGIAN KANAN: Form -->
                <section class="login-form-area">
                    <div class="form-content">
                        <header class="form-header">
                            <h1>Selamat Datang Kembali!</h1>
                            <p>Kelola paket dan dapatkan rekomendasi cerdas.</p>
                        </header>

                        <form id="loginForm">
                            <div class="form-group">
                                <label for="username" class="sr-only">No Telepon</label>
                                <div class="input-wrapper">
                                    <img src="assets/img/icon/phone.svg" class="input-icon" alt="User">
                                    <input type="text" id="username" placeholder="No Telepon" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="password" class="sr-only">Kata Sandi</label>
                                <div class="input-wrapper">
                                    <img src="assets/img/icon/check-circle.svg" class="input-icon" alt="Lock"> 
                                    <input type="password" id="password" placeholder="Kata Sandi" required>
                                </div>
                            </div>

                            <div class="form-actions" style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
                                <a href="#" class="forgot-password" style="color: #666; font-size: 0.9rem; text-decoration: none;">Lupa Kata Sandi?</a>
                            </div>

                            <button type="submit" class="btn-login">Masuk Sekarang</button>
                        </form>

                        <footer class="form-footer">
                            <p>Belum punya akun? <a href="#register">Daftar di sini</a></p>
                        </footer>

                        <div id="loginMessage" class="message-box"></div>
                    </div>
                </section>
            </div>
        `;
    }

    async afterRender() {
        const loginForm = document.getElementById('loginForm');
        const messageBox = document.getElementById('loginMessage');
        const submitBtn = document.querySelector('.btn-login');

        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ambil value dari ID yang sesuai dengan HTML lama (username)
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Reset Pesan
            messageBox.style.display = 'none';
            messageBox.className = 'message-box';
            
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Memproses...';
            submitBtn.disabled = true;

            try {
                // LOGIKA BARU: Fetch ke Backend Node.js
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: username, // Kirim sebagai 'username' sesuai controller backend
                        password: password 
                    })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // SUKSES
                    messageBox.innerText = `Login Berhasil! Mengalihkan...`;
                    messageBox.style.display = 'block';
                    messageBox.style.color = 'green';
                    
                    // Simpan data user (sesuai struktur response backend kita: result.data)
                    localStorage.setItem('user', JSON.stringify(result.data));
                    localStorage.setItem('isLoggedIn', 'true');

                    // Redirect
                    setTimeout(() => {
                        window.location.href = 'dashboard.html'; 
                    }, 1000);
                } else {
                    throw new Error(result.message || 'Login gagal');
                }
            } catch (error) {
                console.error('Login Error:', error);
                messageBox.innerText = error.message;
                messageBox.style.display = 'block';
                messageBox.style.color = 'red';
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}