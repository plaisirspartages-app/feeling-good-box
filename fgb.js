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
  <!-- rays -->
  <g stroke="#FF9E2C" stroke-width="2.1" stroke-linecap="round">
    <line x1="26" y1="2.5" x2="26" y2="7.5"/>
    <line x1="14.5" y1="6" x2="17" y2="10"/>
    <line x1="37.5" y1="6" x2="35" y2="10"/>
    <line x1="7" y1="15" x2="11" y2="17.5"/>
    <line x1="45" y1="15" x2="41" y2="17.5"/>
  </g>
  <!-- sparkles -->
  <g fill="#FFC23D">
    <path d="M9 9 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1-2.4 -2.4-1 2.4-1z" opacity=".8"/>
    <path d="M43 11 l.7 1.7 1.7.7 -1.7.7 -.7 1.7 -.7-1.7 -1.7-.7 1.7-.7z" opacity=".7"/>
  </g>
  <!-- sun -->
  <circle cx="26" cy="20" r="10.5" fill="url(#fgbSun)"/>
  <!-- face -->
  <circle cx="22.4" cy="18.5" r="1.5" fill="#7A4A1E"/>
  <circle cx="29.6" cy="18.5" r="1.5" fill="#7A4A1E"/>
  <path d="M21.5 22.5 Q26 26.5 30.5 22.5" stroke="#7A4A1E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <!-- open box -->
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

/* Identity is locked: Manifesto hero + Solaire palette (set on <body>). */

document.addEventListener('DOMContentLoaded', () => {
  fgbHydrateLogos();
  fgbBurger();
  fgbReveal();
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
});
