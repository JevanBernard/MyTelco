class MyNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                /* --- 1. CSS DASAR (DESKTOP FIRST) --- */
                .main-header {
                    position: sticky; top: 0; z-index: 1000; width: 100%;
                    transition: transform 0.3s ease-in-out, background-color 0.3s ease;
                    background-color: rgba(0, 0, 0, 0.9); backdrop-filter: blur(12px);
                    border-bottom: 1px solid #1e293b; box-sizing: border-box;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 20px 64px;
                }

                .header-hidden { transform: translateY(-100%); }
                .logo-container { display: flex; align-items: center; }
                .logo { width: 140px; max-height: 100%; object-fit: contain; }

                /* Navigasi Desktop */
                .main-nav ul { display: flex; align-items: center; gap: 32px; margin: 0; padding: 0; list-style: none; }
                .main-nav a {
                    position: relative; font-weight: 500; color: #fff; text-decoration: none;
                    font-family: 'Inter', sans-serif; font-size: 0.95rem; transition: all 0.3s ease;
                    padding: 8px 16px; border-radius: 6px;
                }
                .main-nav a.active {
                    background-color: rgba(249, 115, 22, 0.1);
                    border: 1px solid rgba(249, 115, 22, 0.2);
                    color: #ffdb43 !important; font-weight: 600;
                }
                .main-nav a:hover { color: #ffdb43; }

                /* Tombol Sign In */
                .btn-signin {
                    box-shadow: 0px 0px 15px rgba(254, 161, 0, 0.3); border-radius: 100px;
                    background: linear-gradient(105.11deg, #fea100, #ffdb43);
                    padding: 10px 24px; color: #000; font-weight: 600; text-decoration: none;
                    font-size: 0.9rem; white-space: nowrap; cursor: pointer; border: none; display: inline-block;
                }

                /* --- USER PROFILE STYLING (DESKTOP) --- */
                .user-profile { 
                    display: flex; align-items: center; gap: 12px; 
                    cursor: pointer; position: relative; padding: 6px 12px;
                    border-radius: 50px; transition: all 0.3s ease;
                    border: 1px solid transparent;
                }
                .user-profile:hover { 
                    background-color: rgba(255, 255, 255, 0.05); 
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .user-info-group { display: flex; flex-direction: column; text-align: right; line-height: 1.2; }
                .user-greeting { color: #fff; font-size: 0.9rem; font-weight: 600; }
                .user-role { color: #94a3b8; font-size: 0.75rem; }

                .avatar-circle {
                    width: 38px; height: 38px; background: linear-gradient(135deg, #fea100, #ffdb43);
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    color: #000; font-weight: 800; border: 2px solid rgba(255, 255, 255, 0.1);
                    font-size: 0.9rem;
                }

                /* Dropdown Menu (Desktop Default) */
                .profile-dropdown {
                    position: absolute; top: 130%; right: 0; width: 240px;
                    background-color: rgba(24, 24, 27, 0.95); backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    display: none; flex-direction: column; overflow: hidden; z-index: 1100;
                    transform-origin: top right;
                }
                .profile-dropdown.show { display: flex; animation: scaleIn 0.2s cubic-bezier(0.165, 0.84, 0.44, 1); }

                .dropdown-item {
                    padding: 12px 16px; color: #d4d4d8; text-decoration: none;
                    font-size: 0.9rem; width: 100%; justify-content: space-between; display: flex; align-items: center;
                    transition: all 0.2s; cursor: pointer; border-left: 2px solid transparent;
                }
                .dropdown-item:hover { background-color: rgba(255,255,255,0.05); color: #fff; border-left-color: #ffdb43; }
                .dropdown-item.danger:hover { color: #ff4d4d; border-left-color: #ff4d4d; background-color: rgba(255, 77, 77, 0.1); }

                /* --- 2. LAYOUT UTILITIES --- */
                .menu-toggle { display: none; flex-direction: column; gap: 6px; cursor: pointer; }
                .menu-toggle span { display: block; width: 25px; height: 3px; background: #fff; border-radius: 3px; transition: all 0.3s ease; }
                
                /* Animasi hamburger ke X */
                .menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(8px, 8px); }
                .menu-toggle.active span:nth-child(2) { opacity: 0; }
                .menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px); }
                
                #mobileAuthContainer { display: none !important; }
                #desktopAuthContainer { display: flex !important; }

                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                /* --- 3. RESPONSIVE (MOBILE <= 768px) --- */
                @media (max-width: 768px) {
                    .main-header { padding: 15px 20px; }
                    .logo { width: 120px; }
                    .menu-toggle { display: flex; z-index: 1001; }

                    .main-nav {
                        position: fixed; 
                        top: 70px; 
                        left: 0; 
                        width: 100%;
                        height: calc(100vh - 70px);
                        background-color: rgba(10, 10, 10, 0.98); 
                        backdrop-filter: blur(15px);
                        border-top: 1px solid #27272a; 
                        padding: 0;
                        display: none; 
                        flex-direction: column; 
                        overflow-y: auto;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease-in-out;
                    }
                    
                    .main-nav.open { 
                        display: flex; 
                        transform: translateX(0);
                    }
                    
                    .main-nav ul { 
                        width: 100%; 
                        padding: 0; 
                        margin: 0;
                        box-sizing: border-box; 
                        flex-direction: column;
                        gap: 0;
                    }
                    
                    .main-nav ul li {
                        width: 100%;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                    }
                    
                    .main-nav a { 
                        display: block; 
                        width: 100%; 
                        padding: 18px 24px; 
                        border-radius: 0;
                        font-size: 1rem;
                        border: none;
                        box-sizing: border-box;
                    }
                    
                    .main-nav a.active {
                        background-color: rgba(249, 115, 22, 0.15);
                        border-left: 3px solid #ffdb43;
                    }

                    /* Auth Logic Mobile */
                    #desktopAuthContainer { display: none !important; }
                    #mobileAuthContainer { 
                        display: block !important; 
                        width: 100%; 
                        padding: 20px 24px;
                        border-top: 1px solid rgba(255,255,255,0.1);
                        margin-top: auto;
                        background-color: rgba(0,0,0,0.3);
                    }
                    
                    #mobileAuthContainer .btn-signin { 
                        width: 100%; 
                        text-align: center; 
                        padding: 14px 24px;
                        font-size: 1rem;
                        display: block;
                    }

                    /* --- MOBILE USER PROFILE (SAMA SEPERTI DESKTOP - DROPDOWN FLOATING) --- */
                    #mobileAuthContainer .user-profile {
                        width: 100%; 
                        justify-content: space-between;
                        padding: 14px 20px; 
                        background-color: rgba(255,255,255,0.03);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px; 
                        margin-bottom: 0;
                        box-sizing: border-box;
                        flex-direction: row;
                        position: relative;
                    }
                    
                    #mobileAuthContainer .user-profile:hover {
                        background-color: rgba(255,255,255,0.05);
                        border-color: rgba(255, 255, 255, 0.15);
                    }
                    
                    #mobileAuthContainer .user-info-group { 
                        text-align: left; 
                        flex: 1;
                    }
                    
                    #mobileAuthContainer .user-greeting {
                        font-size: 1rem;
                        margin-bottom: 2px;
                    }
                    
                    #mobileAuthContainer .avatar-circle {
                        width: 42px;
                        height: 42px;
                        font-size: 1rem;
                    }
                    
                    /* Dropdown di Mobile: FLOATING seperti Desktop, tapi full width navbar */
                    #mobileAuthContainer .profile-dropdown {
                        position: absolute;
                        top: calc(100% + 8px);
                        left: 0;
                        right: 0;
                        width: 100%;
                        background-color: rgba(24, 24, 27, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255,255,255,0.1);
                        border-radius: 12px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                        display: none;
                        flex-direction: column;
                        overflow: hidden;
                        z-index: 1200;
                    }
                    
                    #mobileAuthContainer .profile-dropdown.show {
                        display: flex;
                        animation: dropdownSlide 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
                    }

                    #mobileAuthContainer .dropdown-item { 
                        padding: 14px 20px;
                        font-size: 0.95rem;
                        border-left: 2px solid transparent;
                    }
                    
                    #mobileAuthContainer .dropdown-item:hover {
                        background-color: rgba(255,255,255,0.05);
                        color: #fff;
                        border-left-color: #ffdb43;
                    }
                    
                    #mobileAuthContainer .dropdown-item:first-child {
                        padding: 16px 20px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        background: rgba(255,255,255,0.02);
                        cursor: default;
                    }
                    
                    #mobileAuthContainer .dropdown-item:first-child:hover {
                        background: rgba(255,255,255,0.02);
                        border-left-color: transparent;
                    }
                    
                    @keyframes dropdownSlide {
                        from { 
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
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
                        
                        <!-- Container Auth Mobile (Hidden on Desktop) -->
                        <li id="mobileAuthContainer">
                            <a href="#login" class="btn-signin">Sign In</a>
                        </li>
                    </ul>
                </nav>

                <!-- Container Auth Desktop (Hidden on Mobile) -->
                <div class="auth-buttons" id="desktopAuthContainer">
                    <a href="#login" class="btn-signin">Sign In</a>
                </div>
            </header>
        `;

        this.initMobileMenu();
        this.initScrollBehavior();
        this.highlightActiveLink();
        this.checkLoginStatus();
        this.checkAccessControl();
    }

    checkLoginStatus() {
        const storedUser = localStorage.getItem('user'); 
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUser && isLoggedIn === 'true') {
            try {
                const user = JSON.parse(storedUser);
                const displayName = user.name ? user.name.split(' ')[0] : 'User';
                const initials = user.name 
                    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'U';

                const profileHTML = `
                    <div class="user-profile" id="userProfile">
                        <div class="user-info-group">
                            <span class="user-greeting">Hi, ${displayName}</span>
                        </div>
                        <div class="avatar-circle">${initials}</div>

                        <!-- DROPDOWN MENU -->
                        <div class="profile-dropdown" id="profileDropdown">
                            <div class="dropdown-item" style="cursor: default;">
                                <div>
                                    <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${user.name || 'Pengguna'}</div>
                                    <div style="font-size: 0.85rem; color: #94a3b8;">${user.phone || ''}</div>
                                </div>
                            </div>
                            <div class="dropdown-item" id="btnLogout" style="color: #ff6b6b;">
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                `;

                // Render ke Desktop
                const desktopContainer = this.querySelector('#desktopAuthContainer');
                if (desktopContainer) {
                    desktopContainer.innerHTML = profileHTML;
                    desktopContainer.style.display = 'flex';
                    this.setupProfileActions(desktopContainer);
                }
                
                // Render ke Mobile
                const mobileContainer = this.querySelector('#mobileAuthContainer');
                if (mobileContainer) {
                    mobileContainer.innerHTML = profileHTML;
                    this.setupProfileActions(mobileContainer);
                }

            } catch (e) {
                console.error("Gagal memparsing data user:", e);
                localStorage.clear();
            }
        }
    }

    setupProfileActions(container) {
        const userProfile = container.querySelector('.user-profile');
        const dropdown = container.querySelector('.profile-dropdown');
        const btnLogout = container.querySelector('#btnLogout');

        if (!userProfile || !dropdown) return;

        // Toggle Dropdown
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            // Tutup dropdown lain
            document.querySelectorAll('.profile-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('show');
            });
            dropdown.classList.toggle('show');
        });

        // Logout Action
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm("Apakah Anda yakin ingin keluar?")) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = 'index.html';
                }
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    checkAccessControl() {
        const protectedPages = ['chatbot.html'];
        const path = window.location.pathname;
        const pageName = path.split("/").pop(); 
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (protectedPages.includes(pageName) && isLoggedIn !== 'true') {
            alert("Fitur ini khusus member. Silakan login terlebih dahulu!");
            window.location.href = 'auth.html#login'; 
        }
    }

    initMobileMenu() {
        const menuToggle = this.querySelector('#mobile-menu');
        const mainNav = this.querySelector('.main-nav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('open');
                menuToggle.classList.toggle('active');
            });

            // Close menu saat link diklik
            const navLinks = mainNav.querySelectorAll('a:not(.user-profile)');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('open');
                    menuToggle.classList.remove('active');
                });
            });
        }
    }

    initScrollBehavior() {
        let lastScrollTop = 0;
        const header = this.querySelector('.main-header');
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const nav = this.querySelector('.main-nav');
            if (nav && nav.classList.contains('open')) return;

            if (header) {
                if (scrollTop > lastScrollTop && scrollTop > 60) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }
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