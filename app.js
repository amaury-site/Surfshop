/**
 * AURA SURF STUDIO - Architecture E-Commerce & Pipeline WebAR
 * Traitement modulaire côté client (ES6) conforme aux standards W3C WebXR
 */

// ==========================================================================
// 1. BASE DE DONNÉES CATALOGUE TECHNIQUE
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
        description: "Assemblage en néoprène à cellule fermée déperlant. Coutures cousues-collées galonnées (GBS) sur 100% des jonctions. Plastron frontal thermo-réflecteur pour une conservation calorifique optimale lors des sessions hivernales prolongées."
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
        description: "Glaçage sous vide hybride carbone et fibre biaxiale. Ligne de rocker tendue conférant une relance immédiate en section creuse. Carène en concave simple évoluant vers un double concave prononcé aux dérives."
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
        description: "Profil hydrodynamique rigide développé pour maximiser l'accroche dans les courbes appuyées. Flex en tête d'aileron pour une restitution explosive de l'énergie en sortie de manœuvre."
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
        description: "Traitement déperlant hydrophobe DWR à séchage rapide. Ceinture ergonomique soudée éliminant tout point d'échauffement contre la peau. Zéro couture à l'entrejambe."
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
        description: "Bouclier anti-abrasion haute flexibilité prévenant les irritations dues à la wax. Maille respirante sous les aisselles évacuant l'excédent de chaleur durant l'effort physique."
    },
    {
        id: "prod-leash-comp",
        name: "Leash Haute Précision Comp 6ft",
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
        description: "Émerillons doubles à roulement fluide en acier inoxydable 316L. Manchette de cheville matelassée en néoprène fin avec système d'ouverture d'urgence rapide."
    },
    {
        id: "prod-wax-eco",
        name: "Pack Pain de Wax Organique & Peigne",
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
        description: "Formule biodégradable exempte de dérivés pétrochimiques. Pouvoir d'accroche supérieur sous forme de billes denses. Livré avec un peigne ergonomique en bambou issu de forêts gérées durablement."
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
// 3. GESTION DU STOCKAGE PERSISTANT DU PANIER (LOCALSTORAGE)
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
    showToastNotification(`Ajouté au panier : ${product.name} (${size})`);
}

function updateCartQuantity(index, delta) {
    AppState.cart[index].qty += delta;
    if (AppState.cart[index].qty <= 0) {
        AppState.cart.splice(index, 1);
    }
    saveCartToStorage();
}

// ==========================================================================
// 4. RENDU GRAPHIQUE DES PRODUITS & FILTRES
// ==========================================================================
function renderProducts() {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    // Application du pipeline de filtrage
    let filtered = SURF_CATALOG.filter(item => {
        const matchesCategory = (AppState.filters.category === "all") || (item.category === AppState.filters.category);
        const matchesPrice = item.price <= AppState.filters.maxPrice;
        const matchesSize = (AppState.filters.size === "all") || item.sizes.includes(AppState.filters.size);
        return matchesCategory && matchesPrice && matchesSize;
    });

    // Application du tri
    if (AppState.filters.sort === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (AppState.filters.sort === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--color-slate-500);">
                <p style="font-size: 1.1rem; font-weight: 500;">Aucun équipement ne correspond à vos critères de sélection.</p>
                <button class="pill" style="margin-top: 14px;" onclick="resetFilters()">Réinitialiser les filtres</button>
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
                <span class="badge-ar-support">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                    3D / AR
                </span>
            </div>
            <div class="card-body">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title">${product.name}</h3>
                <p class="card-price">${product.price.toFixed(2)} €</p>
                <div class="card-actions">
                    <button class="btn-secondary" onclick="openProductModal('${product.id}')">Examiner en 3D</button>
                    <button class="btn-quick-add" aria-label="Ajouter directement" onclick="quickAddDefaultSize('${product.id}')">
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
    document.getElementById("price-val").textContent = "950";
    document.getElementById("size-filter").value = "all";
    document.getElementById("sort-select").value = "featured";

    document.querySelectorAll(".pill").forEach(p => {
        p.classList.toggle("active", p.dataset.filterCat === "all");
    });

    renderProducts();
}

// ==========================================================================
// 5. GESTION DE LA MODALE 3D ET RÉALITÉ AUGMENTÉE
// ==========================================================================
function openProductModal(productId) {
    const product = SURF_CATALOG.find(p => p.id === productId);
    if (!product) return;

    AppState.activeModalProduct = product;
    AppState.selectedSize = product.sizes[0];

    // Injection des données textuelles
    document.getElementById("modal-product-category").textContent = product.category;
    document.getElementById("modal-product-title").textContent = product.name;
    document.getElementById("modal-product-price").textContent = `${product.price.toFixed(2)} €`;
    document.getElementById("modal-product-desc").textContent = product.description;

    // Fiche technique
    document.getElementById("modal-spec-material").textContent = product.specs.material;
    document.getElementById("modal-spec-temp").textContent = product.specs.temperature;
    document.getElementById("modal-spec-weight").textContent = product.specs.weight;

    // Rendu des sélecteurs de gabarit
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

    // Chargement dynamique du composant 3D
    const viewer = document.getElementById("main-model-viewer");
    viewer.setAttribute("src", product.modelGlb);
    if (product.modelUsdz) {
        viewer.setAttribute("ios-src", product.modelUsdz);
    } else {
        viewer.removeAttribute("ios-src"); // Déclenchement de la conversion dynamique sur Safari
    }

    // Affichage modale
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
    
    // Libération du contexte graphique WebGL
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
// 6. SYNCHRONISATION DE L'INTERFACE UTILISATEUR DU PANIER
// ==========================================================================
function updateCartUI() {
    const totalCount = AppState.cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById("cart-counter").textContent = totalCount;
    document.getElementById("drawer-cart-count").textContent = totalCount;

    const list = document.getElementById("cart-items-list");
    list.innerHTML = "";

    if (AppState.cart.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; margin: auto; color: var(--color-slate-500);">
                <p>Votre panier est vide.</p>
                <span style="font-size: 0.8rem;">Ajoutez des pièces depuis l'atelier.</span>
            </div>
        `;
    } else {
        AppState.cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item-card";
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-meta">Taille : <strong>${item.size}</strong> • ${(item.price).toFixed(2)} €</p>
                    <div class="cart-qty-ctrl">
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                        <span style="font-size: 0.85rem; font-weight: 600;">${item.qty}</span>
                        <button class="cart-qty-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div style="font-weight: 700; font-size: 0.9rem;">
                    ${(item.price * item.qty).toFixed(2)} €
                </div>
            `;
            list.appendChild(itemElement);
        });
    }

    // Calculs financiers automatisés (HT, TVA 20%, TTC)
    const totalTTC = AppState.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const subtotalHT = totalTTC / 1.20;
    const tax = totalTTC - subtotalHT;

    document.getElementById("cart-subtotal").textContent = `${subtotalHT.toFixed(2)} €`;
    document.getElementById("cart-tax").textContent = `${tax.toFixed(2)} €`;
    document.getElementById("cart-total").textContent = `${totalTTC.toFixed(2)} €`;
}

// ==========================================================================
// 7. SYSTÈME DE TOASTS & INTERACTIONS GLOBALES
// ==========================================================================
function showToastNotification(message) {
    const hub = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    hub.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.25s ease";
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

// Initialisation des écouteurs d'événements au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();

    // Filtres par Catégorie (Boutons Pill)
    document.querySelectorAll(".pill").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
            button.classList.add("active");
            AppState.filters.category = button.dataset.filterCat;
            renderProducts();
        });
    });

    // Navigation de l'en-tête (Synchronisée avec les pills)
    document.querySelectorAll(".nav-link").forEach(navBtn => {
        navBtn.addEventListener("click", () => {
            document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
            navBtn.classList.add("active");
            const cat = navBtn.dataset.category;
            AppState.filters.category = cat;

            // Met à jour la sélection correspondante
            document.querySelectorAll(".pill").forEach(p => {
                p.classList.toggle("active", p.dataset.filterCat === cat);
            });

            renderProducts();
        });
    });

    // Curseur de Prix
    const priceSlider = document.getElementById("price-filter");
    priceSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        AppState.filters.maxPrice = val;
        document.getElementById("price-val").textContent = val;
        renderProducts();
    });

    // Sélecteur de Taille
    document.getElementById("size-filter").addEventListener("change", (e) => {
        AppState.filters.size = e.target.value;
        renderProducts();
    });

    // Sélecteur de Tri
    document.getElementById("sort-select").addEventListener("change", (e) => {
        AppState.filters.sort = e.target.value;
        renderProducts();
    });

    // Interactions de la Modale
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

    // Tiroir Panier (Cart Drawer)
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

    // Déclencheur Checkout de Démonstration
    document.getElementById("checkout-trigger-btn").addEventListener("click", () => {
        if (AppState.cart.length === 0) {
            showToastNotification("Votre sélection est vide.");
            return;
        }
        alert("Redirection vers la passerelle de paiement sécurisée A2A / Apple Pay.");
    });
});
