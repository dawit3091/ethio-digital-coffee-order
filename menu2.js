
const menuData = {
  "cat-espresso": {
    title: "Espresso Based",
    accent: "#6F4E37",
    icon: "☕",
    items: [
      { name: "Espresso – Single", price: "ETB 60",  img: "img/esprosso1.png" },
      { name: "Macchiato",         price: "ETB 80",  img: "img/latte-macchiato.png" },
      { name: "Cappuccino",        price: "ETB 120", img: "img/cappuccino.jpg" },
      { name: "Caffè Latte",       price: "ETB 130", img: "img/latte.jpg" },
    ]
  },
  "cat-cold": {
    title: "Bread & Cold Coffee",
    accent: "#f9a825",
    icon: "🧊",
    items: [
      { name: "Iced Latte",        price: "ETB 140", img: "img/Iced_Latte.jpg" },
      { name: "Iced Macchiato",    price: "ETB 135", img: "img/iced_macchito.jpg" },
      { name: "Cold Brew Tonic",   price: "ETB 160", img: "img/cold_brewed.jpg" },
      { name: "Sambusa (2 pcs)",   price: "ETB 70",  img: "img/sanbusa.jpg" },
    ]
  },
  "cat-tea": {
    title: "Non-Coffee & Teas",
    accent: "#2e7d32",
    icon: "🍵",
    items: [
      { name: "Ethiopian Spiced Tea", price: "ETB 75",  img: "img/spiced.png" },
      { name: "Ginger Lemon Tea",     price: "ETB 80",  img: "img/gingergetty73-8c0ed3f-scaled.jpg" },
      { name: "Mango Juice",          price: "ETB 90",  img: "img/mango.jpg" },
      { name: "Avocado Juice",        price: "ETB 110", img: "img/avoccado.jpg" },
    ]
  },
  "cat-ceremony": {
    title: "Ethiopian Ceremony",
    accent: "#c62828",
    icon: "🫖",
    items: [
      { name: "Abol – Round 1 (Strong)",  price: "ETB 120", img: "img/first.jpg" },
      { name: "Tona – Round 2 (Medium)",  price: "ETB 100", img: "img/Ethiopian-Coffee-Ceremoney.jpg" },
      { name: "Baraka – Round 3 (Light)", price: "ETB 80",  img: "img/brewed_coffee.jpg" },
      { name: "Full Ceremony (All 3)",    price: "ETB 280", img: "img/ethiopian_coffe.jpg" },
    ]
  }
};


let cart = [];

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    const priceNum = parseInt(price.replace(/[^0-9]/g, ""), 10);
    cart.push({ name, price, priceNum, qty: 1 });
  }
  updateCartBadge();
  flashCartBtn();
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  updateCartBadge();
  renderCartModal();
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.priceNum * i.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? "flex" : "none";
}

function flashCartBtn() {
  const btn = document.getElementById("cart-fab");
  btn.classList.add("cart-pop");
  setTimeout(() => btn.classList.remove("cart-pop"), 300);
}

function openCartModal() {
  document.getElementById("cart-modal").classList.add("open");
  document.getElementById("cart-modal-overlay").classList.add("open");
  renderCartModal();
}

function closeCartModal() {
  document.getElementById("cart-modal").classList.remove("open");
  document.getElementById("cart-modal-overlay").classList.remove("open");
}

function renderCartModal() {
  const body   = document.getElementById("cart-modal-body");
  const footer = document.getElementById("cart-modal-footer");

  if (cart.length === 0) {
    body.innerHTML = `<p class="cart-empty">Your order is empty.<br>Add something from the menu!</p>`;
    footer.style.display = "none";
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">x${item.qty}</span>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">ETB ${item.priceNum * item.qty}</span>
        <button class="cart-remove" data-name="${item.name}">&times;</button>
      </div>
    </div>
  `).join("");

  body.querySelectorAll(".cart-remove").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.name));
  });

  footer.style.display = "block";
  footer.innerHTML = `
    <div class="cart-total">Total: <strong>ETB ${cartTotal()}</strong></div>
    <div class="cart-actions">
      <button class="checkout-btn" id="btn-preorder">📦 Pre-Order</button>
      <button class="checkout-btn" id="btn-pickup">🕐 Scheduled Pickup</button>
    </div>
  `;

  document.getElementById("btn-preorder").addEventListener("click", () => {
    alert("Pre-Order placed! We'll confirm via phone shortly. ☕");
    cart = [];
    updateCartBadge();
    closeCartModal();
  });

  document.getElementById("btn-pickup").addEventListener("click", () => {
    alert("Scheduled Pickup confirmed! Your order will be ready at your chosen time. 🫖");
    cart = [];
    updateCartBadge();
    closeCartModal();
  });
}


function buildPanel(catId) {
  const data = menuData[catId];
  if (!data) return null;

  const panel = document.createElement("div");
  panel.className = "items-panel";
  panel.id = "panel-" + catId;
  panel.style.setProperty("--panel-accent", data.accent);

  const rowsHTML = data.items.map(item => `
    <div class="item-row">
      <img src="${item.img}" alt="${item.name}" class="item-img">
      <span class="item-name">${item.name}</span>
      <span class="item-dots"></span>
      <span class="item-price">${item.price}</span>
      <button class="add-btn" data-name="${item.name}" data-price="${item.price}">+ Add</button>
    </div>
  `).join("");

  panel.innerHTML = `
    <div class="panel-inner">
      <div class="panel-header">
        <span class="panel-icon">${data.icon}</span>
        <h3 class="panel-title">${data.title}</h3>
        <button class="panel-close" aria-label="Close">&times;</button>
      </div>
      <div class="items-grid">
        ${rowsHTML}
      </div>
    </div>
  `;

  // attach add-to-cart listeners
  panel.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.name, btn.dataset.price);
      btn.textContent = "✓ Added";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "+ Add";
        btn.classList.remove("added");
      }, 1200);
    });
  });

  return panel;
}


let activeCardId = null;

// Each card gets its OWN panel container injected directly after it
function getPanelContainer(card) {
  let container = document.getElementById("panel-" + card.id + "-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "panel-container";
    container.id = "panel-" + card.id + "-container";
    card.insertAdjacentElement("afterend", container);
  }
  return container;
}

function openPanel(card) {
  const catId = card.id;

  // Close any open panel first
  if (activeCardId && activeCardId !== catId) {
    const prevCard = document.getElementById(activeCardId);
    if (prevCard) collapseCard(prevCard);
  }

  const container = getPanelContainer(card);
  container.innerHTML = "";
  container.classList.remove("visible");

  const panel = buildPanel(catId);
  if (!panel) return;

  container.appendChild(panel);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.classList.add("visible");
    });
  });

  setTimeout(() => {
    container.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 80);

  panel.querySelector(".panel-close").addEventListener("click", (e) => {
    e.stopPropagation();
    collapseCard(card);
  });

  activeCardId = catId;
  highlightCard(catId);
}

function collapseCard(card) {
  const container = document.getElementById("panel-" + card.id + "-container");
  if (container) {
    container.classList.remove("visible");
    setTimeout(() => { container.innerHTML = ""; }, 380);
  }
  if (activeCardId === card.id) {
    activeCardId = null;
    clearHighlights();
  }
}

function highlightCard(catId) {
  document.querySelectorAll(".category-card").forEach(c => {
    c.classList.toggle("card-active", c.id === catId);
  });
}

function clearHighlights() {
  document.querySelectorAll(".category-card").forEach(c => {
    c.classList.remove("card-active");
  });
}


document.querySelectorAll(".category-card").forEach(card => {
  const btn = card.querySelector(".card-btn");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (activeCardId === card.id) {
      collapseCard(card);
    } else {
      openPanel(card);
    }
  });

  card.addEventListener("click", () => {
    if (activeCardId === card.id) {
      collapseCard(card);
    } else {
      openPanel(card);
    }
  });
});

document.getElementById("cart-fab").addEventListener("click", openCartModal);
document.getElementById("cart-modal-close").addEventListener("click", closeCartModal);
document.getElementById("cart-modal-overlay").addEventListener("click", closeCartModal);
