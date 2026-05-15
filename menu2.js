
const menuData = {
  "cat-espresso": {
    title: "Espresso Based",
    accent: "#6F4E37",
    icon: "☕",
    items: [
      { name: "Espresso – Single",   price: "ETB 60",img:"img/esprosso1.png" },
     
      { name: "Macchiato",           price: "ETB 80",img:"img/latte-macchiato.png" },
      
      { name: "Cappuccino",          price: "ETB 120",img:"img/cappuccino.jpg" },
      { name: "Caffè Latte",         price: "ETB 130",img:"img/latte.jpg" },
    ]
  },
  "cat-cold": {
    title: "Bread & Cold Coffee",
    accent: "#f9a825",
    icon: "🧊",
    items: [
      { name: "Iced Latte",          price: "ETB 140",img:"img/Iced_Latte.jpg" },
      { name: "Iced Macchiato",      price: "ETB 135",img:"img/iced_macchito.jpg" },
      { name: "Cold Brew Tonic",     price: "ETB 160",img:"img/cold_brewed.jpg" },
      { name: "Sambusa (2 pcs)",     price: "ETB 70" ,img:"img/sanbusa.jpg" },
    ]
  },
  "cat-tea": {
    title: "Non-Coffee & Teas",
    accent: "#2e7d32",
    icon: "🍵",
    items: [
      { name: "Ethiopian Spiced Tea",   price: "ETB 75" ,img:"img/spiced.png"},
      { name: "Ginger Lemon Tea",       price: "ETB 80",img:"img/gingergetty73-8c0ed3f-scaled.jpg"},
      { name: "Mango Juice",            price: "ETB 90",img:"img/mango.jpg" },
      { name: "Avocado Juice",          price: "ETB 110",img:"img/avoccado.jpg" },
    ]
  },
  "cat-ceremony": {
    title: "Ethiopian Ceremony",
    accent: "#c62828",
    icon: "🫖",
    items: [
      { name: "Abol – Round 1 (Strong)",   price: "ETB 120",img:"img/first.jpg" },
      { name: "Tona – Round 2 (Medium)",   price: "ETB 100",img:"img/Ethiopian-Coffee-Ceremoney.jpg" },
      { name: "Baraka – Round 3 (Light)",  price: "ETB 80" ,img:"img/brewed_coffee.jpg" },
      { name: "Full Ceremony (All 3)",     price: "ETB 280",img:"img/ethiopian_coffe.jpg" },
    ]
  }
};

// ── build the panel HTML for a given category id ──
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

  return panel;
}

// ── main logic ──
let activeCardId = null;   // tracks which card is open

const menuMain = document.querySelector(".menu-main");

// Find (or create) the panel container that lives AFTER the grid
let panelContainer = document.getElementById("panel-container");
if (!panelContainer) {
  panelContainer = document.createElement("div");
  panelContainer.id = "panel-container";
  menuMain.appendChild(panelContainer);
}

function openPanel(catId) {
  // Remove any existing panel
  panelContainer.innerHTML = "";
  panelContainer.classList.remove("visible");

  const panel = buildPanel(catId);
  if (!panel) return;

  panelContainer.appendChild(panel);

  // Trigger reflow so transition plays
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panelContainer.classList.add("visible");
    });
  });

  // Scroll panel into view smoothly
  setTimeout(() => {
    panelContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 80);

  // Close button
  panel.querySelector(".panel-close").addEventListener("click", (e) => {
    e.stopPropagation();
    closePanel();
  });

  activeCardId = catId;
  highlightCard(catId);
}

function closePanel() {
  panelContainer.classList.remove("visible");
  setTimeout(() => {
    panelContainer.innerHTML = "";
  }, 380); // matches CSS transition duration
  activeCardId = null;
  clearHighlights();
}

function highlightCard(catId) {
  document.querySelectorAll(".category-card").forEach(card => {
    card.classList.toggle("card-active", card.id === catId);
  });
}

function clearHighlights() {
  document.querySelectorAll(".category-card").forEach(card => {
    card.classList.remove("card-active");
  });
}

// ── attach event listeners to every card's button ──
document.querySelectorAll(".category-card").forEach(card => {
  const btn = card.querySelector(".card-btn");

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // don't bubble to card click

    if (activeCardId === card.id) {
      // Clicking the same card again → close
      closePanel();
    } else {
      openPanel(card.id);
    }
  });

  // Also allow clicking anywhere on the card
  card.addEventListener("click", () => {
    if (activeCardId === card.id) {
      closePanel();
    } else {
      openPanel(card.id);
    }
  });
});
