/* ============================================================
   FEELING GOOD BOX — shared behavior
   ============================================================ */

/* ---- Logo mark: smiling sun rising out of an open box ---- */
window.FGB_LOGO = `
<svg class="logo-mark" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="fgbSun" cx="42%" cy="38%" r="68%">
      <stop offset="0%" stop-color="#FFD96B"/>
      <stop offset="55%" stop-color="#FFC23D"/>
      <stop offset="100%" stop-color="#FF9E2C"/>
    </radialGradient>
  </defs>
  <g stroke="#FF9E2C" stroke-width="2.1" stroke-linecap="round">
    <line x1="26" y1="2.5" x2="26" y2="7.5"/>
    <line x1="14.5" y1="6" x2="17" y2="10"/>
    <line x1="37.5" y1="6" x2="35" y2="10"/>
    <line x1="7" y1="15" x2="11" y2="17.5"/>
    <line x1="45" y1="15" x2="41" y2="17.5"/>
  </g>
  <g fill="#FFC23D">
    <path d="M9 9 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1-2.4 -2.4-1 2.4-1z" opacity=".8"/>
    <path d="M43 11 l.7 1.7 1.7.7 -1.7.7 -.7 1.7 -.7-1.7 -1.7-.7 1.7-.7z" opacity=".7"/>
  </g>
  <circle cx="26" cy="20" r="10.5" fill="url(#fgbSun)"/>
  <circle cx="22.4" cy="18.5" r="1.5" fill="#7A4A1E"/>
  <circle cx="29.6" cy="18.5" r="1.5" fill="#7A4A1E"/>
  <path d="M21.5 22.5 Q26 26.5 30.5 22.5" stroke="#7A4A1E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M11 30 L26 35 L41 30 L37 47 L15 47 Z" fill="#fff" stroke="#B97A5C" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M11 30 L16.5 25 L31 29 L26 35 Z" fill="#FBE6C8" stroke="#B97A5C" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M41 30 L35.5 25 L21 29" fill="none" stroke="#B97A5C" stroke-width="2.2" stroke-linejoin="round"/>
</svg>`;

window.FGB_LOGOTEXT = `<div class="logo-text">Feeling<br>Good Box</div>`;
window.FGB_LOGOTEXT_LINE = `<div class="logo-text logo-text--line">Feeling Good Box</div>`;

function fgbHydrateLogos() {
  document.querySelectorAll('[data-logo]').forEach((el) => {
    const oneLine = el.hasAttribute('data-logo-line');
    const withText = el.hasAttribute('data-logo-text');
    el.classList.add('logo');
    let text = '';
    if (oneLine) text = window.FGB_LOGOTEXT_LINE;
    else if (withText) text = window.FGB_LOGOTEXT;
    el.innerHTML = `<img class="logo-mark" src="logo%20V2.png" alt="Feeling Good Box" />` + text;
  });
}

/* ---- Burger menu ---- */
function fgbBurger() {
  const burger = document.getElementById('navBurger') || document.querySelector('.burger');
  const menu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
  const backdrop = document.getElementById('navBackdrop') || document.querySelector('.nav-backdrop');
  
  if (!burger || !menu) {
    console.warn("Menu Burger : Éléments manquants dans le HTML de cette page.");
    return;
  }
  
  const close = () => {
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  };
  
  const toggle = (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (backdrop) backdrop.classList.toggle('open', open);
  };
  
  burger.addEventListener('click', toggle);
  menu.addEventListener('click', (e) => e.stopPropagation());
  if (backdrop) backdrop.addEventListener('click', close);
  document.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---- Scroll reveal ---- */
function fgbReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach((e) => io.observe(e));
}


/* ============================================================
   FEELING GOOD BOX — Moteur de Panier E-Commerce
   ============================================================ */

/* Crée le volet panier dans le DOM si la page ne l'a pas déjà */
function fgbEnsureCartDrawer() {
  if (document.getElementById('cartDrawer')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="cart-drawer" id="cartDrawer">
      <div class="cart-drawer-header">
        <h2>Mon Panier</h2>
        <button class="cart-drawer-close" id="cartClose" aria-label="Fermer le panier">✕</button>
      </div>
      <div class="cart-drawer-body" id="cartDrawerBody"></div>

      <div class="cart-drawer-footer">
        <div class="cart-shipping-line" id="cartShippingLine" style="display:none;">
          <span>Livraison à domicile (Colissimo)</span>
          <span>2,90€</span>
        </div>
        <div class="cart-total"><span>Total :</span><span id="cartTotalAmount">0€</span></div>
        <button id="cartCheckoutBtn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:15px;border:none;cursor:pointer;">Valider ma commande →</button>
      </div>
    </div>
    <div class="cart-overlay" id="cartOverlay"></div>
  `);
}

// Récupérer le panier
function getCart() {
  const cart = localStorage.getItem('fgb_cart');
  return cart ? JSON.parse(cart) : [];
}

// Sauvegarder le panier et actualiser l'interface
function saveCart(cart) {
  localStorage.setItem('fgb_cart', JSON.stringify(cart));
  updateCartUI();
}

// Mettre à jour visuellement le volet panier et les chiffres
function updateCartUI() {
  const cart = getCart();

  // 1. Badge panier
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });

  // 2. Ligne livraison visible seulement si panier non vide
  const shippingLineEl = document.getElementById('cartShippingLine');
  if (shippingLineEl) shippingLineEl.style.display = cart.length > 0 ? 'flex' : 'none';

  // 3. Corps du panier
  const drawerBody = document.getElementById('cartDrawerBody');
  if (drawerBody) {
    if (cart.length === 0) {
      drawerBody.innerHTML = `<p style="text-align:center; color:var(--ink-soft); margin-top:40px;">Ton panier est encore vide... 🌥️</p>`;
    } else {
      let html = "";
      cart.forEach((item, index) => {
        html += `
          <div class="cart-item">
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">${String(item.price.toFixed(2)).replace('.', ',')} €</div>
            </div>
            <div class="cart-item-qty">
              <button onclick="changeQty(${index}, -1)">−</button>
              <span>${item.quantity}</span>
              <button onclick="changeQty(${index}, +1)">+</button>
            </div>
          </div>
        `;
      });
      drawerBody.innerHTML = html;
    }
  }

  // 4. Recalcul du total avec livraison
  updateCartTotal();
}

function updateCartTotal() {
  const cart = getCart();
  const base = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const shipping = cart.length > 0 ? 2.90 : 0;
  const totalEl = document.getElementById('cartTotalAmount');
  if (totalEl) totalEl.textContent = cart.length > 0 ? `${(base + shipping).toFixed(2).replace('.', ',')} €` : '0 €';
}

// Ajouter au panier ET ouvrir le volet
function addToCart(boxId, boxName, boxPrice, stripePriceId, stripeUrl, stripeUrlHome) {
  let cart = getCart();
  const existing = cart.find(item => item.id === boxId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: boxId,
      name: boxName,
      price: parseFloat(boxPrice),
      stripePriceId: stripePriceId,
      stripeUrl: stripeUrl,
      stripeUrlHome: stripeUrlHome || null,
      quantity: 1
    });
  }
  saveCart(cart);
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('open');
  }
}

// Supprimer un article
window.removeFromCart = function(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

// Modifier la quantité d'un article (+1 / -1, supprime si tombe à 0)
window.changeQty = function(index, delta) {
  let cart = getCart();
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart(cart);
}

// Écouteur de clics pour l'ajout au panier et la gestion du volet
function initCartEvents() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const closeBtn = document.getElementById('cartClose');
  const navCartBtn = document.querySelector('.icon-btn[aria-label="Panier"]');

  document.querySelectorAll('[data-box-id]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const boxId = button.getAttribute('data-box-id');
      const boxName = button.getAttribute('data-box-name');
      const boxPrice = button.getAttribute('data-box-price');
      const stripePriceId = button.getAttribute('data-stripe-price-id');
      const stripeUrl = button.getAttribute('data-stripe-url');
      const stripeUrlHome = button.getAttribute('data-stripe-url-home');
      if (boxId && boxName && boxPrice) {
        addToCart(boxId, boxName, boxPrice, stripePriceId, stripeUrl, stripeUrlHome);
      }
    });
  });


  const openDrawer = () => {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
  };
  const closeDrawer = () => {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  if (navCartBtn) navCartBtn.addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cart = getCart();
      if (cart.length === 0) return;
      const fallback = "https://buy.stripe.com/7sY00c1gT8o3d2DfsT2B205";
      const ref = cart.map(i => `${i.name} ×${i.quantity}`).join(' + ');
      // Si plusieurs types de boxes, on les paie séquentiellement via success.html
      if (cart.length > 1) {
        localStorage.setItem('fgb_pending_cart', JSON.stringify(cart.slice(1)));
      } else {
        localStorage.removeItem('fgb_pending_cart');
      }
      const item = cart[0];
      const baseUrl = (item.stripeUrl && item.stripeUrl !== '#') ? item.stripeUrl : fallback;
      window.location.href = `${baseUrl}?quantity=${item.quantity}&client_reference_id=${encodeURIComponent(ref)}`;
    });
  }
}





/* ============================================================
   LANCEMENT UNIQUE ET SÉCURISÉ (DOM Ready)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  fgbHydrateLogos();
  fgbBurger();
  fgbReveal();
  fgbEnsureCartDrawer();

  try {
    initCartEvents();
    updateCartUI();
  } catch (error) {
    console.error("Erreur e-commerce ignorée pour protéger l'affichage :", error);
  }

  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});