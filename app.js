/**
 * AURA SURF — Accueil : catalogue, filtres, fiche produit 3D/AR, panier,
 * showroom piloté par le défilement et sélecteur d'épaisseur.
 * Aucune dépendance : seul <model-viewer> est chargé pour la 3D.
 */
"use strict";

// 1. CATALOGUE ---------------------------------------------------------------
// Modèles 3D (.glb) : un fichier par produit dans assets/models/, du même nom que l'identifiant du modèle.
// Pour utiliser un scan ou un modèle à vous, remplacez simplement le fichier (même nom).
const MODEL = name => `assets/models/${name}.glb`;
// Photos produits : remplacez un fichier de assets/images/ par votre photo (même nom) pour la mettre à jour
const IMG = file => `assets/images/${file}`;
const WS = ["XS", "S", "M", "L", "XL"];

const CATEGORY_LABEL = { combinaisons: "Combinaisons", planches: "Planches", accessoires: "Top UV et accessoires" };

const SURF_CATALOG = [
    // GAMME 1 — Combinaisons
    { id: "combi-32", name: "Combinaison Steamer 3/2mm", category: "combinaisons", price: 299, tagline: "Eaux tempérées, 14–18°C",
      sizes: WS, stock: { XS: 3, S: 6, M: 5, L: 4, XL: 2 }, fit: "Seconde peau", image: IMG("combinaison-32.jpg"), modelGlb: MODEL("combi-32"),
      specs: { material: "Néoprène calcaire 3/2mm, coutures GBS", temperature: "14°C – 18°C", weight: "1,020 kg", care: "Rincer à l'eau douce, sécher à l'ombre" },
      description: "La polyvalente du printemps et de l'automne. Coutures cousues-collées galonnées et doublure thermique légère." },
    { id: "combi-43", name: "Combinaison Steamer 4/3mm", category: "combinaisons", price: 389, tagline: "Eaux froides, 10–15°C",
      sizes: WS, stock: { XS: 3, S: 5, M: 0, L: 4, XL: 2 }, fit: "Compression seconde peau", image: IMG("combinaison-43.jpg"), modelGlb: MODEL("combi-43"),
      specs: { material: "Néoprène calcaire 4/3mm, plastron thermo-réflecteur", temperature: "10°C – 15°C", weight: "1,150 kg", care: "Rincer à l'eau douce, cintre large à l'ombre" },
      description: "Conçue pour l'hiver atlantique. Plastron thermo-réflecteur et zip dorsal étanche pour garder la chaleur session après session." },
    { id: "combi-54", name: "Combinaison Hooded 5/4mm", category: "combinaisons", price: 459, tagline: "Eaux très froides, moins de 10°C",
      sizes: WS, stock: { XS: 1, S: 3, M: 4, L: 3, XL: 1 }, fit: "Ajustée avec cagoule intégrée", image: IMG("combinaison-54.jpg"), modelGlb: MODEL("combi-54"),
      specs: { material: "Néoprène calcaire 5/4mm et cagoule, coutures GBS", temperature: "6°C – 10°C", weight: "1,480 kg", care: "Rincer à l'eau douce, ne pas plier" },
      description: "Notre protection maximale pour les sessions de janvier. Cagoule intégrée et doublure en fibres thermiques à séchage rapide." },
    { id: "shorty-22", name: "Shorty 2/2mm", category: "combinaisons", price: 179, tagline: "Eaux douces, 18–22°C",
      sizes: WS, stock: { XS: 4, S: 6, M: 6, L: 3, XL: 2 }, fit: "Souple, manches et jambes courtes", image: IMG("shorty-22.jpg"), modelGlb: MODEL("shorty-22"),
      specs: { material: "Néoprène calcaire 2/2mm", temperature: "18°C – 22°C", weight: "620 g", care: "Rincer à l'eau douce" },
      description: "La liberté de mouvement pour les sessions d'été et d'entre-saison, avec une protection légère contre le vent." },
    // GAMME 2 — Planches
    { id: "board-long-9", name: "Longboard 9'0\" Classic Glide", category: "planches", price: 679, tagline: "Glisse et fluidité, 68 L",
      sizes: ["9'0"], stock: { "9'0": 3 }, fit: "Débutant à confirmé, petites vagues", image: IMG("longboard-9.jpg"), modelGlb: MODEL("board-long-9"),
      specs: { material: "Noyau PU/PE, glaçage époxy, 3 lattes de bois", temperature: "Toutes saisons", weight: "5,9 kg pour 68 L", care: "Housse réfléchissante, éviter le plein soleil" },
      description: "Rocker doux et nose généreux pour la glisse et le style. La planche idéale pour apprendre ou surfer les petites vagues." },
    { id: "board-mid-7", name: "Midlength 7'0\" Allround", category: "planches", price: 619, tagline: "Polyvalence, 44 L",
      sizes: ["7'0"], stock: { "7'0": 4 }, fit: "Intermédiaire, vagues moyennes", image: IMG("midlength-7.jpg"), modelGlb: MODEL("board-mid-7"),
      specs: { material: "Noyau EPS, glaçage époxy, quad ou thruster", temperature: "Toutes saisons", weight: "3,4 kg pour 44 L", care: "Housse réfléchissante, éviter le plein soleil" },
      description: "Le compromis entre la flottabilité du longboard et la réactivité du shortboard. Rame facile, bon appui en courbe." },
    { id: "board-short-511", name: "Shortboard 5'11\" Carbone", category: "planches", price: 749, tagline: "Performance, 29,5 L",
      sizes: ["5'11"], stock: { "5'11": 2 }, fit: "Confirmé, vagues creuses", image: IMG("shortboard-511.jpg"), modelGlb: MODEL("board-short-511"),
      specs: { material: "Noyau EPS usiné CNC, carbone et résine époxy", temperature: "Toutes saisons", weight: "2,45 kg pour 29,5 L", care: "Housse réfléchissante, éviter le plein soleil" },
      description: "Rocker tendu, carène en double concave et renforts carbone pour une relance immédiate dans la section creuse." },
    // GAMME 3 — Top UV, boardshorts & accessoires
    { id: "top-uv", name: "Top UV Thermo-Régulant UPF 50+", category: "accessoires", price: 49, tagline: "Protection solaire, 18–24°C",
      sizes: WS, stock: { XS: 4, S: 6, M: 7, L: 0, XL: 3 }, fit: "Ajusté athlétique", image: IMG("top-uv.jpg"), modelGlb: MODEL("top-uv"),
      specs: { material: "Lycra élasthanne anti-UVA et UVB", temperature: "18°C – 24°C", weight: "180 g", care: "Rincer après contact avec l'eau salée" },
      description: "Anti-abrasion et anti-rougeurs, avec des panneaux latéraux respirants pour les longues phases de rame." },
    { id: "boardshort", name: "Boardshort Mirage Stretch 19\"", category: "accessoires", price: 79, tagline: "Eaux chaudes, plus de 21°C",
      sizes: ["S", "M", "L", "XL"], stock: { S: 3, M: 8, L: 5, XL: 2 }, fit: "Coupe droite anti-irritation", image: IMG("boardshort.jpg"), modelGlb: MODEL("boardshort"),
      specs: { material: "Polyester recyclé stretch 4 sens (88 %)", temperature: "Plus de 21°C", weight: "140 g", care: "Machine à 30°C sans assouplissant" },
      description: "Traitement déperlant à séchage rapide, ceinture plate sans couture pour éviter les frottements sur la wax." },
    { id: "leash", name: "Leash Compétition Uréthane 6ft", category: "accessoires", price: 36, tagline: "Vagues de 0,5 à 2 m",
      sizes: ["Unique"], stock: { Unique: 12 }, fit: "Taille unique", image: IMG("leash.jpg"), modelGlb: MODEL("leash"),
      specs: { material: "Uréthane 6mm, émerillons inox 316L", temperature: "Toutes saisons", weight: "160 g", care: "Stocker déroulé" },
      description: "Émerillons doubles fluides et manchette de cheville en néoprène avec boucle d'ouverture rapide." },
    { id: "wax", name: "Pack Wax Bio et Peigne", category: "accessoires", price: 15, tagline: "Eaux froides, 9–14°C",
      sizes: ["Unique"], stock: { Unique: 25 }, fit: "Universel", image: IMG("wax.svg"), modelGlb: MODEL("wax"),
      specs: { material: "Cire d'abeille bio et résine de pin", temperature: "9°C – 14°C", weight: "2 pains de 85 g", care: "Conserver à l'abri de la chaleur" },
      description: "Formule biodégradable sans dérivés pétrochimiques, livrée avec un peigne en bambou." }
];

// 2. OUTILS -------------------------------------------------------------------
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const byId = id => SURF_CATALOG.find(p => p.id === id);
const fmt = n => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const fmtShort = n => n.toLocaleString("fr-FR") + " €";
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const totalStock = p => Object.values(p.stock).reduce((a, b) => a + b, 0);
const firstSize = p => p.sizes.find(s => p.stock[s] > 0) || null;
const sizeLabel = s => s === "Unique" ? "Taille unique" : s;

/** Applique un changement de DOM avec une transition de vue quand le navigateur le permet. */
function withTransition(update) {
    if (document.startViewTransition && !reducedMotion.matches) document.startViewTransition(update);
    else update();
}

/** Garde le focus clavier à l'intérieur d'un panneau ouvert. */
function trapFocus(container, event) {
    if (event.key !== "Tab") return;
    const items = [...container.querySelectorAll('button:not([disabled]), a[href], input, select, [tabindex]:not([tabindex="-1"])')]
        .filter(el => el.offsetParent !== null || el.getClientRects().length);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
    else if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
}

let scrollLocks = 0;
function lockScroll(on) {
    scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
    document.documentElement.style.overflow = scrollLocks ? "hidden" : "";
}

// 3. ÉTAT ET PANIER ----------------------------------------------------------
const CART_KEY = "aura_cart_v1"; // même clé que checkout.html
function loadCart() {
    try {
        const raw = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(raw) ? raw.filter(i => i && byId(i.id) && i.size && i.qty > 0 && i.price >= 0) : [];
    } catch (e) { return []; }
}
const AppState = {
    filters: { category: "all", maxPrice: 900, size: "all", sort: "featured" },
    cart: loadCart(),
    sheetProduct: null,
    selectedSize: null,
    lastFocus: null
};

function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(AppState.cart)); } catch (e) { /* stockage indisponible : le panier reste en mémoire */ }
    updateCartUI();
}

function addToCart(productId, size) {
    const p = byId(productId);
    if (!p) return false;
    const available = p.stock[size] || 0;
    if (!available) { toast(`La taille ${sizeLabel(size)} est épuisée.`); return false; }
    const line = AppState.cart.find(e => e.id === productId && e.size === size);
    if (line) {
        if (line.qty >= available) { toast(`Il ne reste que ${available} article${available > 1 ? "s" : ""} en ${sizeLabel(size)}.`); return false; }
        line.qty++;
    } else {
        AppState.cart.push({ id: p.id, name: p.name, price: p.price, size, image: p.image, qty: 1 });
    }
    saveCart();
    const badge = $("#cart-counter");
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    toast(`${p.name} ajouté au panier.`);
    return true;
}
function updateCartQuantity(index, delta) {
    const line = AppState.cart[index];
    if (!line) return;
    const max = byId(line.id)?.stock[line.size] ?? Infinity;
    if (delta > 0 && line.qty >= max) return toast(`Il ne reste que ${max} article${max > 1 ? "s" : ""} en stock.`);
    line.qty += delta;
    if (line.qty <= 0) AppState.cart.splice(index, 1);
    saveCart();
}
function removeCartItem(index) { AppState.cart.splice(index, 1); saveCart(); }
function quickAddDefaultSize(productId, button) {
    const p = byId(productId);
    const size = p && firstSize(p);
    if (!size) return toast("Ce produit est épuisé.");
    if (addToCart(p.id, size) && button) {
        button.classList.add("is-done");
        setTimeout(() => button.classList.remove("is-done"), 1200);
    }
}

function updateCartUI() {
    const count = AppState.cart.reduce((a, i) => a + i.qty, 0);
    const badge = $("#cart-counter");
    badge.textContent = count;
    badge.dataset.count = String(count);
    $("#cart-toggle-btn").setAttribute("aria-label", count ? `Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}` : "Ouvrir le panier");
    $("#drawer-cart-count").textContent = count;

    $("#cart-items-list").innerHTML = AppState.cart.length ? AppState.cart.map((it, i) => `
        <div class="cart-item">
            <img src="${it.image}" alt="" loading="lazy">
            <div>
                <h3>${it.name}</h3>
                <p class="cart-item-meta">${sizeLabel(it.size)}, ${fmt(it.price)}</p>
                <div class="qty" role="group" aria-label="Quantité">
                    <button type="button" aria-label="Retirer un article" onclick="updateCartQuantity(${i},-1)">−</button>
                    <span>${it.qty}</span>
                    <button type="button" aria-label="Ajouter un article" onclick="updateCartQuantity(${i},1)">+</button>
                </div>
            </div>
            <div class="cart-item-side">
                <span class="cart-item-total">${fmt(it.price * it.qty)}</span>
                <button type="button" class="remove-btn" onclick="removeCartItem(${i})">Retirer</button>
            </div>
        </div>`).join("") : `
        <div class="cart-empty">
            <p>Votre panier est vide.</p>
            <span>Ajoutez une combinaison, une planche ou un accessoire.</span>
        </div>`;

    const ttc = AppState.cart.reduce((a, i) => a + i.price * i.qty, 0);
    const ht = ttc / 1.2;
    $("#cart-subtotal").textContent = fmt(ht);
    $("#cart-tax").textContent = fmt(ttc - ht);
    $("#cart-total").textContent = fmt(ttc);
    const threshold = 100;
    $("#shipping-progress-fill").style.setProperty("--fill", String(Math.min(ttc / threshold, 1)));
    $("#shipping-progress-text").textContent = ttc >= threshold ? "La livraison est offerte." : `Plus que ${fmt(threshold - ttc)} pour la livraison offerte.`;
    $("#checkout-trigger-btn").disabled = !AppState.cart.length;
}

function toggleCartDrawer(open) {
    const drawer = $("#cart-drawer");
    if (drawer.classList.contains("active") === open) return;
    if (open) AppState.lastFocus = document.activeElement;
    drawer.classList.toggle("active", open);
    drawer.setAttribute("aria-hidden", String(!open));
    $("#cart-backdrop").classList.toggle("active", open);
    $("#cart-toggle-btn").setAttribute("aria-expanded", String(open));
    lockScroll(open);
    if (open) setTimeout(() => $("#cart-close-btn").focus(), 60);
    else AppState.lastFocus?.focus?.({ preventScroll: true });
}

// 4. CATALOGUE ET FILTRES ------------------------------------------------------
function buildSizeFilter() {
    const sel = $("#size-filter");
    [...new Set(SURF_CATALOG.flatMap(p => p.sizes))].forEach(s => sel.insertAdjacentHTML("beforeend", `<option value="${s}">${sizeLabel(s)}</option>`));
}

function productCard(p) {
    const total = totalStock(p);
    const flag = total === 0 ? '<span class="product-flag">Épuisé</span>'
        : total <= 4 ? `<span class="product-flag is-low">Plus que ${total}</span>` : "";
    return `<article class="product" style="view-transition-name:p-${p.id}">
        <button type="button" class="product-media" data-open-product="${p.id}" aria-label="Voir ${p.name} en 3D">
            <img src="${p.image}" alt="" loading="lazy" width="900" height="900">
            ${flag}
            <span class="product-3d" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/></svg>
                Voir en 3D
            </span>
        </button>
        <div class="product-body">
            <h3 class="product-name">${p.name}</h3>
            <p class="product-tagline">${p.tagline}</p>
            <p class="product-price">${fmtShort(p.price)}</p>
            <button type="button" class="product-add" data-quick-add="${p.id}" aria-label="Ajouter ${p.name} au panier" ${total ? "" : "disabled"}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            </button>
        </div>
    </article>`;
}

function renderProducts() {
    const f = AppState.filters;
    const list = SURF_CATALOG.filter(p =>
        (f.category === "all" || p.category === f.category) &&
        p.price <= f.maxPrice && (f.size === "all" || p.sizes.includes(f.size)));
    if (f.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (f.sort === "price-desc") list.sort((a, b) => b.price - a.price);

    $("#catalogue-count").textContent = `${list.length} produit${list.length > 1 ? "s" : ""}`;
    $("#products-grid").innerHTML = list.length ? list.map(productCard).join("") : `
        <div class="empty-state">
            <p>Aucun produit ne correspond à ces filtres.</p>
            <button type="button" class="btn btn-quiet" onclick="resetFilters()">Afficher toute la collection</button>
        </div>`;
}

function setCategory(cat, { scroll = false } = {}) {
    AppState.filters.category = cat;
    $$(".seg[data-filter-cat]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.filterCat === cat)));
    $$(".nav-link[data-category]").forEach(l => l.classList.toggle("active", l.dataset.category === cat));
    withTransition(renderProducts);
    if (scroll) $("#catalogue").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
}

function setPriceFill(input) {
    const pct = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty("--fill", pct + "%");
}

function resetFilters() {
    Object.assign(AppState.filters, { category: "all", maxPrice: 900, size: "all", sort: "featured" });
    const price = $("#price-filter");
    price.value = 900; setPriceFill(price);
    $("#price-val").textContent = "900 €";
    $("#size-filter").value = "all";
    $("#sort-select").value = "featured";
    setCategory("all");
}

// 5. FICHE PRODUIT -------------------------------------------------------------
let sheetHideTimer = null;
function setStageView(view) {
    const photo = $("#sheet-photo");
    const viewer = $("#sheet-viewer");
    $$(".stage-tab").forEach(t => t.setAttribute("aria-pressed", String(t.dataset.view === view)));
    photo.hidden = view !== "photo";
    viewer.style.visibility = view === "photo" ? "hidden" : "";
    $("#stage-hint").hidden = view === "photo";
}

function selectSize(size) {
    AppState.selectedSize = size;
    $$("#sheet-sizes .size-btn").forEach(b => b.setAttribute("aria-checked", String(b.dataset.size === size)));
    const add = $("#sheet-add");
    add.disabled = !size;
    add.textContent = size ? "Ajouter au panier" : "Épuisé";
}

function openProductModal(productId) {
    const p = byId(productId);
    if (!p) return;
    AppState.sheetProduct = p;
    AppState.lastFocus = document.activeElement;

    $("#sheet-cat").textContent = CATEGORY_LABEL[p.category];
    $("#sheet-title").textContent = p.name;
    $("#sheet-tagline").textContent = p.tagline;
    $("#sheet-price").textContent = fmtShort(p.price);
    $("#sheet-desc").textContent = p.description;

    const sizes = $("#sheet-sizes");
    sizes.innerHTML = p.sizes.map(s => {
        const ok = p.stock[s] > 0;
        return `<button type="button" class="size-btn" role="radio" data-size="${s}" aria-checked="false" ${ok ? "" : 'disabled aria-disabled="true"'} title="${ok ? "" : "Épuisé"}">${sizeLabel(s)}</button>`;
    }).join("");
    $("#size-label").textContent = p.sizes.length === 1 ? "Format" : "Taille";
    selectSize(firstSize(p));

    const rows = [["Coupe", p.fit], ["Matière", p.specs.material], ["Température d'eau", p.specs.temperature], ["Poids", p.specs.weight], ["Entretien", p.specs.care]];
    $("#sheet-specs").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

    const photo = $("#sheet-photo");
    photo.src = p.image;
    photo.alt = p.name;
    const viewer = $("#sheet-viewer");
    viewer.setAttribute("src", p.modelGlb);
    viewer.setAttribute("alt", `${p.name} en 3D`);
    viewer.setAttribute("camera-orbit", p.category === "planches" ? "-30deg 65deg auto" : "20deg 80deg auto");
    p.modelUsdz ? viewer.setAttribute("ios-src", p.modelUsdz) : viewer.removeAttribute("ios-src");
    setStageView("3d");

    viewer.setAttribute("auto-rotate", "");
    const sheet = $("#product-sheet");
    clearTimeout(sheetHideTimer);
    sheet.hidden = false;
    void sheet.offsetWidth; // déclenche la transition d'entrée
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    lockScroll(true);
    $(".sheet-info").scrollTop = 0;
    setTimeout(() => $("#sheet-close").focus({ preventScroll: true }), 80);
}

function closeProductModal() {
    const sheet = $("#product-sheet");
    if (!sheet.classList.contains("is-open")) return;
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    // Une fois la fermeture animée, on retire la fiche du rendu : la 3D cesse de calculer des images.
    sheetHideTimer = setTimeout(() => {
        if (sheet.classList.contains("is-open")) return;
        sheet.hidden = true;
        $("#sheet-viewer").removeAttribute("auto-rotate");
    }, 520);
    lockScroll(false);
    AppState.lastFocus?.focus?.({ preventScroll: true });
}

// 6. SHOWROOM PILOTÉ PAR LE DÉFILEMENT ----------------------------------------
function initShowroom() {
    const section = $("#showroom");
    const viewer = $("#showroom-viewer");
    if (!section || !viewer) return;
    const steps = $$("#showroom .step");
    const bar = $("#showroom-bar");
    let visible = false, ticking = false;

    const update = () => {
        ticking = false;
        const rect = section.getBoundingClientRect();
        const run = Math.max(1, rect.height - window.innerHeight);
        const p = clamp(-rect.top / run, 0, 1);
        // Une rotation d'un tour et quart, la caméra passe du profil au dessous de la planche.
        const theta = -40 + p * 400;
        const phi = 72 - Math.sin(p * Math.PI) * 30;
        // Sur un écran en hauteur, on recule la caméra pour garder toute la planche dans le cadre.
        const base = window.innerWidth / window.innerHeight < 1 ? 150 : 80;
        const radius = base - Math.sin(p * Math.PI) * base * .17;
        viewer.cameraOrbit = `${theta.toFixed(2)}deg ${phi.toFixed(2)}deg ${radius.toFixed(1)}%`;
        bar.style.setProperty("--p", p.toFixed(4));
        const active = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999 + 0.0001));
        steps.forEach((s, i) => {
            s.classList.toggle("is-active", i === active);
            s.classList.toggle("is-past", i < active);
        });
    };
    const onScroll = () => { if (visible && !ticking) { ticking = true; requestAnimationFrame(update); } };

    if (reducedMotion.matches) {
        steps.forEach(s => s.classList.add("is-active"));
        viewer.setAttribute("camera-controls", "");
        return;
    }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) update(); }, { rootMargin: "20% 0px" }).observe(section);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
}

// 7. SÉLECTEUR D'ÉPAISSEUR -------------------------------------------------------
const THERMO_BANDS = [
    { max: 9, id: "combi-54", band: "Pour moins de 10°C" },
    { max: 13, id: "combi-43", band: "Pour 10 à 14°C" },
    { max: 17, id: "combi-32", band: "Pour 14 à 18°C" },
    { max: 21, id: "shorty-22", band: "Pour 18 à 22°C" },
    { max: 99, id: "top-uv", band: "Pour plus de 22°C, avec un boardshort" }
];
const THERMO_PLACES = [
    [7, "Bretagne nord en février."], [9, "Manche et Bretagne en hiver."], [11, "Côte basque en février."],
    [13, "Landes et côte basque en avril."], [15, "Bretagne sud en juin."], [17, "Côte basque en juin."],
    [19, "Landes en juillet."], [21, "Côte basque fin août."], [23, "Portugal sud et Canaries en été."], [99, "Méditerranée et eaux tropicales."]
];
const THERMO_STOPS = [[6, [47, 111, 179]], [12, [74, 163, 184]], [17, [156, 191, 138]], [21, [227, 176, 88]], [26, [233, 124, 69]]];
function tempColor(t) {
    for (let i = 1; i < THERMO_STOPS.length; i++) {
        const [t1, c1] = THERMO_STOPS[i];
        const [t0, c0] = THERMO_STOPS[i - 1];
        if (t <= t1) {
            const k = (t - t0) / (t1 - t0);
            return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * k)).join(",")})`;
        }
    }
    return "rgb(233,124,69)";
}

function initThermo() {
    const range = $("#thermo-range");
    if (!range) return;
    const section = $("#epaisseur");
    const pick = $("#thermo-pick");
    let current = null, swapTimer = null;

    const fill = id => {
        const p = byId(id);
        const band = THERMO_BANDS.find(b => b.id === id);
        $("#pick-img").src = p.image;
        $("#pick-img").alt = p.name;
        $("#pick-band").textContent = band.band;
        $("#pick-name").textContent = p.name;
        $("#pick-desc").textContent = p.description;
        $("#pick-price").textContent = fmtShort(p.price);
        $("#pick-add").disabled = !firstSize(p);
    };

    const update = () => {
        const t = Number(range.value);
        $("#thermo-num").textContent = t;
        range.setAttribute("aria-valuetext", `${t} degrés`);
        section.style.setProperty("--temp", tempColor(t));
        $("#thermo-place").textContent = (THERMO_PLACES.find(([max]) => t <= max) || [, ""])[1];
        const id = THERMO_BANDS.find(b => t <= b.max).id;
        $$(".thermo-scale li").forEach(li => li.classList.toggle("is-active", li.dataset.band === id));
        if (id === current) return;
        const first = current === null;
        current = id;
        if (first || reducedMotion.matches) return fill(id);
        clearTimeout(swapTimer);
        pick.classList.add("is-swapping");
        swapTimer = setTimeout(() => { fill(id); requestAnimationFrame(() => pick.classList.remove("is-swapping")); }, 220);
    };
    range.addEventListener("input", update);
    $("#pick-open").addEventListener("click", () => openProductModal(current));
    $("#pick-add").addEventListener("click", () => quickAddDefaultSize(current));
    update();
}

// 8. EN-TÊTE, OUVERTURE, MENU --------------------------------------------------
function initHeaderAndHero() {
    const header = $("#site-header");
    const hero = $("#hero");
    const heroImg = $(".hero-media img");
    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            const y = window.scrollY;
            header.classList.toggle("is-solid", y > 24);
            if (!reducedMotion.matches && hero && y < hero.offsetHeight) {
                const k = y / hero.offsetHeight;
                heroImg.style.setProperty("--hero-shift", `${(k * 90).toFixed(1)}px`);
                heroImg.style.setProperty("--hero-scale", (1.08 - k * .05).toFixed(4));
            }
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Séquence d'ouverture : on attend l'image pour éviter un fondu sur un écran vide.
    const ready = () => document.body.classList.add("is-ready");
    if (heroImg.complete) requestAnimationFrame(ready);
    else { heroImg.addEventListener("load", ready, { once: true }); heroImg.addEventListener("error", ready, { once: true }); setTimeout(ready, 1800); }

    const burger = $("#mobile-menu-btn");
    const menu = $("#mobile-menu");
    const setMenu = open => {
        menu.classList.toggle("open", open);
        menu.setAttribute("aria-hidden", String(!open));
        burger.setAttribute("aria-expanded", String(open));
        burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
        header.classList.toggle("menu-open", open);
        lockScroll(open);
    };
    burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.addEventListener("click", e => {
        const link = e.target.closest(".mobile-link");
        if (!link) return;
        setMenu(false);
        if (link.dataset.category) setCategory(link.dataset.category, { scroll: true });
    });
    return setMenu;
}

// 9. NOTIFICATIONS -----------------------------------------------------------
function toast(message) {
    const hub = $("#toast-container");
    while (hub.children.length > 2) hub.firstChild.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    hub.appendChild(el);
    setTimeout(() => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 260); }, 2600);
}
const showToastNotification = toast; // compatibilité

// 10. INITIALISATION ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    buildSizeFilter();
    renderProducts();
    updateCartUI();
    const setMenu = initHeaderAndHero();
    initShowroom();
    initThermo();

    // Délégation : ouvrir une fiche, ajout rapide
    document.addEventListener("click", e => {
        const open = e.target.closest("[data-open-product]");
        if (open) return openProductModal(open.dataset.openProduct);
        const quick = e.target.closest("[data-quick-add]");
        if (quick) return quickAddDefaultSize(quick.dataset.quickAdd, quick);
        const footerCat = e.target.closest("[data-category-link]");
        if (footerCat) { e.preventDefault(); setCategory(footerCat.dataset.categoryLink, { scroll: true }); }
    });

    $$(".seg[data-filter-cat]").forEach(b => b.addEventListener("click", () => setCategory(b.dataset.filterCat)));
    $$(".nav-link[data-category], .family[data-category]").forEach(el =>
        el.addEventListener("click", () => setCategory(el.dataset.category, { scroll: true })));

    const price = $("#price-filter");
    setPriceFill(price);
    price.addEventListener("input", e => {
        AppState.filters.maxPrice = Number(e.target.value);
        $("#price-val").textContent = `${e.target.value} €`;
        setPriceFill(e.target);
        renderProducts();
    });
    $("#size-filter").addEventListener("change", e => { AppState.filters.size = e.target.value; withTransition(renderProducts); });
    $("#sort-select").addEventListener("change", e => { AppState.filters.sort = e.target.value; withTransition(renderProducts); });

    // Fiche produit
    const sheet = $("#product-sheet");
    $("#sheet-close").addEventListener("click", closeProductModal);
    sheet.addEventListener("click", e => { if (e.target.hasAttribute("data-close-sheet")) closeProductModal(); });
    sheet.addEventListener("keydown", e => trapFocus($(".sheet-panel"), e));
    $$(".stage-tab").forEach(t => t.addEventListener("click", () => setStageView(t.dataset.view)));
    $("#sheet-sizes").addEventListener("click", e => {
        const b = e.target.closest(".size-btn");
        if (b && !b.disabled) selectSize(b.dataset.size);
    });
    $("#sheet-sizes").addEventListener("keydown", e => {
        if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
        const btns = $$("#sheet-sizes .size-btn:not(:disabled)");
        const i = btns.findIndex(b => b.dataset.size === AppState.selectedSize);
        const next = btns[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length];
        if (next) { selectSize(next.dataset.size); next.focus(); e.preventDefault(); }
    });
    $("#sheet-add").addEventListener("click", () => {
        const p = AppState.sheetProduct;
        if (p && AppState.selectedSize && addToCart(p.id, AppState.selectedSize)) {
            closeProductModal();
            setTimeout(() => toggleCartDrawer(true), 260);
        }
    });

    // Panier
    $("#cart-toggle-btn").addEventListener("click", () => toggleCartDrawer(true));
    $("#cart-close-btn").addEventListener("click", () => toggleCartDrawer(false));
    $("#cart-backdrop").addEventListener("click", () => toggleCartDrawer(false));
    $("#cart-drawer").addEventListener("keydown", e => trapFocus($("#cart-drawer"), e));
    $("#checkout-trigger-btn").addEventListener("click", () => {
        if (!AppState.cart.length) return toast("Ajoutez un article avant de passer au paiement.");
        window.location.href = "checkout.html";
    });

    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") return;
        if ($("#product-sheet").classList.contains("is-open")) closeProductModal();
        else if ($("#cart-drawer").classList.contains("active")) toggleCartDrawer(false);
        else if ($("#mobile-menu").classList.contains("open")) setMenu(false);
    });

    // Synchronise le panier si un autre onglet le modifie
    window.addEventListener("storage", e => { if (e.key === CART_KEY) { AppState.cart = loadCart(); updateCartUI(); } });

    // Lien direct vers une fiche : index.html#produit=board-mid-7
    const m = location.hash.match(/^#produit=([\w-]+)/);
    if (m && byId(m[1])) openProductModal(m[1]);
});
