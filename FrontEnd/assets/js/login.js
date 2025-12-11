document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.querySelector('.btn-login');
    const messageBox = document.getElementById('loginMessage');

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    // Kriteria Validasi
    const MIN_USER_LENGTH = 4;
    const MIN_PASS_LENGTH = 3;

    // Fungsi Validasi Tunggal (Untuk menampilkan error per field)
    function validateField(input, errorElement, minLength, fieldName) {
        const value = input.value.trim();
        
        if (value.length === 0) {
            // Kosong (Belum diketik), jangan merah dulu, tapi sembunyikan error
            input.classList.remove('invalid');
            errorElement.classList.remove('visible');
            return false; 
        } 
        
        if (value.length < minLength) {
            // Error: Kurang Panjang
            input.classList.add('invalid');
            errorElement.textContent = `${fieldName} harus minimal ${minLength} karakter.`;
            errorElement.classList.add('visible');
            return false;
        } else {
            // Sukses
            input.classList.remove('invalid');
            errorElement.classList.remove('visible');
            return true;
        }
    }

    // Fungsi Cek Global (Untuk mengaktifkan tombol Submit)
    function checkFormValidity() {
        const isUserValid = usernameInput.value.trim().length >= MIN_USER_LENGTH;
        const isPassValid = passwordInput.value.trim().length >= MIN_PASS_LENGTH;

        if (isUserValid && isPassValid) {
            submitBtn.disabled = false; // Hidupkan tombol
        } else {
            submitBtn.disabled = true;  // Matikan tombol
        }
    }

    // Event Listener: Real-time typing check
    usernameInput.addEventListener('input', () => {
        validateField(usernameInput, usernameError, MIN_USER_LENGTH, "Customer ID");
        checkFormValidity();
    });

    passwordInput.addEventListener('input', () => {
        validateField(passwordInput, passwordError, MIN_PASS_LENGTH, "Kata Sandi");
        checkFormValidity();
    });

    // --- LOGIKA SUBMIT (SPA - No Reload) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah reload halaman browser

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Reset UI Loading
        messageBox.style.display = 'none';
        messageBox.className = 'message-box';
        
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Memproses...';
        submitBtn.disabled = true;

        try {
            // Panggil API Backend
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Login Sukses
                messageBox.innerText = `Login Berhasil! Mengalihkan...`;
                messageBox.classList.add('success');
                messageBox.style.display = 'block';

                // Simpan session
                localStorage.setItem('user_token', JSON.stringify(data.user));

                // Redirect SPA-style (tanpa refresh penuh, hanya ganti URL)
                setTimeout(() => {
                    window.location.href = 'index.html'; 
                }, 1000);

            } else {
                // Login Gagal (Salah password/username)
                throw new Error(data.message || 'Username atau password salah.');
            }

        } catch (error) {
            // Tampilkan error dari backend
            messageBox.innerText = error.message;
            messageBox.classList.add('error');
            messageBox.style.display = 'block';
            
            // Animasi getar form
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);

        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false; // Hidupkan lagi tombolnya
        }
    });
});