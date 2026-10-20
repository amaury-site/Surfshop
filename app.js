/**
 * AURA SURF — Catalogue (3 gammes), panier, modale 3D/AR
 * Corrections : panier corrompu, stock plafonné, tiroir hors portée, touche Échap, filtres dynamiques
 */

// 1. CATALOGUE ---------------------------------------------------------
const GLB = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/";
// Remplacez ces modèles de démonstration par vos propres fichiers .glb (ex: "assets/models/combi-43.glb")
const MODEL_A = GLB + "MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb";
const MODEL_B = GLB + "ToyCar/glTF-Binary/ToyCar.glb";
const img = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
const WS = ["XS", "S", "M", "L", "XL"];

const SURF_CATALOG = [
    // GAMME 1 — Combinaisons
    { id: "combi-32", name: "Combinaison Steamer 3/2mm", category: "combinaisons", price: 299, tagline: "Eaux tempérées, 14–18°C",
      sizes: WS, stock: { XS: 3, S: 6, M: 5, L: 4, XL: 2 }, fit: "Seconde peau", image: img("photo-1502680390469-be75c86b636f"), modelGlb: MODEL_A,
      specs: { material: "Néoprène calcaire 3/2mm, coutures GBS", temperature: "14°C – 18°C", weight: "1.020 kg", care: "Rincer à l'eau douce, sécher à l'ombre" },
      description: "La polyvalente du printemps et de l'automne. Coutures cousues-collées galonnées et doublure thermique légère." },
    { id: "combi-43", name: "Combinaison Steamer 4/3mm", category: "combinaisons", price: 389, tagline: "Eaux froides, 10–15°C",
      sizes: WS, stock: { XS: 3, S: 5, M: 0, L: 4, XL: 2 }, fit: "Compression seconde peau", image: img("photo-1531722564168-6c8d35704d9c"), modelGlb: MODEL_A,
      specs: { material: "Néoprène calcaire 4/3mm, plastron thermo-réflecteur", temperature: "10°C – 15°C", weight: "1.150 kg", care: "Rincer à l'eau douce, cintre large à l'ombre" },
      description: "Conçue pour l'hiver atlantique. Plastron thermo-réflecteur et zip dorsal étanche pour garder la chaleur session après session." },
    { id: "combi-54", name: "Combinaison Hooded 5/4mm", category: "combinaisons", price: 459, tagline: "Eaux très froides, < 10°C",
      sizes: WS, stock: { XS: 1, S: 3, M: 4, L: 3, XL: 1 }, fit: "Ajustée avec cagoule intégrée", image: img("photo-1544367567-0f2fcb009e0b"), modelGlb: MODEL_A,
      specs: { material: "Néoprène calcaire 5/4mm + cagoule, coutures GBS", temperature: "6°C – 10°C", weight: "1.480 kg", care: "Rincer à l'eau douce, ne pas plier" },
      description: "Notre protection maximale pour les sessions de janvier. Cagoule intégrée et doublure en fibres thermiques à séchage rapide." },
    { id: "shorty-22", name: "Shorty 2/2mm", category: "combinaisons", price: 179, tagline: "Eaux douces, 18–22°C",
      sizes: WS, stock: { XS: 4, S: 6, M: 6, L: 3, XL: 2 }, fit: "Souple, manches et jambes courtes", image: img("photo-1565084888279-aca607ecce0c"), modelGlb: MODEL_A,
      specs: { material: "Néoprène calcaire 2/2mm", temperature: "18°C – 22°C", weight: "620 g", care: "Rincer à l'eau douce" },
      description: "La liberté de mouvement pour les sessions d'été et d'entre-saison, avec une protection légère contre le vent." },
    // GAMME 2 — Planches
    { id: "board-long-9", name: "Longboard 9'0\" Classic Glide", category: "planches", price: 679, tagline: "Glisse et fluidité, 68 L",
      sizes: ["9'0"], stock: { "9'0": 3 }, fit: "Débutant à confirmé, petites vagues", image: img("photo-1508873696983-2df57046475a"), modelGlb: MODEL_B,
      specs: { material: "Noyau PU/PE, glaçage époxy, 3 lattes de bois", temperature: "Toutes saisons", weight: "5.9 kg (Volume 68 L)", care: "Housse réfléchissante, éviter le plein soleil" },
      description: "Rocker doux et nose généreux pour la glisse et le style. La planche idéale pour apprendre ou surfer les petites vagues." },
    { id: "board-mid-7", name: "Midlength 7'0\" Allround", category: "planches", price: 619, tagline: "Polyvalence, 44 L",
      sizes: ["7'0"], stock: { "7'0": 4 }, fit: "Intermédiaire, vagues moyennes", image: img("photo-1473186578172-c141e6798cf4"), modelGlb: MODEL_B,
      specs: { material: "Noyau EPS, glaçage époxy, quad ou thruster", temperature: "Toutes saisons", weight: "3.4 kg (Volume 44 L)", care: "Housse réfléchissante, éviter le plein soleil" },
      description: "Le compromis entre flottabilité du longboard et réactivité du shortboard. Rame facile, bon appui en courbe." },
    { id: "board-short-511", name: "Shortboard 5'11\" Carbone", category: "planches", price: 749, tagline: "Performance, 29,5 L",
      sizes: ["5'11"], stock: { "5'11": 2 }, fit: "Confirmé, vagues creuses", image: img("photo-1563299796-17596ed6b017"), modelGlb: MODEL_B,
      specs: { material: "Noyau EPS usiné CNC, carbone & résine époxy", temperature: "Toutes saisons", weight: "2.450 kg (Volume 29,5 L)", care: "Housse réfléchissante, éviter le plein soleil" },
      description: "Rocker tendu, carène en double concave et renforts carbone pour une relance immédiate dans la section creuse." },
    // GAMME 3 — Top UV, boardshorts & accessoires
    { id: "top-uv", name: "Top UV Thermo-Régulant UPF 50+", category: "accessoires", price: 49, tagline: "Protection solaire, 18–24°C",
      sizes: WS, stock: { XS: 4, S: 6, M: 7, L: 0, XL: 3 }, fit: "Ajusté athlétique", image: img("photo-1544367567-0f2fcb009e0b"), modelGlb: MODEL_A,
      specs: { material: "Lycra élasthanne anti-UVA/UVB", temperature: "18°C – 24°C", weight: "180 g", care: "Rincer après contact avec l'eau salée" },
      description: "Anti-abrasion et anti-rougeurs, avec des panneaux latéraux respirants pour les longues phases de rame." },
    { id: "boardshort", name: "Boardshort Mirage Stretch 19\"", category: "accessoires", price: 79, tagline: "Eaux chaudes, > 21°C",
      sizes: ["S", "M", "L", "XL"], stock: { S: 3, M: 8, L: 5, XL: 2 }, fit: "Coupe droite anti-irritation", image: img("photo-1565084888279-aca607ecce0c"), modelGlb: MODEL_B,
      specs: { material: "Polyester recyclé 4-way stretch (88%)", temperature: "> 21°C", weight: "140 g", care: "Machine 30°C sans assouplissant" },
      description: "Traitement déperlant à séchage rapide, ceinture plate sans couture pour éviter les frottements sur la wax." },
    { id: "leash", name: "Leash Compétition Uréthane 6ft", category: "accessoires", price: 36, tagline: "Vagues de 0,5 à 2 m",
      sizes: ["Unique"], stock: { Unique: 12 }, fit: "Taille unique", image: img("photo-1508873696983-2df57046475a"), modelGlb: MODEL_B,
      specs: { material: "Uréthane 6mm, émerillons inox 316L", temperature: "Toutes saisons", weight: "160 g", care: "Stocker déroulé" },
      description: "Émerillons doubles fluides et manchette de cheville en néoprène avec boucle d'ouverture rapide." },
    { id: "wax", name: "Pack Wax Bio & Peigne", category: "accessoires", price: 15, tagline: "Eaux froides, 9–14°C",
      sizes: ["Unique"], stock: { Unique: 25 }, fit: "Universel", image: img("photo-1473186578172-c141e6798cf4"), modelGlb: MODEL_A,
      specs: { material: "Cire d'abeille bio & résine de pin", temperature: "9°C – 14°C", weight: "85 g × 2", care: "Conserver à l'abri de la chaleur" },
      description: "Formule biodégradable sans dérivés pétrochimiques, livrée avec un peigne en bambou." }
];

// 2. ÉTAT --------------------------------------------------------------
const CART_KEY = "aura_cart_v1"; // même clé que checkout.html
function loadCart() {
    try {
        const raw = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(raw) ? raw.filter(i => i && i.id && i.size && i.qty > 0 && i.price >= 0) : [];
    } catch (e) { return []; }
}
const AppState = {
    filters: { category: "all", maxPrice: 900, size: "all", sort: "featured" },
    cart: loadCart(), activeModalProduct: null, selectedSize: null
};
const fmt = n => n.toFixed(2).replace(".", ",") + " €";

// 3. PANIER ------------------------------------------------------------
function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(AppState.cart)); } catch (e) { /* stockage indisponible */ }
    updateCartUI();
}
function addToCart(productId, size) {
    const p = SURF_CATALOG.find(i => i.id === productId);
    if (!p) return;
    const available = p.stock[size] || 0;
    if (available === 0) return toast(`La taille ${size} est épuisée.`);
    const line = AppState.cart.find(e => e.id === productId && e.size === size);
    if (line) {
        if (line.qty >= available) return toast(`Stock maximum atteint pour ${size} (${available}).`);
        line.qty++;
    } else {
        AppState.cart.push({ id: p.id, name: p.name, price: p.price, size, image: p.image, qty: 1 });
    }
    saveCart();
    toast(`Ajouté au Quiver : ${p.name} (${size})`);
}
function updateCartQuantity(index, delta) {
    const line = AppState.cart[index];
    if (!line) return;
    const p = SURF_CATALOG.find(i => i.id === line.id);
    const max = p ? p.stock[line.size] : Infinity;
    if (delta > 0 && line.qty >= max) return toast(`Stock maximum atteint (${max}).`);
    line.qty += delta;
    if (line.qty <= 0) AppState.cart.splice(index, 1);
    saveCart();
}
function removeCartItem(index) { AppState.cart.splice(index, 1); saveCart(); }

function toggleCartDrawer(open) {
    const drawer = document.getElementById("cart-drawer");
    drawer.classList.toggle("active", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.getElementById("cart-backdrop").classList.toggle("active", open);
}

// 4. CATALOGUE & FILTRES ----------------------------------------------
function buildSizeFilter() {
    const sel = document.getElementById("size-filter");
    const all = [...new Set(SURF_CATALOG.flatMap(p => p.sizes))];
    all.forEach(s => sel.insertAdjacentHTML("beforeend", `<option value="${s}">${s === "Unique" ? "Taille unique" : s}</option>`));
}

function renderProducts() {
    const grid = document.getElementById("products-grid");
    const f = AppState.filters;
    const list = SURF_CATALOG.filter(p =>
        (f.category === "all" || p.category === f.category) &&
        p.price <= f.maxPrice && (f.size === "all" || p.sizes.includes(f.size)));
    if (f.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") list.sort((a, b) => b.price - a.price);

    if (!list.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:72px 0;color:var(--color-text-muted)">
            <p style="font-size:1.1rem;font-weight:600;color:#0b0d12">Aucun produit ne correspond à ces filtres.</p>
            <button type="button" class="tag-btn" style="margin-top:16px" onclick="resetFilters()">Réinitialiser les filtres</button></div>`;
        return;
    }
    grid.innerHTML = list.map(p => {
        const total = Object.values(p.stock).reduce((a, b) => a + b, 0);
        const low = total > 0 && total <= 4;
        return `<article class="product-card">
            <div class="card-media">
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
                <span class="ar-chip">3D · AR</span>
                ${total === 0 ? '<span class="stock-chip">Épuisé</span>' : low ? '<span class="stock-chip">Derniers exemplaires</span>' : ""}
            </div>
            <div class="card-info">
                <span class="card-category">${p.category}</span>
                <h3 class="card-title">${p.name}</h3>
                <p class="card-tagline">${p.tagline}</p>
                <p class="card-price">${fmt(p.price)}</p>
                <div class="card-action-bar">
                    <button type="button" class="btn-inspect" onclick="openProductModal('${p.id}')">Voir en 3D</button>
                    <button type="button" class="btn-quick-cart" aria-label="Ajouter ${p.name} au quiver" onclick="quickAddDefaultSize('${p.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                </div>
            </div></article>`;
    }).join("");
}

function setCategory(cat) {
    AppState.filters.category = cat;
    document.querySelectorAll(".tag-btn[data-filter-cat]").forEach(b => b.classList.toggle("active", b.dataset.filterCat === cat));
    document.querySelectorAll(".nav-link[data-category]").forEach(l => l.classList.toggle("active", l.dataset.category === cat));
    renderProducts();
}

function resetFilters() {
    Object.assign(AppState.filters, { category: "all", maxPrice: 900, size: "all", sort: "featured" });
    document.getElementById("price-filter").value = 900;
    document.getElementById("price-val").textContent = "900 €";
    document.getElementById("size-filter").value = "all";
    document.getElementById("sort-select").value = "featured";
    setCategory("all");
}

// 5. MODALE 3D ---------------------------------------------------------
function openProductModal(productId) {
    const p = SURF_CATALOG.find(i => i.id === productId);
    if (!p) return;
    AppState.activeModalProduct = p;
    AppState.selectedSize = p.sizes.find(s => p.stock[s] > 0) || null;

    const set = (id, v) => { document.getElementById(id).textContent = v; };
    set("modal-product-category", p.category);
    set("modal-product-title", p.name);
    set("modal-product-price", fmt(p.price));
    set("modal-product-desc", p.description);
    set("modal-fit-badge", `Coupe : ${p.fit}`);
    set("modal-spec-material", p.specs.material);
    set("modal-spec-temp", p.specs.temperature);
    set("modal-spec-weight", p.specs.weight);
    set("modal-spec-care", p.specs.care);

    const box = document.getElementById("modal-sizes-container");
    box.innerHTML = "";
    p.sizes.forEach(size => {
        const ok = p.stock[size] > 0;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "size-btn" + (size === AppState.selectedSize ? " selected" : "") + (ok ? "" : " disabled");
        b.textContent = size + (ok ? "" : " (épuisé)");
        b.disabled = !ok;
        b.addEventListener("click", () => {
            box.querySelectorAll(".size-btn").forEach(x => x.classList.remove("selected"));
            b.classList.add("selected");
            AppState.selectedSize = size;
        });
        box.appendChild(b);
    });

    const addBtn = document.getElementById("modal-add-cart-btn");
    addBtn.disabled = !AppState.selectedSize;
    addBtn.textContent = AppState.selectedSize ? "Ajouter à mon Quiver" : "Épuisé";

    const viewer = document.getElementById("main-model-viewer");
    viewer.setAttribute("src", p.modelGlb);
    p.modelUsdz ? viewer.setAttribute("ios-src", p.modelUsdz) : viewer.removeAttribute("ios-src");

    const modal = document.getElementById("product-modal");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-close-btn").focus();
}

function closeProductModal() {
    const modal = document.getElementById("product-modal");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function quickAddDefaultSize(productId) {
    const p = SURF_CATALOG.find(i => i.id === productId);
    const size = p && p.sizes.find(s => p.stock[s] > 0);
    size ? addToCart(p.id, size) : toast("Article en rupture de stock.");
}

// 6. AFFICHAGE PANIER --------------------------------------------------
function updateCartUI() {
    const count = AppState.cart.reduce((a, i) => a + i.qty, 0);
    document.getElementById("cart-counter").textContent = count;
    document.getElementById("drawer-cart-count").textContent = count;

    const list = document.getElementById("cart-items-list");
    list.innerHTML = AppState.cart.length ? AppState.cart.map((it, i) => `
        <div class="cart-item-card">
            <img src="${it.image}" alt="${it.name}" onerror="this.style.visibility='hidden'">
            <div>
                <h4 style="font-size:.88rem;font-weight:600">${it.name}</h4>
                <p style="font-size:.78rem;color:var(--color-text-muted)">Taille ${it.size} · ${fmt(it.price)}</p>
                <div style="display:flex;align-items:center;gap:10px;margin-top:8px">
                    <button type="button" aria-label="Retirer une unité" style="width:26px;height:26px;border:1px solid var(--color-border);background:#fff;border-radius:50%;cursor:pointer" onclick="updateCartQuantity(${i},-1)">−</button>
                    <span style="font-size:.85rem;font-weight:600">${it.qty}</span>
                    <button type="button" aria-label="Ajouter une unité" style="width:26px;height:26px;border:1px solid var(--color-border);background:#fff;border-radius:50%;cursor:pointer" onclick="updateCartQuantity(${i},1)">+</button>
                </div>
            </div>
            <div style="text-align:right">
                <button type="button" aria-label="Supprimer l'article" style="background:none;border:none;color:#a1a1a6;cursor:pointer;font-size:1.1rem" onclick="removeCartItem(${i})">&times;</button>
                <div style="font-weight:600;font-size:.92rem">${fmt(it.price * it.qty)}</div>
            </div>
        </div>`).join("") : `
        <div style="text-align:center;margin:auto;color:var(--color-text-muted)">
            <p style="font-weight:600;color:#0b0d12">Votre quiver est vide.</p>
            <span style="font-size:.82rem">Ajoutez une combinaison, une planche ou un accessoire.</span>
        </div>`;

    const ttc = AppState.cart.reduce((a, i) => a + i.price * i.qty, 0);
    const ht = ttc / 1.2;
    document.getElementById("cart-subtotal").textContent = fmt(ht);
    document.getElementById("cart-tax").textContent = fmt(ttc - ht);
    document.getElementById("cart-total").textContent = fmt(ttc);

    const threshold = 100;
    const fill = document.getElementById("shipping-progress-fill");
    const text = document.getElementById("shipping-progress-text");
    fill.style.width = Math.min(ttc / threshold * 100, 100) + "%";
    text.textContent = ttc >= threshold ? "Livraison neutre en carbone offerte" : `Plus que ${fmt(threshold - ttc)} pour la livraison offerte`;
}

// 7. TOASTS, ANIMATIONS & INIT ----------------------------------------
function toast(message) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.getElementById("toast-container").appendChild(el);
    setTimeout(() => { el.style.transition = "opacity .25s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 250); }, 3000);
}
const showToastNotification = toast; // compatibilité

document.addEventListener("DOMContentLoaded", () => {
    buildSizeFilter();
    renderProducts();
    updateCartUI();

    document.querySelectorAll(".tag-btn[data-filter-cat]").forEach(b => b.addEventListener("click", () => setCategory(b.dataset.filterCat)));
    document.querySelectorAll(".nav-link[data-category]").forEach(l => l.addEventListener("click", () => {
        setCategory(l.dataset.category);
        document.getElementById("catalogue").scrollIntoView();
    }));
    document.querySelectorAll(".collection-tile").forEach(t => t.addEventListener("click", () => {
        setCategory(t.dataset.category);
        document.getElementById("catalogue").scrollIntoView();
    }));

    const burger = document.getElementById("mobile-menu-btn");
    const drawer = document.getElementById("mobile-nav-drawer");
    if (burger && drawer) burger.addEventListener("click", () => drawer.classList.toggle("open"));

    document.getElementById("price-filter").addEventListener("input", e => {
        AppState.filters.maxPrice = parseFloat(e.target.value);
        document.getElementById("price-val").textContent = `${e.target.value} €`;
        renderProducts();
    });
    document.getElementById("size-filter").addEventListener("change", e => { AppState.filters.size = e.target.value; renderProducts(); });
    document.getElementById("sort-select").addEventListener("change", e => { AppState.filters.sort = e.target.value; renderProducts(); });

    document.getElementById("modal-close-btn").addEventListener("click", closeProductModal);
    document.getElementById("product-modal").addEventListener("click", e => { if (e.target.id === "product-modal") closeProductModal(); });
    document.getElementById("modal-add-cart-btn").addEventListener("click", () => {
        if (AppState.activeModalProduct && AppState.selectedSize) {
            addToCart(AppState.activeModalProduct.id, AppState.selectedSize);
            closeProductModal();
            toggleCartDrawer(true);
        }
    });

    document.getElementById("cart-toggle-btn").addEventListener("click", () => toggleCartDrawer(true));
    document.getElementById("cart-close-btn").addEventListener("click", () => toggleCartDrawer(false));
    document.getElementById("cart-backdrop").addEventListener("click", () => toggleCartDrawer(false));
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeProductModal(); toggleCartDrawer(false); } });

    document.getElementById("checkout-trigger-btn").addEventListener("click", () => {
        if (!AppState.cart.length) return toast("Votre quiver est vide. Ajoutez un article avant de régler.");
        window.location.href = "checkout.html";
    });

    // Apparition au scroll (uniquement les grands blocs)
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
});
