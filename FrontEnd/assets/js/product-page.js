import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://fylxzjgcvylsqipisozz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bHh6amdjdnlsc3FpcGlzb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODgyNjksImV4cCI6MjA4MDg2NDI2OX0.OpiME6EUSrVlS4ypw9qZDJYXaHvU3Coe5jGTSONdTeI";

const supabase = createClient(supabaseUrl, supabaseKey);

const productsContainer = document.querySelector(".products");

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

// FETCH REKOMENDASI DARI ML API :3 -----------------
async function fetchMLRecommendations() {
  // DATA DUMMY USER (SIMULASI
  const userProfile = {
    customer_id: "VISITOR-WEB",
    monthly_spend: 50000,
    avg_data_usage_gb: 10,
    pct_video_usage: 0.2,
    travel_score: 0.1,
    complaint_count: 5,
    avg_call_duration: 15,
    topup_freq: 2,
    plan_type: "Prepaid",
    device_brand: "Samsung",
    account_age_days: 365,
  };

  try {
    console.log("AI KU KEMANA YA MINT😹");
    const response = await fetch("https://127.0.0.1:8000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userProfile),
    });

    if (!response.ok) throw new Error("API ML OFFLINE / ERROR");

    const result = await response.json();
    console.log(" AI MENJAWAB: ", result.final_recommendations);
    return result;
  } catch (error) {
    console.error("Error fetching ML recommendations:", error);
    return null;
  }
}

// RENDER REKOMENDASI DI HERO SECTION

function renderHeroRecommendations(mlResult, allProducts) {
  const container = document.querySelector(".hero-recommendations");

  let recommendedProducts = allProducts[0]; // default fallback
  let reasonText = "Paket Rekomendasi untuk Anda";
  let badgeHtml =
    '<span style="background:#eee; color:#555; padding:4px 8px; border-radius:4px; font-size:0.8rem;">🔥 Best Seller</span>';

  // jika ml nyala dan ada rekomendasi
  if (mlResult && mlResult.final_recommendations) {
    // cari produk di database supabase yang namanyya sama dengan hasil ML
    const matchedProducts = allProducts.find(
      (p) =>
        p.category === mlResult.final_recommendations || // coba match by category
        p.name.includes(mlResult.final_recommendations) // coba match by name
    );
    if (matchedProducts) {
      recommendedProducts = matchedProducts;
      reasonText = "AI reason: ${mlResult.meta_data.logic_source";
      badgeHtml =
        '<span style="background:#e0f7fa; color:#006064; padding:4px 8px; border-radius:4px; font-size:0.8rem;">🤖 AI Pick</span>';
    }
  }
  container.innerHTML = `
        <div class="recommendation-text">
            <div class="header-smart">
                <img src="./assets/img/icon/thunder.svg" alt="icon">
                <b class="smart-telco-ai">Spesial Untukmu</b>
            </div>
            <div class="recommendation-title">
                <b>${recommendedProduct.name}</b>
                <p>${reasonText}</p>
                ${badgeHtml}
            </div>
        </div>
        
        <div class="product" style="min-width: 280px; transform: scale(1.05); box-shadow: 0 10px 40px rgba(0,0,0,0.2); border: 2px solid #00d4ff;">
             <div class="label" style="background: #00d4ff; color: #003d52;">${
               recommendedProduct.category
             }</div>
             <div class="quota">${recommendedProduct.data_quota || "-"}</div>
             <div class="title">${recommendedProduct.name}</div>
             
             <div class="prices">
                <div class="price">Rp ${formatPrice(
                  recommendedProduct.price
                )}</div>
             </div>
             
             <button style="width:100%; padding:12px; background:#00d4ff; border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin-top:10px;">
                Ambil Sekarang
             </button>
        </div>
    `;

  // Sedikit styling layout container biar sejajar
  container.style.flexDirection = "row";
  container.style.alignItems = "center";
  container.style.justifyContent = "space-between";
  container.style.gap = "20px";
}

// RENDER ----------------------------

function renderProduct(p) {
  const benefitsList = [
    p.validity ? `Masa Aktif ${p.validity}` : "",
    p.description,
    "5G Ready",
  ].filter(Boolean);

  return `
        <div class="product">
            <div class="label">${p.category}</div>

            <div class="quota">${p.data_quota}</div>
            <div class="title">${p.name}</div>

            <ul>
                ${benefitsList
                  .map(
                    (b) => `
                    <li>
                        <img src="./assets/img/icon/check-circle.svg">${b}
                    </li>
                `
                  )
                  .join("")}
            </ul>

            <div class="prices">
                <p>Mulai dari</p>
                <div class="price">Rp ${formatPrice(
                  p.price
                )}<span>/bulan</span></div>
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
  Booster: ["Data Booster"],
  Travelling: ["Roaming Pass"],
  Keluarga: ["General Offer"],
  "Bundling Device": ["Device Upgrade Offer"],
  Loyalty: ["General Offer"],
  "Top-Up Promo": ["General Offer"],
  "Voice Bundle": ["General Offer"],
};

let allProducts = [];
let activeCategory = null;
let searchQuery = "";

document.querySelectorAll(".category").forEach((cat) => {
  cat.addEventListener("click", () => {
    document
      .querySelectorAll(".category")
      .forEach((c) => c.classList.remove("active"));
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
    filtered = filtered.filter((p) =>
      CATEGORY_MAP[activeCategory].includes(p.category)
    );
  }

  if (searchQuery.length > 0) {
    filtered = filtered.filter(
      (p) =>
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
