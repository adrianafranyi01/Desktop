/* ==========================================================
   THE BLISS SPOT — Lógica compartida por todas las páginas
   (Los datos que puedes editar están en js/config.js)
   ========================================================== */
(function () {
  "use strict";

  var CFG = window.BLISS_CONFIG || {};
  var CATS = window.BLISS_CATEGORIES || [];
  var PRODUCTS = window.BLISS_PRODUCTS || [];
  var PAGE = document.body.getAttribute("data-page") || "";
  var CART_KEY = "theBlissSpotCart_v1";

  /* ---------- Utilidades ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) { return (CFG.moneda || "$") + (Math.round(n * 100) / 100).toFixed(2); }
  function productById(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function catById(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i]; return null; }
  function digits(s) { return String(s || "").replace(/\D/g, ""); }

  var ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .8c-.8-.4-1.6-1.2-2-2l.8-1-1-2L9 9Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".8" fill="currentColor"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="17.5" height="14" rx="3"/><path d="M4 7.5l8 5.5 8-5.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6 7-11.5A7 7 0 0 0 5 9.5C5 15 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>'
  };

  /* ---------- Carrito (se guarda en el navegador) ---------- */
  var memoryCart = [];
  function loadCart() {
    var raw = null;
    try { raw = localStorage.getItem(CART_KEY); } catch (e) { return memoryCart; }
    if (!raw) return [];
    try {
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(function (l) { return l && productById(l.id) && l.qty > 0; })
                 .map(function (l) { return { id: l.id, qty: Math.min(99, Math.floor(l.qty)) }; });
    } catch (e) { return []; }
  }
  var cart = loadCart();
  function saveCart() {
    memoryCart = cart.slice();
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* almacenamiento bloqueado: se usa memoria */ }
    refreshCartUI();
  }
  function lineOf(id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i]; return null; }
  function addToCart(id, qty) {
    var p = productById(id); if (!p) return;
    var l = lineOf(id);
    if (l) l.qty = Math.min(99, l.qty + (qty || 1)); else cart.push({ id: id, qty: qty || 1 });
    saveCart();
  }
  function setQty(id, qty) {
    var l = lineOf(id); if (!l) return;
    if (qty <= 0) { removeFromCart(id); return; }
    l.qty = Math.min(99, qty); saveCart();
  }
  function removeFromCart(id) { cart = cart.filter(function (l) { return l.id !== id; }); saveCart(); }
  function clearCart() { cart = []; saveCart(); }
  function cartCount() { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (t, l) { var p = productById(l.id); return t + (p ? p.precio * l.qty : 0); }, 0); }

  /* ---------- Piezas visuales ---------- */
  function productCard(p) {
    var c = catById(p.categoria);
    return '<article class="card">' +
      '<div class="card-media"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="800" height="800">' +
      '<span class="card-cat">' + esc(c ? c.nombre : "") + '</span></div>' +
      '<div class="card-body"><h3>' + esc(p.nombre) + '</h3><p>' + esc(p.descripcion) + '</p>' +
      '<div class="card-foot"><div class="price">' + money(p.precio) + (p.ejemplo ? '<small>Precio de ejemplo</small>' : '') + '</div>' +
      '<button class="add-btn" type="button" data-add="' + esc(p.id) + '" aria-label="Agregar ' + esc(p.nombre) + ' al carrito">' + ICON.plus + '<span>Agregar</span></button></div>' +
      '</div></article>';
  }

  function itemsHTML(editable) {
    return '<ul class="items">' + cart.map(function (l) {
      var p = productById(l.id);
      return '<li class="item">' +
        '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" width="68" height="68">' +
        '<div><div class="item-name">' + esc(p.nombre) + '</div><div class="item-price">' + money(p.precio) + ' c/u</div>' +
        (editable ? '<button class="rm" type="button" data-remove="' + esc(p.id) + '">Eliminar</button>' : '') + '</div>' +
        '<div class="item-side"><div class="qty" role="group" aria-label="Cantidad de ' + esc(p.nombre) + '">' +
        '<button type="button" data-dec="' + esc(p.id) + '" aria-label="Disminuir cantidad">−</button><span aria-live="polite">' + l.qty + '</span>' +
        '<button type="button" data-inc="' + esc(p.id) + '" aria-label="Aumentar cantidad">+</button></div>' +
        '<div class="line-total">' + money(p.precio * l.qty) + '</div></div></li>';
    }).join("") + '</ul>';
  }
  function reviewItemsHTML() {
    return '<ul class="items">' + cart.map(function (l) {
      var p = productById(l.id);
      return '<li class="item"><img src="' + esc(p.img) + '" alt="" width="68" height="68">' +
        '<div><div class="item-name">' + esc(p.nombre) + '</div><div class="item-price">' + l.qty + ' × ' + money(p.precio) + '</div></div>' +
        '<div class="item-side"><div class="line-total">' + money(p.precio * l.qty) + '</div></div></li>';
    }).join("") + '</ul>';
  }
  function totalsHTML() {
    return '<div class="totals"><div class="totals-row"><span>Subtotal</span><span>' + money(cartTotal()) + '</span></div>' +
      '<div class="totals-row grand"><span>Total</span><b>' + money(cartTotal()) + '</b></div></div>';
  }
  function emptyHTML(withLink) {
    return '<div class="empty">' + ICON.cart + '<h3>Tu carrito está vacío</h3><p>Agrega tus postres favoritos y aparecerán aquí.</p>' +
      (withLink ? '<a class="btn btn--primary btn--sm" href="menu.html">Explorar menú</a>' : '') + '</div>';
  }

  /* ---------- Encabezado, pie, carrito lateral y avisos ---------- */
  function navLink(href, label, key) {
    return '<a class="nav-link' + (PAGE === key ? ' is-active' : '') + '" href="' + href + '"' + (PAGE === key ? ' aria-current="page"' : '') + '>' + label + '</a>';
  }
  function buildHeader() {
    var host = $("#site-header"); if (!host) return;
    var dd = CATS.map(function (c) { return '<a href="menu.html#' + esc(c.id) + '">' + esc(c.nombre) + '</a>'; }).join("");
    host.outerHTML =
      '<header class="site-header" id="top"><div class="container header-inner">' +
      '<a class="brand" href="index.html" aria-label="The Bliss Spot, ir al inicio"><img src="img/logo.svg" alt="" width="44" height="44">' +
      '<span class="brand-name">The Bliss Spot<small>Postres hechos a mano</small></span></a>' +
      '<nav class="main-nav" id="main-nav" aria-label="Navegación principal">' +
      navLink("index.html", "Inicio", "inicio") + navLink("nosotros.html", "Nosotros", "nosotros") +
      '<div class="nav-dd"><button class="nav-dd-btn' + (PAGE === "menu" ? ' is-active' : '') + '" type="button" aria-expanded="false" aria-haspopup="true">Menú ' + ICON.chevron + '</button>' +
      '<div class="nav-dd-menu"><a href="menu.html">Ver todo el menú</a>' + dd + '</div></div>' +
      navLink("pedidos.html", "Pedidos", "pedidos") + navLink("contacto.html", "Contacto", "contacto") +
      '</nav><div class="header-actions">' +
      '<button class="cart-btn" type="button" id="cart-open" aria-label="Abrir carrito" aria-haspopup="dialog">' + ICON.cart + '<span class="cart-label">Carrito</span><span class="cart-count" id="cart-count">0</span></button>' +
      '<button class="nav-toggle" type="button" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="main-nav"><span></span></button>' +
      '</div></div></header>';
  }

  function contactLines() {
    var out = [];
    out.push(CFG.whatsapp ? '<li><a href="https://wa.me/' + digits(CFG.whatsapp) + '" target="_blank" rel="noopener">WhatsApp</a></li>' : '<li>WhatsApp: próximamente</li>');
    out.push(CFG.instagramUrl ? '<li><a href="' + esc(CFG.instagramUrl) + '" target="_blank" rel="noopener">Instagram ' + esc(CFG.instagramUsuario || "") + '</a></li>' : '<li>Instagram: próximamente</li>');
    if (CFG.correo) out.push('<li><a href="mailto:' + esc(CFG.correo) + '">' + esc(CFG.correo) + '</a></li>');
    return out.join("");
  }
  function buildFooter() {
    var host = $("#site-footer"); if (!host) return;
    host.outerHTML =
      '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
      '<div><a class="brand" href="index.html"><img src="img/logo.svg" alt="" width="44" height="44"><span class="brand-name">The Bliss Spot<small>Postres hechos a mano</small></span></a>' +
      '<p style="margin-top:18px;max-width:34ch">Mini donas, pasteles sencillos, flanes y brownies caseros, preparados con cariño.</p></div>' +
      '<div><h4>Explorar</h4><ul><li><a href="index.html">Inicio</a></li><li><a href="nosotros.html">Nosotros</a></li><li><a href="menu.html">Menú</a></li><li><a href="pedidos.html">Pedidos</a></li><li><a href="contacto.html">Contacto</a></li></ul></div>' +
      '<div><h4>Postres</h4><ul>' + CATS.map(function (c) { return '<li><a href="menu.html#' + esc(c.id) + '">' + esc(c.nombre) + '</a></li>'; }).join("") + '</ul></div>' +
      '<div><h4>Contacto</h4><ul>' + contactLines() + '</ul></div></div>' +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' The Bliss Spot. Todos los derechos reservados.</span><span>Hecho con cariño</span></div></div></footer>';
  }

  function buildDrawer() {
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="overlay" id="overlay"></div>' +
      '<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" aria-hidden="true">' +
      '<div class="drawer-head"><h2 id="drawer-title">Tu carrito</h2><button class="icon-btn" type="button" id="drawer-close" aria-label="Cerrar carrito">' + ICON.close + '</button></div>' +
      '<div class="drawer-body" id="drawer-body"></div><div class="drawer-foot" id="drawer-foot"></div></aside>' +
      '<div class="toast-wrap" id="toasts" role="status" aria-live="polite"></div>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  var lastFocus = null;
  function openDrawer() {
    var d = $("#drawer"); if (!d) return;
    lastFocus = document.activeElement;
    d.classList.add("is-open"); d.setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(function () { var b = $("#drawer-close"); if (b) b.focus(); }, 60);
  }
  function closeDrawer() {
    var d = $("#drawer"); if (!d) return;
    d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true");
    $("#overlay").classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function renderDrawer() {
    var body = $("#drawer-body"), foot = $("#drawer-foot"); if (!body || !foot) return;
    if (!cart.length) {
      body.innerHTML = emptyHTML(false);
      foot.innerHTML = '<a class="btn btn--primary" href="menu.html">Explorar menú</a><button class="btn btn--ghost" type="button" data-close-drawer>Continuar comprando</button>';
    } else {
      body.innerHTML = itemsHTML(true);
      foot.innerHTML = totalsHTML() +
        '<p class="form-note" style="margin-bottom:6px">Al finalizar revisarás tu pedido antes de enviarlo por WhatsApp.</p>' +
        '<a class="btn btn--primary" href="pedidos.html">Finalizar pedido</a>' +
        '<button class="btn btn--ghost" type="button" data-close-drawer>Continuar comprando</button>';
    }
  }

  function refreshCartUI() {
    var n = cartCount();
    $$("#cart-count").forEach(function (el) { el.textContent = n; });
    var btn = $("#cart-open");
    if (btn) btn.setAttribute("aria-label", "Abrir carrito, " + n + (n === 1 ? " producto" : " productos"));
    renderDrawer();
    if (typeof window.__renderOrderPage === "function") window.__renderOrderPage();
  }
  function bumpCart() {
    var b = $("#cart-open"); if (!b) return;
    b.classList.remove("is-bump"); void b.offsetWidth; b.classList.add("is-bump");
  }

  function toast(text, opts) {
    opts = opts || {};
    var wrap = $("#toasts"); if (!wrap) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = (opts.img ? '<img src="' + esc(opts.img) + '" alt="">' : '<span class="ok">' + ICON.check + '</span>') +
      '<span>' + esc(text) + '</span>' + (opts.action ? '<a href="#" data-toast-cart>' + esc(opts.action) + '</a>' : "");
    wrap.appendChild(el);
    while (wrap.children.length > 3) wrap.removeChild(wrap.firstChild);
    setTimeout(function () {
      el.classList.add("is-out");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 420);
    }, 3200);
  }

  /* ---------- Eventos globales (carrito, menú, botones) ---------- */
  function bindGlobal() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      var add = t.closest && t.closest("[data-add]");
      if (add) {
        var id = add.getAttribute("data-add"), p = productById(id);
        addToCart(id, 1); bumpCart();
        toast("«" + (p ? p.nombre : "Producto") + "» se agregó al carrito", { img: p && p.img, action: "Ver carrito" });
        var label = $("span", add);
        if (label) {
          add.classList.add("is-added"); label.textContent = "Agregado";
          setTimeout(function () { add.classList.remove("is-added"); label.textContent = "Agregar"; }, 1300);
        }
        return;
      }
      var inc = t.closest && t.closest("[data-inc]"); if (inc) { var l1 = lineOf(inc.getAttribute("data-inc")); if (l1) setQty(l1.id, l1.qty + 1); return; }
      var dec = t.closest && t.closest("[data-dec]"); if (dec) { var l2 = lineOf(dec.getAttribute("data-dec")); if (l2) setQty(l2.id, l2.qty - 1); return; }
      var rm = t.closest && t.closest("[data-remove]"); if (rm) { removeFromCart(rm.getAttribute("data-remove")); return; }
      if (t.closest && (t.closest("#cart-open") || t.closest("[data-toast-cart]"))) { e.preventDefault(); openDrawer(); return; }
      if (t.closest && (t.closest("#drawer-close") || t.closest("[data-close-drawer]") || t.id === "overlay")) { closeDrawer(); return; }

      var ddBtn = t.closest && t.closest(".nav-dd-btn");
      if (ddBtn) {
        var dd = ddBtn.parentNode, open = !dd.classList.contains("is-open");
        dd.classList.toggle("is-open", open); ddBtn.setAttribute("aria-expanded", String(open));
        return;
      }
      var openDD = $(".nav-dd.is-open");
      if (openDD && !(t.closest && t.closest(".nav-dd"))) { openDD.classList.remove("is-open"); $(".nav-dd-btn", openDD).setAttribute("aria-expanded", "false"); }

      var link = t.closest && t.closest(".nav-dd-menu a, .main-nav > .nav-link");
      if (link) closeMobileNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if ($("#drawer.is-open")) closeDrawer();
        closeMobileNav();
        var o = $(".nav-dd.is-open"); if (o) { o.classList.remove("is-open"); $(".nav-dd-btn", o).setAttribute("aria-expanded", "false"); }
      }
      if (e.key === "Tab" && $("#drawer.is-open")) {
        var f = $$("#drawer button, #drawer a").filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    var tg = $("#nav-toggle");
    if (tg) tg.addEventListener("click", function () {
      var nav = $("#main-nav"), open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open); tg.setAttribute("aria-expanded", String(open));
      tg.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 980) closeMobileNav(); });
    window.addEventListener("scroll", function () {
      var h = $(".site-header"); if (h) h.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
    window.addEventListener("storage", function (e) {
      if (e.key === CART_KEY) { cart = loadCart(); refreshCartUI(); }
    });
  }
  function closeMobileNav() {
    var nav = $("#main-nav"), tg = $("#nav-toggle");
    if (nav) nav.classList.remove("is-open");
    if (tg) { tg.setAttribute("aria-expanded", "false"); tg.setAttribute("aria-label", "Abrir menú"); }
  }

  /* ---------- Mensaje de WhatsApp ---------- */
  function waLink(text) {
    var num = digits(CFG.whatsapp);
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
  }
  function buildOrderMessage(d) {
    var lines = [];
    lines.push("*Nuevo pedido · The Bliss Spot*", "");
    lines.push("*Cliente:* " + d.nombre);
    lines.push("*Teléfono:* " + d.telefono);
    lines.push("*Fecha de entrega:* " + d.fecha);
    if (d.hora) lines.push("*Hora:* " + d.hora);
    lines.push("*Modalidad:* " + d.modalidad);
    if (d.direccion) lines.push("*Dirección:* " + d.direccion);
    lines.push("", "*Productos:*");
    cart.forEach(function (l) {
      var p = productById(l.id);
      lines.push("• " + l.qty + " x " + p.nombre + " — " + money(p.precio * l.qty));
    });
    lines.push("", "*Total:* " + money(cartTotal()));
    if (d.comentarios) lines.push("", "*Comentarios:* " + d.comentarios);
    lines.push("", "Quedo atento/a a la confirmación. ¡Gracias!");
    return lines.join("\n");
  }
  function copyText(text, done) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta); done(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    else fallback();
  }

  /* ---------- Página: Inicio ---------- */
  function initHome() {
    var g = $("#featured-grid"); if (!g) return;
    var feat = PRODUCTS.filter(function (p) { return p.destacado; });
    if (!feat.length) feat = PRODUCTS.slice(0, 4);
    g.innerHTML = feat.map(productCard).join("");
    var tiles = $("#cat-tiles");
    if (tiles) tiles.innerHTML = CATS.map(function (c) {
      return '<a class="cat-tile" href="menu.html#' + esc(c.id) + '"><img src="' + esc(c.img) + '" alt="' + esc(c.nombre) + '" loading="lazy" width="400" height="400"><span>' + esc(c.nombre) + '</span></a>';
    }).join("");
    var note = $("#example-note"); if (note && !CFG.avisoPreciosEjemplo) note.hidden = true;
  }

  /* ---------- Página: Menú ---------- */
  function initMenu() {
    var root = $("#menu-root"); if (!root) return;
    var chipsHost = $("#menu-chips");
    chipsHost.innerHTML = '<button class="chip is-active" type="button" data-filter="all">Todos</button>' +
      CATS.map(function (c) { return '<button class="chip" type="button" data-filter="' + esc(c.id) + '">' + esc(c.nombre) + '</button>'; }).join("");
    root.innerHTML = CATS.map(function (c) {
      var items = PRODUCTS.filter(function (p) { return p.categoria === c.id; });
      return '<section class="acc is-open" id="' + esc(c.id) + '" data-cat="' + esc(c.id) + '">' +
        '<button class="acc-btn" type="button" aria-expanded="true" aria-controls="panel-' + esc(c.id) + '">' +
        '<span class="acc-thumb"><img src="' + esc(c.img) + '" alt="" width="74" height="74"></span>' +
        '<span class="acc-title"><h2>' + esc(c.nombre) + '</h2><span>' + esc(c.descripcion) + ' · ' + items.length + (items.length === 1 ? ' opción' : ' opciones') + '</span></span>' +
        '<span class="acc-caret">' + ICON.chevron + '</span></button>' +
        '<div class="acc-panel" id="panel-' + esc(c.id) + '"><div><div class="acc-content"><div class="grid grid--products">' +
        (items.length ? items.map(productCard).join("") : '<p class="empty-filter">Pronto habrá productos en esta categoría.</p>') +
        '</div></div></div></div></section>';
    }).join("");

    var note = $("#example-note"); if (note && !CFG.avisoPreciosEjemplo) note.hidden = true;

    function setFilter(f, scroll) {
      $$(".chip", chipsHost).forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-filter") === f); });
      $$(".acc", root).forEach(function (a) {
        var match = f === "all" || a.getAttribute("data-cat") === f;
        a.hidden = !match;
        if (match && f !== "all") setAcc(a, true);
      });
      if (scroll) {
        var target = f === "all" ? $("#menu-start") : $("#" + f);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    function setAcc(a, open) {
      a.classList.toggle("is-open", open);
      var b = $(".acc-btn", a); if (b) b.setAttribute("aria-expanded", String(open));
    }
    chipsHost.addEventListener("click", function (e) {
      var c = e.target.closest(".chip"); if (!c) return;
      var f = c.getAttribute("data-filter");
      setFilter(f, true);
      if (history.replaceState) history.replaceState(null, "", f === "all" ? "menu.html" : "menu.html#" + f);
    });
    root.addEventListener("click", function (e) {
      var b = e.target.closest(".acc-btn"); if (!b) return;
      var a = b.parentNode; setAcc(a, !a.classList.contains("is-open"));
    });
    function fromHash() {
      var h = (location.hash || "").replace("#", "");
      if (h && catById(h)) setFilter(h, true); else if (!h) setFilter("all", false);
    }
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  /* ---------- Página: Pedidos ---------- */
  function initOrder() {
    var form = $("#order-form"); if (!form) return;
    var itemsBox = $("#order-items"), totalsBox = $("#order-totals"), errBox = $("#items-error");
    var sel = $("#add-product");
    sel.innerHTML = '<option value="">Elige un postre…</option>' + CATS.map(function (c) {
      return '<optgroup label="' + esc(c.nombre) + '">' + PRODUCTS.filter(function (p) { return p.categoria === c.id; }).map(function (p) {
        return '<option value="' + esc(p.id) + '">' + esc(p.nombre) + ' — ' + money(p.precio) + '</option>';
      }).join("") + '</optgroup>';
    }).join("");

    window.__renderOrderPage = function () {
      if (!cart.length) { itemsBox.innerHTML = emptyHTML(true); totalsBox.innerHTML = ""; }
      else { itemsBox.innerHTML = itemsHTML(true); totalsBox.innerHTML = totalsHTML(); errBox.hidden = true; }
      var clr = $("#clear-cart"); if (clr) clr.hidden = !cart.length;
    };
    window.__renderOrderPage();

    $("#add-line").addEventListener("click", function () {
      if (!sel.value) { toast("Elige primero un postre de la lista."); sel.focus(); return; }
      var p = productById(sel.value); addToCart(sel.value, 1); bumpCart();
      toast("«" + p.nombre + "» se agregó a tu pedido", { img: p.img }); sel.value = "";
    });
    $("#clear-cart").addEventListener("click", function () { clearCart(); toast("Se vació tu pedido."); });

    var date = $("#f-fecha");
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    var now = new Date(); date.min = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

    var addrField = $("#f-direccion-wrap");
    function mode() { var r = $('input[name="modalidad"]:checked', form); return r ? r.value : "recoger"; }
    function syncMode() { addrField.hidden = mode() !== "entrega"; }
    $$('input[name="modalidad"]', form).forEach(function (r) { r.addEventListener("change", syncMode); });
    syncMode();

    function setErr(id, msg) {
      var f = $("#" + id).closest(".field"); f.classList.toggle("has-error", !!msg);
      var e = $(".err", f); if (e && msg) e.textContent = msg;
    }
    $$(".input, .select, .textarea", form).forEach(function (el) {
      el.addEventListener("input", function () { var f = el.closest(".field"); if (f) f.classList.remove("has-error"); });
    });

    function collect() {
      var m = mode();
      var parts = ($("#f-fecha").value || "").split("-");
      return {
        nombre: $("#f-nombre").value.trim(), telefono: $("#f-telefono").value.trim(),
        fecha: parts.length === 3 ? parts[2] + "/" + parts[1] + "/" + parts[0] : "",
        fechaISO: $("#f-fecha").value, hora: $("#f-hora").value,
        modalidad: m === "entrega" ? "Entrega a domicilio (a coordinar)" : "Recoger",
        direccion: m === "entrega" ? $("#f-direccion").value.trim() : "", comentarios: $("#f-comentarios").value.trim()
      };
    }
    function validate(d) {
      var ok = true, first = null;
      function bad(id, msg) { setErr(id, msg); ok = false; if (!first) first = $("#" + id); }
      setErr("f-nombre", ""); setErr("f-telefono", ""); setErr("f-fecha", ""); setErr("f-direccion", "");
      if (d.nombre.length < 2) bad("f-nombre", "Escribe tu nombre.");
      if (digits(d.telefono).length < 7) bad("f-telefono", "Escribe un número de teléfono válido.");
      if (!d.fechaISO) bad("f-fecha", "Elige la fecha de entrega.");
      else if (d.fechaISO < date.min) bad("f-fecha", "La fecha no puede ser anterior a hoy.");
      if (mode() === "entrega" && d.direccion.length < 5) bad("f-direccion", "Escribe la dirección o el punto de entrega.");
      if (!cart.length) { errBox.hidden = false; ok = false; if (!first) first = sel; }
      if (first) first.focus();
      return ok;
    }

    var modal = $("#review-modal"), pending = null;
    function openModal() { modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; setTimeout(function () { $("#modal-close").focus(); }, 60); }
    function closeModal() { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
    $("#modal-close").addEventListener("click", closeModal);
    $("#modal-back").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = collect(); if (!validate(d)) { toast("Revisa los campos marcados."); return; }
      pending = { data: d, text: buildOrderMessage(d) };
      var rows = [["Cliente", d.nombre], ["Teléfono", d.telefono], ["Fecha", d.fecha], ["Hora", d.hora || "Sin hora definida"], ["Modalidad", d.modalidad]];
      if (d.direccion) rows.push(["Dirección", d.direccion]);
      if (d.comentarios) rows.push(["Comentarios", d.comentarios]);
      $("#review-details").innerHTML = rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join("");
      $("#review-items").innerHTML = reviewItemsHTML() + totalsHTML();
      $("#review-msg").textContent = pending.text;
      $("#no-number-alert").hidden = !!digits(CFG.whatsapp);
      openModal();
    });

    $("#send-wa").addEventListener("click", function () {
      if (!pending) return;
      window.open(waLink(pending.text), "_blank", "noopener");
      toast("Se abrió WhatsApp con tu pedido. Envíalo desde allí para completarlo.");
    });
    $("#copy-msg").addEventListener("click", function () {
      if (!pending) return;
      copyText(pending.text, function (ok) { toast(ok ? "Mensaje copiado." : "No se pudo copiar. Selecciona el texto y cópialo."); });
    });
  }

  /* ---------- Página: Contacto ---------- */
  function initContact() {
    var host = $("#contact-cards"); if (!host) return;
    function card(icon, title, value, href, btn) {
      return '<article class="contact-card"><span class="ico">' + icon + '</span><h3>' + title + '</h3>' +
        (value ? '<p>' + esc(value) + '</p>' : '<p><span class="pending">Próximamente</span></p>') +
        (href ? '<a class="btn btn--ghost btn--sm" href="' + esc(href) + '" ' + (href.indexOf("mailto:") === 0 ? "" : 'target="_blank" rel="noopener"') + '>' + btn + '</a>'
              : '<span class="btn btn--ghost btn--sm is-disabled" aria-disabled="true">' + btn + '</span>') + '</article>';
    }
    var num = digits(CFG.whatsapp);
    host.innerHTML =
      card(ICON.whatsapp, "WhatsApp", num ? "+" + num : "", num ? "https://wa.me/" + num : "", "Escribir por WhatsApp") +
      card(ICON.instagram, "Instagram", CFG.instagramUsuario, CFG.instagramUrl, "Ver Instagram") +
      card(ICON.mail, "Correo electrónico", CFG.correo, CFG.correo ? "mailto:" + CFG.correo : "", "Enviar correo") +
      card(ICON.pin, "Ubicación", CFG.ubicacion, "", "Ubicación por confirmar");

    var f = $("#quick-form");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = $("#q-nombre"), m = $("#q-mensaje"), ok = true;
      [n, m].forEach(function (el) { var fld = el.closest(".field"); var bad = el.value.trim().length < 2; fld.classList.toggle("has-error", bad); if (bad) ok = false; });
      if (!ok) return;
      var text = "Hola, soy " + n.value.trim() + ".\n\n" + m.value.trim();
      window.open(waLink(text), "_blank", "noopener");
      toast(digits(CFG.whatsapp) ? "Se abrió WhatsApp con tu mensaje." : "Se abrió WhatsApp. Elige el contacto de The Bliss Spot.");
    });
  }

  /* ---------- Aparición suave ---------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Arranque ---------- */
  function start() {
    buildHeader(); buildFooter(); buildDrawer();
    bindGlobal();
    initHome(); initMenu(); initOrder(); initContact();
    refreshCartUI();
    initReveal();
    var h = $(".site-header"); if (h) h.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
