class MyNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                /* --- CSS TAMBAHAN KHUSUS KOMPONEN INI --- */
                
                /* 1. Fix Bug Double Button: Sembunyikan tombol mobile di desktop */
                .mobile-only-btn {
                    display: none;
                }
                @media (max-width: 768px) {
                    .mobile-only-btn {
                        display: block;
                        margin-top: 10px;
                        text-align: center;
                    }
                }

                /* 2. Styling Menu Aktif */
                .main-nav a.active {
                    position: relative;
                    border-radius: 6px;
                    background-color: rgba(249, 115, 22, 0.1);
                    border: 1px solid rgba(249, 115, 22, 0.2);
                    padding: 8px 20px;
                    color: #ffdb43 !important;
                    font-weight: 600;
                    display: inline-block;
                    transition: all 0.3s ease;
                }

                /* 3. Efek Auto-Hide Navbar */
                .main-header {
                    transition: transform 0.3s ease-in-out;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                .header-hidden {
                    transform: translateY(-100%);
                }

                /* 4. STYLE UNTUK PROFIL USER (AVATAR) */
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }
                
                .avatar-circle {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #fea100, #ffdb43);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    font-weight: 800;
                    font-size: 1rem;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 0 15px rgba(254, 161, 0, 0.4);
                    transition: transform 0.2s, border-color 0.2s;
                }

                .avatar-circle:hover {
                    transform: scale(1.1);
                    border-color: #fff;
                }

                .user-greeting {
                    color: #fff;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: block;
                }
                
                @media (max-width: 768px) {
                    .user-greeting { display: none; } /* Hide nama di HP biar rapi */
                    .user-profile { justify-content: center; }
                }
            </style>

            <header class="main-header">
                <div class="logo-container">
                    <img src="assets/img/logo.png" alt="MyTelco Logo" class="logo"> 
                </div>

                <!-- HAMBURGER MENU -->
                <div class="menu-toggle" id="mobile-menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <nav class="main-nav">
                    <ul>
                        <li><a href="index.html">Beranda</a></li>
                        <li><a href="index.html#ml-demo">Coba AI</a></li>
                        <li><a href="index.html#packages">Produk</a></li>
                        <li><a href="index.html#about">Tentang Kami</a></li>
                        
                        <!-- Area Tombol Mobile (Akan diganti JS jika login) -->
                        <li class="mobile-only-btn" id="mobileAuthContainer">
                            <a href="login.html" class="btn-signin">Sign In</a>
                        </li>
                    </ul>
                </nav>

                <!-- Area Tombol Desktop (Akan diganti JS jika login) -->
                <div class="auth-buttons" id="desktopAuthContainer">
                    <a href="login.html" class="btn-signin">Sign In</a>
                </div>
            </header>
        `;

        this.initMobileMenu();
        this.initScrollBehavior();
        this.highlightActiveLink();
        
        // --- JALANKAN CEK LOGIN ---
        this.checkLoginStatus();
    }

    // Fungsi Cek Status Login & Ganti Tampilan
    checkLoginStatus() {
        // Ambil data user dari LocalStorage (disimpan saat login.js sukses)
        const userToken = localStorage.getItem('user_token');

        if (userToken) {
            const user = JSON.parse(userToken);
            // Ambil inisial nama (Misal: "Budi Santoso" -> "BS")
            const initials = user.name 
                ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'U';

            // HTML untuk Avatar Profil
            const profileHTML = `
                <div class="user-profile" id="userProfile" title="Klik untuk Logout">
                    <span class="user-greeting">Hi, ${user.name.split(' ')[0]}</span>
                    <div class="avatar-circle">
                        ${initials}
                    </div>
                </div>
            `;

            // Update Tampilan Desktop
            const desktopContainer = this.querySelector('#desktopAuthContainer');
            if (desktopContainer) {
                desktopContainer.innerHTML = profileHTML;
                this.addLogoutListener(desktopContainer);
            }

            // Update Tampilan Mobile
            const mobileContainer = this.querySelector('#mobileAuthContainer');
            if (mobileContainer) {
                mobileContainer.innerHTML = profileHTML;
                this.addLogoutListener(mobileContainer);
            }
        }
    }

    // Fungsi Logout (Klik Avatar)
    addLogoutListener(container) {
        const profile = container.querySelector('.user-profile');
        if (profile) {
            profile.addEventListener('click', () => {
                // Konfirmasi Logout sederhana
                const confirmLogout = confirm("Apakah Anda yakin ingin keluar (Logout)?");
                if (confirmLogout) {
                    // Hapus data sesi
                    localStorage.removeItem('user_token');
                    // Refresh halaman ke index/login
                    window.location.href = 'index.html';
                }
            });
        }
    }

    initMobileMenu() {
        const menuToggle = this.querySelector('#mobile-menu');
        const mainNav = this.querySelector('.main-nav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                menuToggle.classList.toggle('open');
            });
        }
    }

    initScrollBehavior() {
        let lastScrollTop = 0;
        const header = this.querySelector('.main-header');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 50) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop;
        });
    }

    highlightActiveLink() {
        const links = this.querySelectorAll('.main-nav a');
        const currentUrl = window.location.href;
        const currentHash = window.location.hash;
        const currentPath = window.location.pathname;

        const setActive = (targetLink) => {
            links.forEach(link => link.classList.remove('active'));
            if(targetLink) targetLink.classList.add('active');
        };

        let foundActive = false;
        links.forEach(link => {
            if (link.href === currentUrl) {
                setActive(link);
                foundActive = true;
            } else if (currentPath.endsWith('index.html') && link.getAttribute('href') === 'index.html' && !currentHash) {
                setActive(link);
                foundActive = true;
            }
        });

        if (!foundActive) {
            const homeLink = this.querySelector('a[href="index.html"]');
            if(homeLink) setActive(homeLink);
        }

        links.forEach(link => {
            link.addEventListener('click', () => {
                setActive(link);
                const mainNav = this.querySelector('.main-nav');
                const menuToggle = this.querySelector('#mobile-menu');
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('open');
                }
            });
        });
        
        window.addEventListener('hashchange', () => {
            links.forEach(link => {
                if(link.href === window.location.href) {
                    setActive(link);
                }
            });
        });
    }
}

class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="main-footer">
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="logo-container">
                            <img src="assets/img/logo.png" alt="MyTelco" class="footer-logo">
                            <span class="brand-text">MyTelco</span>
                        </div>
                        <p>Connecting you to the future with intelligent service packages and AI-powered recommendations.</p>
                        
                        <div class="social-links">
                            <a href="#" aria-label="Facebook"><img src="assets/img/icon/facebook.svg" alt="FB"></a>
                            <a href="#" aria-label="Twitter"><img src="assets/img/icon/twitter.svg" alt="TW"></a>
                            <a href="#" aria-label="Instagram"><img src="assets/img/icon/instagram.svg" alt="IG"></a>
                            <a href="#" aria-label="LinkedIn"><img src="assets/img/icon/linkedin.svg" alt="IN"></a>
                        </div>
                    </div>

                    <div class="footer-links">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">Internet Plans</a></li>
                            <li><a href="#">Phone Services</a></li>
                            <li><a href="#">Streaming</a></li>
                            <li><a href="#">Cloud Storage</a></li>
                            <li><a href="#">Global Roaming</a></li>
                        </ul>
                    </div>

                    <div class="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Support</a></li>
                        </ul>
                    </div>

                    <div class="footer-contact">
                        <h4>Contact</h4>
                        <ul>
                            <li>
                                <img src="assets/img/icon/map-pin.svg" alt="Location">
                                <span>Gatot Subroto Tengah, Denpasar 180627</span>
                            </li>
                            <li>
                                <img src="assets/img/icon/phone.svg" alt="Phone">
                                <span>081-238-907-644</span>
                            </li>
                            <li>
                                <img src="assets/img/icon/mail.svg" alt="Mail">
                                <span>hello@mytelco.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2025 MyTelco. All rights reserved.</p>
                    <div class="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('my-navbar', MyNavbar);
customElements.define('my-footer', MyFooter);