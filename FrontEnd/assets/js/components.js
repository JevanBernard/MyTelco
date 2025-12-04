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
                    /* Di mobile, tombol desktop disembunyikan oleh CSS utama */
                }

                /* 2. Styling Menu Aktif (Sesuai Desain Figma) */
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
                
                /* Class ini akan ditambahkan via JS saat scroll ke bawah */
                .header-hidden {
                    transform: translateY(-100%);
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
                        <!-- Link Navigasi (Class active akan ditambahkan otomatis oleh JS) -->
                        <li><a href="index.html">Beranda</a></li>
                        <li><a href="index.html#ml-demo">Coba AI</a></li>
                        <li><a href="index.html#packages">Produk</a></li>
                        <li><a href="index.html#about">Tentang Kami</a></li>
                        
                        <!-- Tombol Sign In Mobile (Hanya muncul di HP) -->
                        <li class="mobile-only-btn"><a href="#" class="btn-signin">Sign In</a></li>
                    </ul>
                </nav>

                <!-- Tombol Sign In Desktop (Disembunyikan di Mobile via CSS Utama) -->
                <div class="auth-buttons">
                    <a href="#" class="btn-signin">Sign In</a>
                </div>
            </header>
        `;

        this.initMobileMenu();
        this.initScrollBehavior();
        this.highlightActiveLink(); // Jalankan fungsi otomatis active state
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

    // Logika Auto-Hide Navbar saat Scroll
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

    // --- LOGIKA BARU: OTOMATIS PINDAH ACTIVE STATE ---
    highlightActiveLink() {
        const links = this.querySelectorAll('.main-nav a');
        const currentUrl = window.location.href;
        const currentHash = window.location.hash;
        const currentPath = window.location.pathname;

        // Fungsi pembantu untuk set active class
        const setActive = (targetLink) => {
            links.forEach(link => link.classList.remove('active'));
            if(targetLink) targetLink.classList.add('active');
        };

        // 1. Cek saat halaman dimuat
        let foundActive = false;
        links.forEach(link => {
            // Logika pencocokan URL
            if (link.href === currentUrl) {
                setActive(link);
                foundActive = true;
            } else if (currentPath.endsWith('index.html') && link.getAttribute('href') === 'index.html' && !currentHash) {
                // Khusus halaman utama tanpa hash
                setActive(link);
                foundActive = true;
            }
        });

        // Jika tidak ada yang cocok (misal root '/'), set Beranda sebagai default
        if (!foundActive) {
            const homeLink = this.querySelector('a[href="index.html"]');
            if(homeLink) setActive(homeLink);
        }

        // 2. Update saat link diklik (agar terasa instan tanpa reload)
        links.forEach(link => {
            link.addEventListener('click', () => {
                setActive(link);
                
                // Tutup menu mobile jika sedang terbuka
                const mainNav = this.querySelector('.main-nav');
                const menuToggle = this.querySelector('#mobile-menu');
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('open');
                }
            });
        });
        
        // 3. Update saat hash berubah (untuk navigasi satu halaman/scroll)
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