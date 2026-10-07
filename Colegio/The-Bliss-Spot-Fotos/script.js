/* =========================================================
   THE BLISS SPOT — JAVASCRIPT
   EDITA AQUÍ TUS DATOS Y PRECIOS.
   ========================================================= */

const CONFIG = {
  whatsapp: "18098580375",       // ← PON AQUÍ TU NÚMERO, con código de país y SIN +
  instagram: "https://instagram.com/tu_instagram",
  currency: "$"
};

/* Precios de ejemplo: cámbialos aquí cuando tengas los definitivos. */
const PRODUCTS = {
  "Mini Donas de Chocolate": 250,
  "Mini Donas de Dulce de Leche": 250,
  "Mini Donas de Leche Condensada": 250,
  "Mini Donas con Miel": 250,
  "Mini Donas Chocolate + Sprinkles": 275,
  "Caja Mini Box — 8 mini donas": 250,
  "Caja Bliss Box — 12 mini donas": 350,
  "Caja Big Bliss — 16 mini donas": 450
};

let cart = JSON.parse(localStorage.getItem("blissCart")) || [];

/* ---------- Navbar / menú móvil ---------- */
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

menuToggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
  menuToggle.textContent = open ? "×" : "☰";
});

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- Carrito ---------- */
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const checkoutButton = document.getElementById("checkoutButton");

function money(value) {
  return `${CONFIG.currency}${Number(value).toLocaleString("en-US")}`;
}

function saveCart() {
  localStorage.setItem("blissCart", JSON.stringify(cart));
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price: Number(price), quantity: 1 });

  saveCart();
  renderCart();
  showToast(`${name} agregado`);
  openCart();
}

document.querySelectorAll(".add-btn, .outline-add").forEach(button => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.name, button.dataset.price);
  });
});

function changeQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>♡</span>
        <p>Tu carrito está vacío.</p>
        <small>Agrega algo rico para empezar.</small>
      </div>`;
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <h4>${escapeHTML(item.name)}</h4>
        <p>${money(item.price)} cada uno</p>
        <div class="qty">
          <button aria-label="Disminuir" onclick="changeQuantity(${index}, -1)">−</button>
          <span>${item.quantity}</span>
          <button aria-label="Aumentar" onclick="changeQuantity(${index}, 1)">+</button>
        </div>
        <button class="remove-item" onclick="removeItem(${index})">Eliminar</button>
      </div>
      <div class="cart-item-price">${money(item.price * item.quantity)}</div>
    </div>
  `).join("");
}

clearCart.addEventListener("click", () => {
  if (!cart.length) return;
  cart = [];
  saveCart();
  renderCart();
  showToast("Carrito vaciado");
});

checkoutButton.addEventListener("click", () => {
  if (!cart.length) {
    showToast("Tu carrito está vacío");
    return;
  }

  const lines = cart.map(item =>
    `• ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`
  ).join("\n");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hola, The Bliss Spot ♡\n\nQuiero realizar este pedido:\n${lines}\n\nTotal: ${money(total)}\n\n¿Podemos confirmar disponibilidad?`;
  openWhatsApp(message);
});

/* ---------- Formulario ---------- */
const orderForm = document.getElementById("orderForm");
const orderDate = document.getElementById("orderDate");

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
orderDate.min = today.toISOString().split("T")[0];

orderForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const product = document.getElementById("orderProduct").value;
  const quantity = document.getElementById("orderQuantity").value;
  const date = document.getElementById("orderDate").value;
  const delivery = document.getElementById("delivery").value;
  const notes = document.getElementById("notes").value.trim();

  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("es-DO", {
    day: "2-digit", month: "long", year: "numeric"
  });

  const message =
`Hola, The Bliss Spot ♡

Quiero hacer un pedido:

Nombre: ${name}
Teléfono: ${phone}
Producto: ${product}
Cantidad: ${quantity}
Fecha: ${formattedDate}
Método de entrega: ${delivery}
${notes ? `Notas: ${notes}` : ""}

¡Gracias! ✨`;

  openWhatsApp(message);
  showToast("Abriendo WhatsApp...");
});

/* ---------- WhatsApp e Instagram ---------- */
function openWhatsApp(message) {
  const number = CONFIG.whatsapp.replace(/\D/g, "");
  if (!number || number === "18090000000") {
    alert("Primero coloca tu número real de WhatsApp en CONFIG dentro de script.js.");
    return;
  }
  const url = `https://wa.me/${18098580375}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("floatingWhatsapp").addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp("Hola, The Bliss Spot ♡. Me gustaría realizar un pedido.");
});

const instagramLink = document.getElementById("instagramLink");
instagramLink.href = CONFIG.instagram;
instagramLink.target = "_blank";
instagramLink.rel = "noopener noreferrer";

const whatsappLink = document.getElementById("whatsappLink");
whatsappLink.addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp("Hola, The Bliss Spot ♡. Me gustaría conocer el menú.");
});

/* ---------- Animaciones ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.querySelector("p").textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* ---------- Seguridad para texto dinámico ---------- */
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

renderCart();
