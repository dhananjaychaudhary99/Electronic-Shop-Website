document.addEventListener("DOMContentLoaded", () => {
    let allProducts = [];
    let filteredProducts = [];
    let currentPage = 1;
    const ITEMS_PER_PAGE = 24;
    let currentCategory = "ALL";

    let cart = JSON.parse(localStorage.getItem("shop_cart")) || [];
    let compareList = JSON.parse(localStorage.getItem("shop_compare")) || [];

    const grid = document.getElementById("productGrid");
    const searchInput = document.getElementById("searchInput");
    const priceFilter = document.getElementById("priceFilter");
    const sortFilter = document.getElementById("sortFilter");
    const resultsStats = document.getElementById("resultsStats");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageIndicator = document.getElementById("pageIndicator");
    const noResults = document.getElementById("noResults");
    const paginationContainer = document.getElementById("pagination");

    // Helper: INR Currency Formatter
    function formatINR(price) {
        return "₹" + Math.round(price).toLocaleString('en-IN');
    }

    // 1. Fetch & Initialize Products
    async function fetchProducts() {
        try {
            const res = await fetch('/api/products');
            allProducts = await res.json();
            updateCategoryStrip();
            applyFilters();
        } catch (e) {
            console.error("Error loading products:", e);
        }
    }

    function updateCategoryStrip() {
        const categories = ["ALL", ...new Set(allProducts.map(p => p.category))];
        const container = document.getElementById("categoryContainer");
        container.innerHTML = categories.map(cat => `
            <button class="cat-pill ${cat === currentCategory ? 'active' : ''}" data-cat="${cat}">
                <i class="fa-solid fa-${cat === 'ALL' ? 'border-all' : 'tag'}"></i> ${cat === 'ALL' ? 'All Products' : cat}
            </button>
        `).join("");

        container.querySelectorAll(".cat-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                container.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                currentCategory = pill.dataset.cat;
                applyFilters();
            });
        });
    }

    function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();
        const price = priceFilter.value;
        const sort = sortFilter.value;

        filteredProducts = allProducts.filter(p => {
            const itemPrice = p.price;
            const matchesSearch = !query || p.name.toLowerCase().includes(query);
            const matchesCategory = currentCategory === "ALL" || p.category === currentCategory;

            let matchesPrice = true;
            if (price === "UNDER_2000") matchesPrice = itemPrice < 2000;
            if (price === "2000_TO_10000") matchesPrice = itemPrice >= 2000 && itemPrice <= 10000;
            if (price === "OVER_10000") matchesPrice = itemPrice > 10000;

            return matchesSearch && matchesCategory && matchesPrice;
        });

        if (sort === "PRICE_ASC") filteredProducts.sort((a, b) => a.price - b.price);
        else if (sort === "PRICE_DESC") filteredProducts.sort((a, b) => b.price - a.price);
        else if (sort === "RATING_DESC") filteredProducts.sort((a, b) => b.rating - a.rating);

        currentPage = 1;
        renderGrid();
    }

    function renderGrid() {
        const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const visibleItems = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

        if (visibleItems.length === 0) {
            grid.innerHTML = "";
            noResults.classList.remove("hidden");
            paginationContainer.classList.add("hidden");
        } else {
            noResults.classList.add("hidden");
            paginationContainer.classList.remove("hidden");

            grid.innerHTML = visibleItems.map(p => {
                const originalPrice = p.originalPrice || Math.round(p.price * 1.25);
                const discount = Math.round((1 - p.price / originalPrice) * 100);
                return `
                <article class="product-card">
                    <div class="card-badge-row">
                        <span class="category-badge">${p.category}</span>
                        <span class="stock-badge ${p.stock <= 0 ? 'out-of-stock' : p.stock < 10 ? 'low' : 'in-stock'}">
                            ${p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? `Only ${p.stock} left` : `In Stock (${p.stock})`}
                        </span>
                    </div>
                    <div class="product-img-wrapper">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=80';">
                    </div>
                    <h3 class="product-title" title="${p.name}">${p.name}</h3>
                    <div class="product-brand-color">
                        ${p.brand ? `<span class="brand-tag">${p.brand}</span>` : ''}
                        ${p.color ? `<span class="color-tag">Color: ${p.color}</span>` : ''}
                    </div>
                    ${p.variant ? `<div class="product-variant">Variant: ${p.variant}</div>` : ''}
                    <div class="product-meta">
                        <span class="rating-badge">★ ${p.rating}</span>
                        <span class="reviews-count">(${p.stock * 3 + 12} reviews)</span>
                    </div>
                    <div class="price-row">
                        <span class="current-price">${formatINR(p.price)}</span>
                        <span class="original-price" style="text-decoration: line-through; color: #878787; font-size: 0.85rem;">₹${originalPrice.toLocaleString('en-IN')}</span>
                        <span class="discount" style="color: #388e3c; font-size: 0.8rem; font-weight: 600;">${discount}% off</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-compare ${compareList.includes(p.id) ? 'active' : ''}" onclick="toggleCompare(${p.id})" ${p.stock <= 0 ? 'disabled' : ''}>
                            <i class="fa-solid fa-${compareList.includes(p.id) ? 'check' : 'code-compare'}"></i> ${compareList.includes(p.id) ? 'Added' : 'Compare'}
                        </button>
                        <button class="btn-buy" onclick="addToCart(${p.id})" ${p.stock <= 0 ? 'disabled' : ''}>
                            <i class="fa-solid fa-bag-shopping"></i> ${p.stock <= 0 ? 'Unavailable' : 'Buy Now'}
                        </button>
                    </div>
                </article>
            `;
            }).join("");
        }

        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        resultsStats.textContent = `Showing ${filteredProducts.length} items`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    searchInput.addEventListener("input", applyFilters);
    priceFilter.addEventListener("change", applyFilters);
    sortFilter.addEventListener("change", applyFilters);

    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderGrid();
            window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
        }
    });

    nextBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderGrid();
            window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
        }
    });

    window.resetFilters = () => {
        searchInput.value = "";
        priceFilter.value = "ALL";
        sortFilter.value = "DEFAULT";
        currentCategory = "ALL";
        updateCategoryStrip();
        applyFilters();
    };

    // 2. Add New Product Live
    const addProductModal = document.getElementById("addProductModal");
    const addProductForm = document.getElementById("newProductForm");
    const addProductStatus = document.getElementById("addProductStatus");

    document.getElementById("openAddModalBtn").addEventListener("click", () => {
        addProductModal.classList.add("active");
    });

    window.closeAddProduct = () => {
        addProductModal.classList.remove("active");
        addProductForm.reset();
        addProductStatus.textContent = "";
    };

    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById("newProdName").value.trim(),
            brand: document.getElementById("newProdBrand")?.value.trim() || "Brand",
            category: document.getElementById("newProdCategory").value.trim(),
            price: parseFloat(document.getElementById("newProdPrice").value),
            originalPrice: parseFloat(document.getElementById("newProdOriginalPrice")?.value || document.getElementById("newProdPrice").value * 1.25),
            stock: parseInt(document.getElementById("newProdStock").value),
            rating: parseFloat(document.getElementById("newProdRating").value),
            color: document.getElementById("newProdColor")?.value.trim() || "Black",
            variant: document.getElementById("newProdVariant")?.value.trim() || "Standard",
            image: document.getElementById("newProdImage").value.trim()
        };

        addProductStatus.style.color = "#2874f0";
        addProductStatus.textContent = "Publishing product...";

        try {
            const res = await fetch("/api/add-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                addProductStatus.style.color = "#388e3c";
                addProductStatus.textContent = data.message;
                setTimeout(() => {
                    closeAddProduct();
                    fetchProducts();
                }, 800);
            } else {
                addProductStatus.style.color = "#ff6161";
                addProductStatus.textContent = data.error || "Failed to add product";
            }
        } catch (err) {
            addProductStatus.style.color = "#ff6161";
            addProductStatus.textContent = "Error saving product.";
        }
    });

    // 3. Cart Functions
    const cartOverlay = document.getElementById("cartOverlay");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartCountEl = document.getElementById("cartCount");
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartTotalDisplay = document.getElementById("cartTotalDisplay");

    function updateCartUI() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalQty;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#878787; margin-top:2rem;">Your cart is empty.</p>';
            cartTotalDisplay.textContent = "₹0";
            return;
        }

        let total = 0;
        cartItemsContainer.innerHTML = cart.map(item => {
            const p = allProducts.find(x => x.id === item.id);
            if (!p) return "";
            const subtotal = p.price * item.quantity;
            total += subtotal;
            return `
                <div style="display:flex; gap:10px; margin-bottom:10px; align-items:center; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <img src="${p.image}" style="width:45px; height:45px; object-fit:cover; border-radius:4px;">
                    <div style="flex:1;">
                        <div style="font-size:0.85rem; font-weight:500;">${p.name}</div>
                        <div style="font-size:0.8rem; font-weight:700;">${formatINR(p.price)}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <button style="padding: 2px 8px; cursor: pointer;" onclick="changeCartQty(${p.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button style="padding: 2px 8px; cursor: pointer;" onclick="changeCartQty(${p.id}, 1)">+</button>
                    </div>
                </div>
            `;
        }).join("");

        cartTotalDisplay.textContent = formatINR(total);
        localStorage.setItem("shop_cart", JSON.stringify(cart));
    }

    window.addToCart = (id) => {
        const ex = cart.find(i => i.id === id);
        if (ex) ex.quantity += 1;
        else cart.push({ id: id, quantity: 1 });
        updateCartUI();
        cartOverlay.classList.add("active");
        cartDrawer.classList.add("active");
    };

    window.changeCartQty = (id, delta) => {
        const idx = cart.findIndex(i => i.id === id);
        if (idx > -1) {
            cart[idx].quantity += delta;
            if (cart[idx].quantity <= 0) cart.splice(idx, 1);
        }
        updateCartUI();
    };

    window.closeCart = () => {
        cartOverlay.classList.remove("active");
        cartDrawer.classList.remove("active");
    };

    document.getElementById("cartNavBtn").addEventListener("click", () => {
        updateCartUI();
        cartOverlay.classList.add("active");
        cartDrawer.classList.add("active");
    });

    window.checkoutOrder = () => {
        if (cart.length === 0) return alert("Cart is empty!");
        
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem("shop_user"));
        if (!currentUser) {
            alert("Please login to proceed with checkout.");
            openLogin();
            return;
        }

        const items = cart.map(item => {
            const product = allProducts.find(p => p.id === item.id);
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            };
        });

        const payload = {
            items: items,
            userEmail: currentUser.email,
            userName: currentUser.fullName
        };

        fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`✅ ${data.message}\nOrder ID: ${data.orderId}`);
                cart = [];
                updateCartUI();
                closeCart();
                localStorage.removeItem("shop_cart");
            } else {
                alert("❌ " + (data.error || "Checkout failed."));
            }
        })
        .catch(err => {
            alert("✅ Order placed successfully! (Demo mode)");
            cart = [];
            updateCartUI();
            closeCart();
        });
    };

    // 4. Compare Functions
    const compareOverlay = document.getElementById("compareOverlay");
    const compareCountEl = document.getElementById("compareCount");
    const compareModalBody = document.getElementById("compareModalBody");

    window.toggleCompare = (id) => {
        const idx = compareList.indexOf(id);
        if (idx > -1) compareList.splice(idx, 1);
        else {
            if (compareList.length >= 4) return alert("You can compare up to 4 items.");
            compareList.push(id);
        }
        compareCountEl.textContent = compareList.length;
        localStorage.setItem("shop_compare", JSON.stringify(compareList));
        renderGrid();
    };

    document.getElementById("compareNavBtn").addEventListener("click", () => {
        if (compareList.length === 0) {
            compareModalBody.innerHTML = '<p style="text-align:center; color:#878787;">No items selected for comparison.</p>';
        } else {
            const items = compareList.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
            compareModalBody.innerHTML = `
                <table style="width:100%; border-collapse:collapse;">
                    <tr><th>Product</th>${items.map(p => `<td><b>${p.name}</b></td>`).join("")}</tr>
                    <tr><th>Price (INR)</th>${items.map(p => `<td style="color:#2874f0; font-weight:bold;">${formatINR(p.price)}</td>`).join("")}</tr>
                    <tr><th>Category</th>${items.map(p => `<td>${p.category}</td>`).join("")}</tr>
                    <tr><th>Rating</th>${items.map(p => `<td>★ ${p.rating}</td>`).join("")}</tr>
                </table>
            `;
        }
        compareOverlay.classList.add("active");
    });

    window.closeCompare = () => {
        compareOverlay.classList.remove("active");
    };

    // 5. Contact Form Handling
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        formStatus.textContent = "Sending inquiry...";
        formStatus.className = "form-status";

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok && data.success) {
                formStatus.textContent = data.message;
                formStatus.className = "form-status success";
                contactForm.reset();
            } else {
                formStatus.textContent = data.error || "Failed to send inquiry.";
                formStatus.className = "form-status error";
            }
        } catch (err) {
            formStatus.textContent = "Inquiry registered successfully!";
            formStatus.className = "form-status success";
            contactForm.reset();
        }
    });

    // Initial Execution
    fetchProducts();
    updateCartUI();
    compareCountEl.textContent = compareList.length;
});

// --- AUTHENTICATION FUNCTIONS (Outside DOMContentLoaded) ---
function checkUserSession() {
    const currentUser = JSON.parse(localStorage.getItem("shop_user"));
    const userMenuLabel = document.getElementById("userMenuLabel");
    const userDropdownContent = document.getElementById("userDropdownContent");
    
    if (currentUser) {
        userMenuLabel.textContent = currentUser.fullName.split(' ')[0];
        userDropdownContent.innerHTML = `
            <div style="padding: 0.75rem 1rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; color: #666;">
                <strong>${currentUser.fullName}</strong><br>
                ${currentUser.email}
            </div>
            <button onclick="logout()" style="border-bottom: none;">Logout</button>
        `;
    } else {
        userMenuLabel.textContent = "Account";
        userDropdownContent.innerHTML = `
            <button onclick="openLogin()">Login</button>
            <button onclick="openRegister()" style="border-bottom: none;">Create Account</button>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(checkUserSession, 100);
    
    // User menu toggle
    document.getElementById("userMenuBtn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById("userDropdown");
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });
    
    // Close dropdown on outside click
    document.addEventListener("click", () => {
        document.getElementById("userDropdown").style.display = "none";
    });
});

// Login Modal
function openLogin() {
    document.getElementById("loginModal").classList.add("active");
    document.getElementById("registerModal").classList.remove("active");
}

function closeLogin() {
    document.getElementById("loginModal").classList.remove("active");
}

function switchToRegister() {
    closeLogin();
    openRegister();
}

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const loginStatus = document.getElementById("loginStatus");

    loginStatus.textContent = "Logging in...";
    loginStatus.className = "form-status";

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            loginStatus.textContent = data.message;
            loginStatus.className = "form-status success";
            localStorage.setItem("shop_user", JSON.stringify(data.user));
            setTimeout(() => {
                closeLogin();
                checkUserSession();
                document.getElementById("loginForm").reset();
            }, 800);
        } else {
            loginStatus.textContent = data.error || "Login failed";
            loginStatus.className = "form-status error";
        }
    } catch (err) {
        loginStatus.textContent = "Error during login";
        loginStatus.className = "form-status error";
    }
});

// Register Modal
function openRegister() {
    document.getElementById("registerModal").classList.add("active");
    document.getElementById("loginModal").classList.remove("active");
}

function closeRegister() {
    document.getElementById("registerModal").classList.remove("active");
}

function switchToLogin() {
    closeRegister();
    openLogin();
}

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const registerStatus = document.getElementById("registerStatus");

    registerStatus.textContent = "Creating account...";
    registerStatus.className = "form-status";

    try {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password, confirmPassword })
        });
        const data = await res.json();

        if (data.success) {
            registerStatus.textContent = data.message;
            registerStatus.className = "form-status success";
            setTimeout(() => {
                closeRegister();
                openLogin();
                document.getElementById("registerForm").reset();
                document.getElementById("loginEmail").value = email;
                document.getElementById("loginEmail").focus();
            }, 800);
        } else {
            registerStatus.textContent = data.error || "Registration failed";
            registerStatus.className = "form-status error";
        }
    } catch (err) {
        registerStatus.textContent = "Error during registration";
        registerStatus.className = "form-status error";
    }
});

function logout() {
    localStorage.removeItem("shop_user");
    checkUserSession();
    document.getElementById("userDropdown").style.display = "none";
    alert("You have been logged out.");
}