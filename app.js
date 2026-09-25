/**
 * AURA SURF STUDIO - Logique E-Commerce & WebAR
 * Synchronisation du catalogue, jauge Swell Slider, panier persistent et routage de paiement
 */

// ==========================================================================
// 1. BASE DE DONNÉES CATALOGUE TECHNIQUE SURF
// ==========================================================================
const SURF_CATALOG = [
    {
        id: "prod-wetsuit-43",
        name: "Combinaison Pro Steamer 4/3mm",
        category: "combinaisons",
        price: 389.00,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        modelGlb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
        modelUsdz: "",
        specs: {
            material: "Néoprène Calcaire Yamamoto 4/3mm",
            temperature: "10°C - 15°C (Eaux Froides)",
            weight: "1.150 kg"
        },
        description: "Assemblage en néoprène calcaire à cellules étanches. Coutures cousues-collées galonnées (GBS). Plastron frontal thermo-réflecteur pour une conservation calorifique optimale lors des sessions hivernales."
    },
    {
        id: "prod-board-thruster",
        name: "Shortboard Thruster Carbone 5'11\"",
        category: "planches",
        price: 749.00,
        sizes: ["5'11", "6'2"],
        image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80",
        modelGlb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF-Binary/ToyCar.glb",
        modelUsdz: "",
        specs: {
            material: "Noyau EPS Usiné CNC & Résine Époxy",
            temperature: "Toutes saisons",
            weight: "2.450 kg (Volume 29.5 L)"
        },
        description: "Glaçage sous vide hybride carbone et fibre biaxiale. Ligne de rocker tendue conférant une relance immédiate en section creuse. Carène en concave simple évoluant vers un double concave aux ailerons."
    },
    {
        id: "prod-fins-carbon",
        name: "Ailerons Performance Tri-Fin (FCS II)",
        category: "accessoires",
        price: 119.00,
        sizes: ["M", "L"],
        image: "https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&w=600&q=80",
        modelGlb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
        modelUsdz: "",
        specs: {
            material: "Fibre de Carbone Sergé & Résine RTM",
            temperature: "Universelle",
            weight: "210 g (le set de 3)"
        },
        description: "Profil hydrodynamique rigide développé pour maximiser l'accroche dans les courbes appuyées. Flex contrôlé en tête d'aileron pour une restitution explosive de l'énergie en sortie de bottom-turn."
    },
    {
        id: "prod-boardshort-pro",
        name: "Boardshort Mirage Stretch 19\"",
        category: "combinaisons",
        price: 79.00,
        sizes: ["S", "M", "L", "XL"],
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        modelGlb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF-Binary/ToyCar.glb",
        modelUsdz: "",
        specs: {
            material: "Polyester Recyclé 4-Way Stretch (88%)",
            temperature: "Eaux Chaudes (> 21°C)",
            weight: "140 g"
        },
        description: "Traitement déperlant hydrophobe DWR assurant un séchage ultra-rapide. Ceinture plate soudée éliminant tout point d'échauffement sur la planche. Conception sans couture d'entrejambe."
    },
    {
        id: "prod-top-uv",
        name: "Top UV Thermo-Régulant UPF 50+",
        category: "combinaisons",
        price: 49.00,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80",
        modelGlb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
        modelUsdz: "",
        specs: {
            material: "Lycra Élasthanne Bloqueur UVA/UVB",
            temperature: "18°C - 24°C",
            weight: "180 g"
        },
        description: "Bouclier anti-abrasion haute flexibilité prévenant les frottements dus à la wax. Maille respirante sous les bras facilitant l'évacuation calorifique lors de la rame active."
    },
    {
        id: "prod-leash-comp",
        name: "Leash Compétition Uréthane 6ft",
        category: "accessoires",
        price: 36.00,
        sizes: ["Unique"],
        image: "https://images.unsplash.com/photo-1455729552865-3658a5d39692?auto=format&fit=crop&w=600&q=80",
        modelGlb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF-Binary/ToyCar.glb",
        modelUsdz: "",
        specs: {
            material: "Uréthane Extrudé 6mm & Inox Marine",
            temperature: "Toutes saisons",
            weight: "160 g"
        },
        description: "Émerillons doubles fluides en acier inoxydable de qualité marine 316L. Manchette de cheville rembourrée en néoprène avec tirette de dégagement d'urgence."
    },
    {
        id: "prod-wax-eco",
        name: "Pack Pain de Wax Bio & Peigne",
        category: "accessoires",
        price: 15.00,
        sizes: ["Unique"],
        image: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=600&q=80",
        modelGlb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb",
        modelUsdz: "",
        specs: {
            material: "Cire d'Abeille Bio & Résine de Pin",
            temperature: "Eaux Froides (9°C - 14°C)",
            weight: "85 g x 2"
        },
        description: "Formule biodégradable sans dérivés de pétrole. Création de perles d'accroche régulières sous le pied. Livré avec un peigne ergonomique en bois durable."
    }
];

// ==========================================================================
// 2. ÉTAT GLOBAL DE L'APPLICATION (APPLICATION STATE)
// ==========================================================================
const AppState = {
    filters: {
        category: "all",
        maxPrice: 950,
        size: "all",
        sort: "featured"
    },
    cart: JSON.parse(localStorage.getItem("aura_cart_v1")) || [],
    activeModalProduct: null,
    selectedSize: null
};

// ==========================================================================
// 3. PERSISTANCE DU PANIER (LOCALSTORAGE)
// ==========================================================================
function saveCartToStorage() {
    localStorage.setItem("aura_cart_v1", JSON.stringify(AppState.cart));
    updateCartUI();
}

function addToCart(productId, size) {
    const product = SURF_CATALOG.find(item => item.id === productId);
    if (!product) return;

    const existingIndex = AppState.cart.findIndex(
        entry => entry.id === productId && entry.size === size
    );

    if (existingIndex > -1) {
        AppState.cart[existingIndex].qty += 1;
    } else {
        AppState.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            image: product.image,
            qty: 1
        });
    }

    saveCartToStorage();
    showToastNotification(`Ajouté au Quiver : ${product.name} (${size})`);
}

function updateCartQuantity(index, delta) {
    AppState.cart[index].qty += delta;
    if (AppState.cart[index].qty <= 0) {
        AppState.cart.splice(index, 1);
    }
    saveCartToStorage();
}

// ==========================================================================
// 4. RENDU DYNAMIQUE DU CATALOGUE ET FILTRES SURF
// ==========================================================================
function renderProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    // Application du pipeline de tri et de filtrage
    let filtered = SURF_CATALOG.filter(item => {
        const matchesCat = (AppState.filters.category === "all") || (item.category === AppState.filters.category);
        const matchesPrice = item.price <= AppState.filters.maxPrice;
        const matchesSize = (AppState.filters.size === "all") || item.sizes.includes(AppState.filters.size);
        return matchesCat && matchesPrice && matchesSize;
    });

    if (AppState.filters.sort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (AppState.filters.sort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--color-text-muted);">
                <p style="font-size: 1.1rem; font-weight: 600;">Aucun équipement disponible pour cette configuration de houle.</p>
                <button class="tag-btn" style="margin-top: 14px;" onclick="resetFilters()">Réinitialiser les filtres</button>
            </div>
        `;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML = `
            <div class="card-media">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="ar-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 2px;">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    3D / AR
                </span>
            </div>
            <div class="card-info">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title">${product.name}</h3>
                <p class="card-price">${product.price.toFixed(2)} €</p>
                <div class="card-action-bar">
                    <button class="btn-inspect" onclick="openProductModal('${product.id}')">Inspecter en 3D</button>
                    <button class="btn-quick-cart" aria-label="Ajouter au quiver" onclick="quickAddDefaultSize('${product.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function resetFilters() {
    AppState.filters.category = "all";
    AppState.filters.maxPrice = 950;
    AppState.filters.size = "all";
    AppState.filters.sort = "featured";

    document.getElementById("price-filter").value = 950;
    document.getElementById("price-val").textContent = "950 €";
    document.getElementById("size-filter").value = "all";
    document.getElementById("sort-select").value = "featured";

    document.querySelectorAll(".tag-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filterCat === "all");
    });
    document.querySelectorAll(".nav-link").forEach(lnk => {
        lnk.classList.toggle("active", lnk.dataset.category === "all");
    });

    renderProducts();
}

// ==========================================================================
// 5. GESTION DE LA MODALE 3D / AR
// ==========================================================================
function openProductModal(productId) {
    const product = SURF_CATALOG.find(p => p.id === productId);
    if (!product) return;

    AppState.activeModalProduct = product;
    AppState.selectedSize = product.sizes[0];

    document.getElementById("modal-product-category").textContent = product.category;
    document.getElementById("modal-product-title").textContent = product.name;
    document.getElementById("modal-product-price").textContent = `${product.price.toFixed(2)} €`;
    document.getElementById("modal-product-desc").textContent = product.description;

    document.getElementById("modal-spec-material").textContent = product.specs.material;
    document.getElementById("modal-spec-temp").textContent = product.specs.temperature;
    document.getElementById("modal-spec-weight").textContent = product.specs.weight;

    const sizesContainer = document.getElementById("modal-sizes-container");
    sizesContainer.innerHTML = "";
    product.sizes.forEach(size => {
        const sizeBtn = document.createElement("button");
        sizeBtn.className = `size-btn ${size === AppState.selectedSize ? "selected" : ""}`;
        sizeBtn.textContent = size;
        sizeBtn.addEventListener("click", () => {
            document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
            sizeBtn.classList.add("selected");
            AppState.selectedSize = size;
        });
        sizesContainer.appendChild(sizeBtn);
    });

    const viewer = document.getElementById("main-model-viewer");
    viewer.setAttribute("src", product.modelGlb);
    if (product.modelUsdz) {
        viewer.setAttribute("ios-src", product.modelUsdz);
    } else {
        viewer.removeAttribute("ios-src");
    }

    const modal = document.getElementById("product-modal");
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeProductModal() {
    const modal = document.getElementById("product-modal");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    const viewer = document.getElementById("main-model-viewer");
    viewer.removeAttribute("src");
}

function quickAddDefaultSize(productId) {
    const product = SURF_CATALOG.find(p => p.id === productId);
    if (product) {
        addToCart(product.id, product.sizes[0]);
    }
}

// ==========================================================================
// 6. SYNCHRONISATION DU PANIER & TOTAUX
// ==========================================================================
function updateCartUI() {
    const totalCount = AppState.cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById("cart-counter").textContent = totalCount;
    document.getElementById("drawer-cart-count").textContent = totalCount;

    const list = document.getElementById("cart-items-list");
    list.innerHTML = "";

    if (AppState.cart.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; margin: auto; color: var(--color-text-muted);">
                <p style="font-weight: 600;">Votre quiver est vide.</p>
                <span style="font-size: 0.82rem;">Sélectionnez vos pièces dans l'atelier.</span>
            </div>
        `;
    } else {
        AppState.cart.forEach((item, index) => {
            const row = document.createElement("div");
            row.className = "cart-item-card";
            row.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--color-ocean-deep);">${item.name}</h4>
                    <p style="font-size: 0.78rem; color: var(--color-text-muted);">Taille : <strong>${item.size}</strong> • ${item.price.toFixed(2)} €</p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                        <button style="width: 22px; height: 22px; border: 1px solid var(--color-border); background: #FFF; border-radius: 4px; cursor: pointer; font-weight: 700;" onclick="updateCartQuantity(${index}, -1)">-</button>
                        <span style="font-size: 0.85rem; font-weight: 700;">${item.qty}</span>
                        <button style="width: 22px; height: 22px; border: 1px solid var(--color-border); background: #FFF; border-radius: 4px; cursor: pointer; font-weight: 700;" onclick="updateCartQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight: 800; font-size: 0.92rem; color: var(--color-ocean-deep);">
                    ${(item.price * item.qty).toFixed(2)} €
                </div>
            `;
            list.appendChild(row);
        });
    }

    const totalTTC = AppState.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const subtotalHT = totalTTC / 1.20;
    const tax = totalTTC - subtotalHT;

    document.getElementById("cart-subtotal").textContent = `${subtotalHT.toFixed(2)} €`;
    document.getElementById("cart-tax").textContent = `${tax.toFixed(2)} €`;
    document.getElementById("cart-total").textContent = `${totalTTC.toFixed(2)} €`;
}

// ==========================================================================
// 7. SYSTÈME DE TOASTS ET ÉCOUTEURS D'ÉVÉNEMENTS
// ==========================================================================
function showToastNotification(message) {
    const hub = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.style.background = "var(--color-ocean-deep)";
    toast.style.color = "#FFF";
    toast.style.fontSize = "0.85rem";
    toast.style.fontWeight = "600";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "var(--radius-sm)";
    toast.style.boxShadow = "var(--shadow-surf)";
    toast.textContent = message;
    hub.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.25s ease";
        setTimeout(() => toast.remove(), 250);
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();

    // Filtres Catégories (Boutons Tags)
    document.querySelectorAll(".tag-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tag-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            AppState.filters.category = btn.dataset.filterCat;
            renderProducts();
        });
    });

    // Navigation de l'en-tête (Desktop Nav)
    document.querySelectorAll(".nav-link[data-category]").forEach(lnk => {
        lnk.addEventListener("click", () => {
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            lnk.classList.add("active");
            const cat = lnk.dataset.category;
            AppState.filters.category = cat;

            document.querySelectorAll(".tag-btn").forEach(tb => {
                tb.classList.toggle("active", tb.dataset.filterCat === cat);
            });

            renderProducts();
        });
    });

    // Curseur Swell Slider (Filtre Prix)
    const priceSlider = document.getElementById("price-filter");
    priceSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        AppState.filters.maxPrice = val;
        document.getElementById("price-val").textContent = `${val} €`;
        renderProducts();
    });

    // Sélecteur de gabarit
    document.getElementById("size-filter").addEventListener("change", (e) => {
        AppState.filters.size = e.target.value;
        renderProducts();
    });

    // Sélecteur de tri
    document.getElementById("sort-select").addEventListener("change", (e) => {
        AppState.filters.sort = e.target.value;
        renderProducts();
    });

    // Modale 3D
    document.getElementById("modal-close-btn").addEventListener("click", closeProductModal);
    document.getElementById("product-modal").addEventListener("click", (e) => {
        if (e.target.id === "product-modal") closeProductModal();
    });

    document.getElementById("modal-add-cart-btn").addEventListener("click", () => {
        if (AppState.activeModalProduct && AppState.selectedSize) {
            addToCart(AppState.activeModalProduct.id, AppState.selectedSize);
            closeProductModal();
            toggleCartDrawer(true);
        }
    });

    // Tiroir Latéral du Panier
    const cartToggle = document.getElementById("cart-toggle-btn");
    const cartClose = document.getElementById("cart-close-btn");
    const backdrop = document.getElementById("cart-backdrop");

    function toggleCartDrawer(open) {
        document.getElementById("cart-drawer").classList.toggle("active", open);
        backdrop.classList.toggle("active", open);
    }

    cartToggle.addEventListener("click", () => toggleCartDrawer(true));
    cartClose.addEventListener("click", () => toggleCartDrawer(false));
    backdrop.addEventListener("click", () => toggleCartDrawer(false));

    // Déclencheur vers la page de paiement sécurisé checkout.html
    document.getElementById("checkout-trigger-btn").addEventListener("click", () => {
        if (AppState.cart.length === 0) {
            showToastNotification("Votre quiver est vide. Ajoutez un article avant de payer.");
            return;
        }
        window.location.href = "checkout.html";
    });
});
