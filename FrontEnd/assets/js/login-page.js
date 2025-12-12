export default class Login {
    async render() {
        return `
            <div class="login-container">
                <!-- ... (Bagian Kiri Visual sama seperti sebelumnya) ... -->
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

                            <div class="form-actions">
                                <a href="#" class="forgot-password">Lupa Kata Sandi?</a>
                            </div>

                            <button type="submit" class="btn-login">Masuk Sekarang</button>
                        </form>

                        <footer class="form-footer">
                            <!-- Link ke Register menggunakan Hash -->
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
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            messageBox.style.display = 'none';
            messageBox.className = 'message-box';
            
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Memproses...';
            submitBtn.disabled = true;

            try {
                // API Call ke Backend
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    messageBox.innerText = `Login Berhasil! Mengalihkan...`;
                    messageBox.classList.add('success');
                    messageBox.style.display = 'block';
                    
                    localStorage.setItem('user_token', JSON.stringify(data.user));

                    // Redirect ke Dashboard (bisa SPA atau file terpisah)
                    setTimeout(() => {
                        window.location.href = 'dashboard.html'; 
                    }, 1000);
                } else {
                    throw new Error(data.message || 'Login gagal');
                }
            } catch (error) {
                messageBox.innerText = error.message;
                messageBox.classList.add('error');
                messageBox.style.display = 'block';
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}