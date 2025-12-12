class MyNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                /* --- CSS KHUSUS NAVBAR --- */
                
                .main-header {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    width: 100%;
                    transition: transform 0.3s ease-in-out, background-color 0.3s ease;
                    background-color: rgba(0, 0, 0, 0.9); /* Sedikit lebih gelap agar dropdown kontras */
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid #1e293b;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 64px;
                }

                .header-hidden {
                    transform: translateY(-100%);
                }

                .logo-container { display: flex; align-items: center; }
                .logo { width: 140px; max-height: 100%; object-fit: contain; }

                .main-nav ul { display: flex; align-items: center; gap: 32px; margin: 0; padding: 0; list-style: none; }
                
                .main-nav a {
                    position: relative;
                    font-weight: 500;
                    color: #fff;
                    text-decoration: none;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    padding: 8px 16px;
                    border-radius: 6px;
                }

                .main-nav a.active {
                    background-color: rgba(249, 115, 22, 0.1);
                    border: 1px solid rgba(249, 115, 22, 0.2);
                    color: #ffdb43 !important;
                    font-weight: 600;
                }

                .main-nav a:hover {
                    color: #ffdb43;
                }

                /* Tombol Sign In Default */
                .btn-signin {
                    box-shadow: 0px 0px 15px rgba(254, 161, 0, 0.3);
                    border-radius: 100px;
                    background: linear-gradient(105.11deg, #fea100, #ffdb43);
                    padding: 10px 24px;
                    color: #000;
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }

                /* --- PROFIL USER & DROPDOWN (BARU) --- */
                .user-profile { 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    cursor: pointer; 
                    position: relative; /* Penting untuk posisi dropdown */
                    padding: 5px;
                    border-radius: 50px;
                    transition: background 0.3s;
                }
                
                .user-profile:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                }

                .avatar-circle {
                    width: 40px; height: 40px; background: linear-gradient(135deg, #fea100, #ffdb43);
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    color: #000; font-weight: 800; border: 2px solid rgba(255, 255, 255, 0.2);
                }
                .user-greeting { color: #fff; font-size: 0.9rem; font-weight: 500; }

                /* Style Dropdown Menu */
                .profile-dropdown {
                    position: absolute;
                    top: 120%; /* Muncul di bawah profil */
                    right: 0;
                    width: 200px;
                    background-color: #18181b;
                    border: 1px solid #333;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: none; /* Hidden by default */
                    flex-direction: column;
                    overflow: hidden;
                    z-index: 1100;
                }

                /* Class untuk memunculkan dropdown */
                .profile-dropdown.show {
                    display: flex;
                    animation: fadeIn 0.2s ease-in-out;
                }

                .dropdown-item {
                    padding: 14px 20px;
                    color: #e4e4e7;
                    text-decoration: none;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: background 0.2s;
                    border-bottom: 1px solid #27272a;
                    cursor: pointer;
                }

                .dropdown-item:last-child { border-bottom: none; }
                .dropdown-item:hover { background-color: #27272a; color: #ffdb43; }

                /* Mobile Button */
                .mobile-only-btn { display: none; }
                .menu-toggle { display: none; flex-direction: column; gap: 6px; cursor: pointer; }
                .menu-toggle span { display: block; width: 25px; height: 3px; background: #fff; border-radius: 3px; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* --- RESPONSIVE (MOBILE) --- */
                @media (max-width: 768px) {
                    .main-header { padding: 15px 24px; }
                    #desktopAuthContainer { display: none; }
                    .mobile-only-btn { display: block; width: 100%; text-align: center; margin-top: 15px; }
                    .menu-toggle { display: flex; }

                    .main-nav {
                        position: absolute; top: 100%; left: 0; width: 100%;
                        background-color: rgba(10, 10, 10, 0.98);
                        backdrop-filter: blur(10px); padding: 20px;
                        border-bottom: 1px solid #27272a;
                        display: none; flex-direction: column;
                    }
                    .main-nav.open { display: flex; }
                    .main-nav ul { flex-direction: column; width: 100%; align-items: flex-start; }
                    .main-nav li { width: 100%; }
                    .main-nav a { display: block; width: 100%; }
                    
                    /* Penyesuaian Dropdown di Mobile */
                    .user-greeting { display: inline-block; margin-right: auto; }
                    .user-profile { width: 100%; justify-content: space-between; }
                    .profile-dropdown {
                        position: static; /* Flow biasa di mobile */
                        width: 100%;
                        margin-top: 10px;
                        background-color: rgba(255,255,255,0.05);
                        border: none;
                    }
                }
            </style>

            <header class="main-header">
                <div class="logo-container">
                    <img src="assets/img/logo.png" alt="MyTelco Logo" class="logo"> 
                </div>

                <div class="menu-toggle" id="mobile-menu">
                    <span></span><span></span><span></span>
                </div>

                <nav class="main-nav">
                    <ul>
                        <li><a href="index.html">Beranda</a></li>
                        <li><a href="chatbot.html">Coba AI</a></li>
                        <li><a href="product.html">Produk</a></li>
                        <li><a href="kontak.html">Tentang Kami</a></li>
                        
                        <li class="mobile-only-btn" id="mobileAuthContainer">
                            <a href="login.html" class="btn-signin">Sign In</a>
                        </li>
                    </ul>
                </nav>

                <div class="auth-buttons" id="desktopAuthContainer">
                    <a href="login.html" class="btn-signin">Sign In</a>
                </div>
            </header>
        `;

        this.initMobileMenu();
        this.initScrollBehavior();
        this.highlightActiveLink();
        this.checkLoginStatus();
        this.setupAuthLinks();
        this.checkAccessControl();
    }

    checkAccessControl() {
        const protectedPages = ['chatbot.html'];
        const path = window.location.pathname;
        const pageName = path.split("/").pop(); 
        const userToken = localStorage.getItem('user_token');

        if (protectedPages.includes(pageName) && !userToken) {
            alert("Fitur ini khusus member. Silakan login terlebih dahulu!");
            window.location.href = 'index.html#login'; 
        }
    }

    setupAuthLinks() {
        const signinBtns = this.querySelectorAll('.btn-signin');
        signinBtns.forEach(btn => {
            btn.addEventListener('click', () => {});
        });
    }

    // --- LOGIKA CEK LOGIN & DROPDOWN ---
    checkLoginStatus() {
        const userToken = localStorage.getItem('user_token');

        if (userToken) {
            const user = JSON.parse(userToken);
            const initials = user.name 
                ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'U';

            // HTML untuk Profil + Dropdown Menu
            const profileHTML = `
                <div class="user-profile" id="userProfile">
                    <span class="user-greeting">Hi, ${user.name.split(' ')[0]}</span>
                    <div class="avatar-circle">${initials}</div>

                    <!-- DROPDOWN MENU -->
                    <div class="profile-dropdown" id="profileDropdown">
                        <div class="dropdown-item" id="btnViewProfile">
                            Lihat Profil
                        </div>
                        <div class="dropdown-item" id="btnLogout" style="color: #ff4d4d;">
                            Logout
                        </div>
                    </div>
                </div>
            `;

            // Render ke Desktop & Mobile Container
            const desktopContainer = this.querySelector('#desktopAuthContainer');
            const mobileContainer = this.querySelector('#mobileAuthContainer');

            if (desktopContainer) {
                desktopContainer.innerHTML = profileHTML;
                this.setupProfileActions(desktopContainer);
            }
            if (mobileContainer) {
                mobileContainer.innerHTML = profileHTML;
                this.setupProfileActions(mobileContainer);
            }
        }
    }

    // Fungsi Logika Klik Dropdown & Actionnya
    setupProfileActions(container) {
        const userProfile = container.querySelector('.user-profile');
        const dropdown = container.querySelector('.profile-dropdown');
        const btnLogout = container.querySelector('#btnLogout');
        const btnViewProfile = container.querySelector('#btnViewProfile');

        // Toggle Dropdown saat Profil diklik
        userProfile.addEventListener('click', (e) => {
            // Mencegah dropdown tertutup langsung saat item di dalamnya diklik
            if(e.target.closest('.dropdown-item')) return;
            
            e.stopPropagation(); // Mencegah event bubbling ke window
            dropdown.classList.toggle('show');
        });

        // Tutup dropdown saat klik di luar
        window.addEventListener('click', () => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });

        // Aksi: Lihat Profil -> Ke Dashboard
        btnViewProfile.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });

        // Aksi: Logout
        btnLogout.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin keluar?")) {
                localStorage.removeItem('user_token');
                window.location.href = 'index.html';
            }
        });
    }

    initMobileMenu() {
        const menuToggle = this.querySelector('#mobile-menu');
        const mainNav = this.querySelector('.main-nav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('open');
            });
        }
    }

    initScrollBehavior() {
        let lastScrollTop = 0;
        const header = this.querySelector('.main-header');
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const nav = this.querySelector('.main-nav');
            if (nav.classList.contains('open')) return;

            if (scrollTop > lastScrollTop && scrollTop > 60) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    highlightActiveLink() {
        const links = this.querySelectorAll('.main-nav a');
        const setActive = () => {
            const currentPath = window.location.pathname;
            const currentHash = window.location.hash;
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (currentPath.includes(href) && href !== 'index.html' && href !== '') {
                    link.classList.add('active');
                } else if ((currentPath.endsWith('index.html') || currentPath.endsWith('/')) && href === 'index.html' && !currentHash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };
        setActive();
        window.addEventListener('hashchange', setActive);
    }
}

// --- FOOTER (Tetap Sama) ---
class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="main-footer">
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="logo-container">
                            <img src="assets/img/logo.png" alt="MyTelco" class="footer-logo">
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