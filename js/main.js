/* -------------------------------------------------------------
 * Script: main.js
 * Project: Cracks Pollos y Arroces - Web Solution
 * Description: Client-side interactivity, dynamic menu filtering, 
 *              shopping cart management with item removal & quantity controls.
 * ------------------------------------------------------------- */

// Sample Menu Data Array (Simulating Data Source)
const menuItems = [
    {
        id: 1,
        title: "Pollo Rostizado Entero a las Finas Hierbas",
        category: "pollos",
        price: 34900,
        desc: "Horneado con marinada secreta de finas hierbas y especias naturales.",
        emoji: "🍗"
    },
    {
        id: 2,
        title: "Medio Pollo + Papas Criollas",
        category: "pollos",
        price: 19900,
        desc: "Ideal para 2 personas. Incluye papitas criollas doradas.",
        emoji: "🍗🥔"
    },
    {
        id: 3,
        title: "Arroz Cracks Especial de la Casa",
        category: "arroces",
        price: 24900,
        desc: "Arroz salteado con trozos de pollo, verduras frescas y salsa artesanal.",
        emoji: "🍚"
    },
    {
        id: 4,
        title: "Arroz Paisa con Chicharroncito",
        category: "arroces",
        price: 26900,
        desc: "Arroz con frijol, plátano maduro, maíz tierno y chicharrón crujiente.",
        emoji: "🍲"
    },
    {
        id: 5,
        title: "Combo Familiar Cracks",
        category: "combos",
        price: 49900,
        desc: "1 Pollo entero + 1 Arroz familiar + Papas criollas + Bebida 1.5L.",
        emoji: "🍱"
    },
    {
        id: 6,
        title: "Combo Pareja de Pollo & Arroz",
        category: "combos",
        price: 32900,
        desc: "1/2 Pollo + 1 Arroz personal + 2 bebidas gaseosas.",
        emoji: "🥤"
    }
];

// Shopping Cart State Array
let shoppingCart = [];

// DOM Element Selectors
document.addEventListener('DOMContentLoaded', () => {
    renderMenu('all');
    setupEventListeners();
});

// Function to Render Menu Cards Dynamically
function renderMenu(category) {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = '';
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card menu-item-card';
        card.innerHTML = `
            <div>
                <div class="menu-item-img">${item.emoji}</div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
            <div class="menu-item-footer">
                <span class="price">$${item.price.toLocaleString('es-CO')} COP</span>
                <button class="btn btn-primary add-to-cart-btn" data-id="${item.id}">+ Agregar</button>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    // Attach Add to Cart Click Handlers
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            addToCart(itemId);
        });
    });
}

// Function to Add Item to Cart
function addToCart(id) {
    const item = menuItems.find(p => p.id === id);
    if (!item) return;

    const existingIndex = shoppingCart.findIndex(cartItem => cartItem.id === id);
    if (existingIndex > -1) {
        shoppingCart[existingIndex].quantity += 1;
    } else {
        shoppingCart.push({ ...item, quantity: 1 });
    }

    updateCartUI();
    openCartModal();
}

// Function to Update Item Quantity
function updateQuantity(id, delta) {
    const itemIndex = shoppingCart.findIndex(cartItem => cartItem.id === id);
    if (itemIndex > -1) {
        shoppingCart[itemIndex].quantity += delta;
        if (shoppingCart[itemIndex].quantity <= 0) {
            shoppingCart.splice(itemIndex, 1);
        }
        updateCartUI();
    }
}

// Function to Remove Item from Cart
function removeFromCart(id) {
    shoppingCart = shoppingCart.filter(item => item.id !== id);
    updateCartUI();
}

// Function to Update Shopping Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Total Count Calculation
    const totalCount = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalCount;

    // Total Price Calculation
    const totalPrice = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalAmount) cartTotalAmount.textContent = `$${totalPrice.toLocaleString('es-CO')} COP`;

    // Render Cart Items
    if (cartItemsContainer) {
        if (shoppingCart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío actualmente.</p>';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            if (checkoutBtn) checkoutBtn.disabled = false;
            cartItemsContainer.innerHTML = '';
            shoppingCart.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item-row';
                itemRow.innerHTML = `
                    <div class="cart-item-info">
                        <strong>${item.title}</strong>
                        <div class="cart-item-unit-price"><small>$${item.price.toLocaleString('es-CO')} c/u</small></div>
                        <div class="cart-item-controls">
                            <button class="qty-btn qty-minus" data-id="${item.id}" title="Disminuir cantidad">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn qty-plus" data-id="${item.id}" title="Aumentar cantidad">+</button>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <strong class="cart-item-subtotal">$${(item.price * item.quantity).toLocaleString('es-CO')}</strong>
                        <button class="remove-item-btn" data-id="${item.id}" title="Eliminar producto">🗑️</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemRow);
            });

            // Attach event handlers for qty minus, qty plus, and remove buttons
            document.querySelectorAll('.qty-minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    updateQuantity(id, -1);
                });
            });

            document.querySelectorAll('.qty-plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    updateQuantity(id, 1);
                });
            });

            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    removeFromCart(id);
                });
            });
        }
    }
}

// Cart Drawer Visibility Helpers
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.classList.add('open');
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.classList.remove('open');
}

// Setup Event Listeners
function setupEventListeners() {
    // Menu Category Filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const cat = e.target.getAttribute('data-category');
            renderMenu(cat);
        });
    });

    // Cart Modal Controls
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartOverlay = document.querySelector('.cart-overlay');

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartModal);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartModal);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartModal);

    // Order Tracking Form Handler
    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) {
        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const orderId = document.getElementById('order-id-input').value;
            const trackingResult = document.getElementById('tracking-result');
            const statusOrderId = document.getElementById('status-order-id');

            if (statusOrderId) statusOrderId.textContent = orderId.toUpperCase();
            if (trackingResult) trackingResult.classList.remove('hidden');
        });
    }

    // Checkout Form Submission Handler
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Pedido Recibido con Éxito! Tu número de orden es: CRACKS-' + Math.floor(1000 + Math.random() * 9000) + '. Tiempo estimado: 30 mins.');
            shoppingCart = [];
            updateCartUI();
            closeCartModal();
        });
    }

    // Feedback Form Handler
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Muchas gracias por tu comentario! Nos ayuda a mantener la máxima calidad en Cracks.');
            feedbackForm.reset();
        });
    }
}
