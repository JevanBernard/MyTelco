import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://fylxzjgcvylsqipisozz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bHh6amdjdnlsc3FpcGlzb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODgyNjksImV4cCI6MjA4MDg2NDI2OX0.OpiME6EUSrVlS4ypw9qZDJYXaHvU3Coe5jGTSONdTeI";

const supabase = createClient(supabaseUrl, supabaseKey);

const productsContainer = document.querySelector('.products');

async function fetchProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

    if (error) {
        console.error("Supabase error:", error);
        return [];
    }
    return data;
}


// RENDER ----------------------------

function renderProduct(p) {
    const benefitsList = [
        p.validity ? `Masa Aktif ${p.validity}` : "",
        p.description,
        "5G Ready"
    ].filter(Boolean);

    return `
        <div class="product">
            <div class="label">${p.category}</div>

            <div class="quota">${p.data_quota}</div>
            <div class="title">${p.name}</div>

            <ul>
                ${benefitsList.map(b => `
                    <li>
                        <img src="./assets/img/icon/check-circle.svg">${b}
                    </li>
                `).join('')}
            </ul>

            <div class="prices">
                <p>Mulai dari</p>
                <div class="price">Rp ${formatPrice(p.price)}<span>/bulan</span></div>
            </div>

            <div class="cta">
                <img src="./assets/img/icon/arrow-white-product.svg">
            </div>
        </div>
    `;
}


function renderProducts(list) {
    productsContainer.innerHTML = list.map(renderProduct).join("");
}


// FILTERING -------------------------

const CATEGORY_MAP = {
    "Semua Paket": null,
    "Internet & Chat": ["General Offer"],
    "Nonton Film": ["Streaming Partner Pack"],
    "Booster": ["Data Booster"],
    "Travelling": ["Roaming Pass"],
    "Keluarga": ["General Offer"],
    "Bundling Device": ["Device Upgrade Offer"],
    "Loyalty": ["General Offer"],
    "Top-Up Promo": ["General Offer"],
    "Voice Bundle": ["General Offer"]
};

let allProducts = [];
let activeCategory = null;
let searchQuery = "";

document.querySelectorAll(".category").forEach(cat => {
    cat.addEventListener("click", () => {
        document.querySelectorAll(".category").forEach(c => c.classList.remove("active"));
        cat.classList.add("active");

        const text = cat.querySelector("p").innerText.trim();
        activeCategory = text === "Semua Paket" ? null : text;

        applyFilters();
    });
});

document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
});


function applyFilters() {
    let filtered = [...allProducts];

    if (activeCategory && CATEGORY_MAP[activeCategory]) {
        filtered = filtered.filter(p =>
            CATEGORY_MAP[activeCategory].includes(p.category)
        );
    }

    if (searchQuery.length > 0) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery)
        );
    }

    renderProducts(filtered);
}

// INIT --------------------------------
async function initPage() {
    allProducts = await fetchProducts();
    renderProducts(allProducts);
}

initPage();

function formatPrice(value) {
    value = Number(value);
    if (isNaN(value)) return value;

    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1) + "M";
    }
    if (value >= 1_000) {
        return (value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1) + "K";
    }
    return value.toString();
}

// --- 3. INTERAKSI KATEGORI (KLIK AKTIF) ---
    const categories = document.querySelectorAll('.category');
    categories.forEach(cat => {
        cat.addEventListener('click', () => {
            // Hapus active dari semua
            categories.forEach(c => c.classList.remove('active'));
            // Tambah active ke yg diklik
            cat.classList.add('active');
            
            // Jika di mobile, tutup sidebar setelah klik
            if(window.innerWidth <= 768) {
                filterSidebar.classList.remove('active');
            }
        });
    });
