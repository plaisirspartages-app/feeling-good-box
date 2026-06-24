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
    el.innerHTML = window.FGB_LOGO + text;
  });
}

/* ---- Burger menu ---- */
function fgbBurger() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('navMenu');
  const backdrop = document.getElementById('navBackdrop');
  if (!burger || !menu) return;
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
  if (backdrop) backdrop.addEventListener('click', close);
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
  
  // 1. Mettre à jour le badge du menu
  const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartBadges = document.querySelectorAll('.cart-count');
  cartBadges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
  });

  // 2. Remplir le corps du panier coulissant
  const drawerBody = document.getElementById('cartDrawerBody');
  const totalAmountEl = document.getElementById('cartTotalAmount');
  
  if (drawerBody) {
    if (cart.length === 0) {
      drawerBody.innerHTML = `<p style="text-align:center; color:var(--ink-soft); margin-top:40px;">Ton panier est encore vide... 🌥️</p>`;
      if (totalAmountEl) totalAmountEl.textContent = "0€";
    } else {
      let html = "";
      let totalCommande = 0;

      cart.forEach((item, index) => {
        totalCommande += item.price * item.quantity;
        html += `
          <div class="cart-item">
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">${item.price}€ x ${item.quantity}</div>
              <button class="cart-item-remove" onclick="removeFromCart(${index})">Supprimer</button>
            </div>
          </div>
        `;
      });
      
      drawerBody.innerHTML = html;
      if (totalAmountEl) totalAmountEl.textContent = `${totalCommande}€`;
    }
  }
}

// Ajouter au panier ET ouvrir le volet
function addToCart(boxId, boxName, boxPrice, stripePriceId) {
  let cart = getCart();
  
  const existingItem = cart.find(item => item.id === boxId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ 
      id: boxId, 
      name: boxName, 
      price: parseFloat(boxPrice), 
      stripePriceId: stripePriceId,
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

// Fonction pour supprimer un article
window.removeFromCart = function(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

// Écouteur de clics pour l'ajout au panier et la gestion du volet
function initCartEvents() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const closeBtn = document.getElementById('cartClose');
  const navCartBtn = document.getElementById('navCartBtn');

  document.querySelectorAll('[data-box-id]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); 
      const boxId = button.getAttribute('data-box-id');
      const boxName = button.getAttribute('data-box-name');
      const boxPrice = button.getAttribute('data-box-price');
      const stripePriceId = button.getAttribute('data-stripe-price-id');
      
      if (boxId && boxName && boxPrice) {
        addToCart(boxId, boxName, boxPrice, stripePriceId);
      }
    });
  });

  const closeDrawer = () => {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  if (navCartBtn) {
    navCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('open');
      }
    });
  }
}


/* ============================================================
   GESTION DE LA VALIDATION DU PANIER — LIEN UNIQUE STRIPE 39€
   ============================================================ */
const checkoutBtn = document.getElementById('cartCheckoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    
    const cart = getCart();

    if (cart.length === 0) {
      alert("Oups ! Ton panier est vide. Choisis une box avant de valider ! 🌤️");
      return;
    }

    const itemToPay = cart[0];
    const quantity = itemToPay.quantity;
    const boxName = itemToPay.name; 

    const baseStripeUrl = "https://buy.stripe.com/test_4gM7sL4Nq7NBc3kbuvdIA00"; 

    const finalStripeUrl = `${baseStripeUrl}?quantity=${quantity}&client_reference_id=${encodeURIComponent(boxName)}`;

    console.log("Propulsion vers Stripe pour :", boxName, "| Quantité :", quantity);
    window.location.href = finalStripeUrl;
  });
}


/* ============================================================
   LOGIQUE DE LA PAGE OFFRIR.HTML
   ============================================================ */

let selectedFormula = "unique";

function initGiftPage() {
  const formSubmitBtn = document.getElementById('btn-final-submit');
  if (!formSubmitBtn) return;

  const cart = getCart();
  let currentBox = cart[cart.length - 1]; 

  if (!currentBox) {
    currentBox = { id: "plus-belle-la-vie", name: "Plus belle la vie", price: 39.00 };
  }

  document.querySelectorAll('.btn-choose-formula').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedFormula = btn.getAttribute('data-formula');
      
      if (selectedFormula === "3-mois") {
        formSubmitBtn.textContent = "Ajouter l'abonnement au panier (87€) →";
      } else if (selectedFormula === "carte") {
        formSubmitBtn.textContent = "Ajouter la carte au panier →";
      } else {
        formSubmitBtn.textContent = "Ajouter la box au panier (39€) →";
      }
    });
  });

  formSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const giftTo = document.getElementById('f-to') ? document.getElementById('f-to').value.trim() : "";
    const giftMsg = document.getElementById('f-msg') ? document.getElementById('f-msg').value.trim() : "";
    const giftFrom = document.getElementById('f-from') ? document.getElementById('f-from').value.trim() : "";
    const giftDate = document.getElementById('f-date') ? document.getElementById('f-date').value : "";
    
    const activeSwatch = document.querySelector('#swatches .swatch[aria-checked="true"]');
    const giftVisual = activeSwatch ? activeSwatch.getAttribute('title') : 'Standard';

    if (!giftTo || !giftMsg || !giftFrom) {
      alert("N'oublie pas de remplir les petits mots pour ta carte cadeau ! ✨");
      return;
    }

    const finalGiftItem = {
      id: `${currentBox.id}_${selectedFormula}`, 
      boxId: currentBox.id,
      boxName: currentBox.name,
      formula: selectedFormula,
      price: selectedFormula === "3-mois" ? 87.00 : 39.00, 
      personalization: {
        to: giftTo,
        message: giftMsg,
        from: giftFrom,
        date: giftDate,
        visual: giftVisual
      },
      quantity: 1
    };

    localStorage.setItem('fgb_cart', JSON.stringify([finalGiftItem]));
    updateCartUI();

    alert(`Votre cadeau personnalisé pour ${giftTo} a bien été configuré !`);
  });
}


/* ============================================================
   LANCEMENT UNIQUE ET SÉCURISÉ (DOM Ready)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  fgbHydrateLogos();
  fgbBurger();
  fgbReveal();
  
  try {
    initCartEvents();
    updateCartUI();
    initGiftPage();
  } catch (error) {
    console.error("Erreur e-commerce ignorée pour protéger l'affichage :", error);
  }
  
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});