export default class Register {
  async render() {
    return `
      <style>
        /* Container Utama */
        .register-container {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #0d0d0d;
          color: white;
          overflow: hidden;
        }

        /* Bagian Kiri (Visual/Logo) */
        .left-panel {
          flex: 1;
          background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          display: none;
        }
        
        @media (min-width: 768px) {
          .left-panel { display: flex; }
        }

        .brand-logo {
          position: absolute;
          top: 30px;
          left: 30px;
          font-weight: bold;
          font-size: 1.2rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-image {
          width: 300px;
          height: 300px;
          background-image: url('../img/logo.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          filter: drop-shadow(0 0 50px rgba(255, 165, 0, 0.2));
        }

        /* Floating Icons */
        .floating-icons {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          width: 50px;
          height: 50px;
          background: rgba(254, 161, 0, 0.1);
          border: 1px solid rgba(254, 161, 0, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 6s ease-in-out infinite;
        }

        .icon-phone {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        .icon-contact {
          top: 20%;
          right: 15%;
          animation-delay: 1s;
        }

        .icon-user {
          bottom: 25%;
          left: 8%;
          animation-delay: 2s;
        }

        .icon-play {
          bottom: 30%;
          right: 10%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* Bagian Kanan (Formulir) */
        .right-panel {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          background-image: linear-gradient(#151515 1px, transparent 1px), 
                            linear-gradient(90deg, #151515 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #888;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        /* Input Form */
        .input-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .input-group input {
          width: 100%;
          padding: 12px 15px 12px 45px;
          background-color: #1a1b1e;
          border: 1px solid #333;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .input-group input:focus {
          outline: none;
          border-color: #ffb700;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 1.2rem;
        }

        /* Tombol Daftar */
        .btn-submit {
          width: 100%;
          padding: 12px;
          background: linear-gradient(90deg, #ffb700, #ffcc33);
          border: none;
          border-radius: 8px;
          color: black;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
          margin-top: 1rem;
        }

        .btn-submit:hover {
          transform: scale(1.02);
          box-shadow: 0 0 15px rgba(255, 183, 0, 0.4);
        }

        /* Login Link */
        .login-link {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: #ccc;
        }

        .login-link a {
          color: #ffb700;
          text-decoration: none;
          font-weight: bold;
        }

        /* Pesan */
        #registerMessage {
          text-align: center;
          margin-top: 15px;
          font-size: 0.9rem;
          min-height: 20px;
        }
      </style>

      <div class="register-container">
        <div class="left-panel">
          <div class="brand-logo">
            <span style="color:#ffb700; font-size:24px;">M</span> MyTelco
          </div>
          
          <div class="floating-icons">
            <div class="floating-icon icon-phone">📱</div>
            <div class="floating-icon icon-contact">✉️</div>
            <div class="floating-icon icon-user">👤</div>
            <div class="floating-icon icon-play">▶️</div>
          </div>
          
          <div class="hero-image"></div>
        </div>

        <div class="right-panel">
          <div class="form-wrapper">
            <h1>Selamat Datang TelcoFriend!</h1>
            <p class="subtitle">Daftarkan diri Anda dan dapatkan rekomendasi paket menarik.</p>

            <form id="registerForm">
              <div class="input-group">
                <span class="input-icon">👤</span>
                <input type="text" id="fullName" name="fullName" placeholder="Nama Lengkap" required>
              </div>

              <div class="input-group">
                <span class="input-icon">📞</span>
                <input type="tel" id="phone" name="phone" placeholder="Nomor Telepon" required>
              </div>

              <div class="input-group">
                <span class="input-icon">🔒</span>
                <input type="password" id="password" name="password" placeholder="Kata Sandi" required>
              </div>

              <div class="input-group">
                <span class="input-icon">🔒</span>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Konfirmasi Ulang" required>
              </div>

              <button type="submit" class="btn-submit">Lanjutkan</button>
            </form>

            <p id="registerMessage"></p>

            <div class="login-link">
              Sudah punya akun? <a href="#/login">Masuk di sini</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#registerForm');
    const messageElement = document.querySelector('#registerMessage');

    if (!form || !messageElement) {
      console.error('Form registrasi atau elemen pesan tidak ditemukan.');
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      messageElement.style.color = 'white';
      messageElement.textContent = 'Memproses...';

      const fullName = document.querySelector('#fullName').value;
      const phone = document.querySelector('#phone').value;
      const password = document.querySelector('#password').value;
      const confirmPassword = document.querySelector('#confirmPassword').value;

      // Validasi password
      if (password !== confirmPassword) {
        messageElement.style.color = '#ff4d4d';
        messageElement.textContent = 'Password tidak cocok!';
        return;
      }

      if (password.length < 6) {
        messageElement.style.color = '#ff4d4d';
        messageElement.textContent = 'Password minimal 6 karakter!';
        return;
      }

      try {
        // Ganti URL dengan endpoint registrasi backend Anda
        const response = await fetch('YOUR_BACKEND_REGISTER_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name: fullName,
            phone: phone,
            password: password 
          }),
        });

        const result = await response.json();
        console.log('Register Response:', result);

        if (!result.error) {
          messageElement.style.color = '#4ade80';
          messageElement.textContent = 'Registrasi berhasil! Mengarahkan ke survey...';

          setTimeout(() => {
            window.location.hash = '/survey';
          }, 1500);
        } else {
          messageElement.style.color = '#ff4d4d';
          messageElement.textContent = result.message || 'Registrasi gagal.';
        }
      } catch (error) {
        console.error('Error saat registrasi:', error);
        messageElement.style.color = '#ff4d4d';
        messageElement.textContent = 'Terjadi kesalahan saat registrasi (Network Error).';
      }
    });
  }
}