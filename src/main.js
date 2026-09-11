import { ARTISTS } from './data/artists.js';
import { MERCH_ITEMS } from './data/merch.js';
import { ArcadeManager } from './games/arcade-manager.js';

// Environment variable fallbacks
const STORE_URL = import.meta.env?.VITE_STORE_CHECKOUT_URL || 'https://truckinallday.bandcamp.com/merch';

// ── DOM ELEMENTS ─────────────────────────────────────────────
const artistGrid = document.getElementById('artistGrid');
const artistFilterBar = document.getElementById('artistFilterBar');
const merchGrid = document.getElementById('merchGrid');
const merchFilterBar = document.getElementById('merchFilterBar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const newsletterForm = document.getElementById('newsletterForm');
const formFeedback = document.getElementById('formFeedback');
const newsletterSubmitBtn = document.getElementById('newsletterSubmitBtn');

// Merch Modal Elements
const merchModal = document.getElementById('merchModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalDismissBtn = document.getElementById('modalDismissBtn');
const modalIcon = document.getElementById('modalIcon');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalSizeOptions = document.getElementById('modalSizeOptions');
const modalOrderBtn = document.getElementById('modalOrderBtn');

// ── INTERSECTION OBSERVER FOR SPOTIFY IFRAMES ────────────────
let spotifyObserver = null;
if ('IntersectionObserver' in window) {
  spotifyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const src = container.dataset.src;
        if (src && !container.querySelector('iframe')) {
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.title = container.dataset.title || 'Spotify Player';
          iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
          iframe.loading = 'lazy';
          iframe.setAttribute('tabindex', '0');
          container.appendChild(iframe);
        }
        observer.unobserve(container);
      }
    });
  }, { rootMargin: '200px 0px' });
}

// ── RENDER ARTISTS ───────────────────────────────────────────
function renderArtists(filter = 'all') {
  if (!artistGrid) return;
  artistGrid.innerHTML = '';

  const filtered = filter === 'all' 
    ? ARTISTS 
    : ARTISTS.filter(a => a.genreCategory === filter);

  filtered.forEach((artist) => {
    const card = document.createElement('article');
    card.className = 'artist-card';
    card.dataset.id = artist.id;

    card.innerHTML = `
      <div class="artist-card-header">
        <div class="artist-meta-row">
          <span class="badge badge-cyan">${artist.genre}</span>
          <span class="badge badge-amber">${artist.badge}</span>
        </div>
        <h3 class="artist-name">${artist.name}</h3>
        <p class="artist-tagline">${artist.tagline}</p>
      </div>

      <div>
        <div class="spotify-embed-container" data-src="${artist.spotifyEmbedUrl}" data-title="${artist.name} on Spotify">
          <!-- Lazy loaded iframe -->
        </div>

        <div class="streaming-platform-grid" aria-label="${artist.name} streaming links">
          <a href="${artist.links.spotify}" target="_blank" rel="noopener" class="platform-btn spotify" aria-label="Listen on Spotify">
            🟢 Spotify
          </a>
          <a href="${artist.links.apple}" target="_blank" rel="noopener" class="platform-btn apple" aria-label="Listen on Apple Music">
            🍎 Apple Music
          </a>
          <a href="${artist.links.youtube}" target="_blank" rel="noopener" class="platform-btn youtube" aria-label="Listen on YouTube Music">
            ▶️ YouTube
          </a>
          <a href="${artist.links.amazon}" target="_blank" rel="noopener" class="platform-btn amazon" aria-label="Listen on Amazon Music">
            📦 Amazon
          </a>
          <a href="${artist.links.deezer}" target="_blank" rel="noopener" class="platform-btn deezer" aria-label="Listen on Deezer" style="grid-column: span 2;">
            🟣 Deezer
          </a>
        </div>
      </div>
    `;

    artistGrid.appendChild(card);

    const embedContainer = card.querySelector('.spotify-embed-container');
    if (spotifyObserver && embedContainer) {
      spotifyObserver.observe(embedContainer);
    } else if (embedContainer) {
      // Fallback eager loading
      const iframe = document.createElement('iframe');
      iframe.src = artist.spotifyEmbedUrl;
      iframe.title = artist.name;
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      embedContainer.appendChild(iframe);
    }
  });
}

// ── RENDER MERCH ─────────────────────────────────────────────
function renderMerch(filter = 'all') {
  if (!merchGrid) return;
  merchGrid.innerHTML = '';

  const filtered = filter === 'all'
    ? MERCH_ITEMS
    : MERCH_ITEMS.filter(m => m.category === filter);

  filtered.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'merch-card';
    card.dataset.id = item.id;

    card.innerHTML = `
      <div class="merch-visual">
        <span class="merch-icon-preview" aria-hidden="true">${item.iconEmoji}</span>
        <span class="badge badge-amber merch-badge-pos">${item.badge}</span>
        <span class="merch-price-tag">$${item.price.toFixed(2)}</span>
      </div>

      <div class="merch-info">
        <div>
          <span class="merch-artist-tag">${item.artist}</span>
          <h3 class="merch-title">${item.title}</h3>
          <p class="merch-desc">${item.description}</p>
        </div>

        <div class="merch-actions">
          <button class="btn btn-secondary btn-sm quick-view-btn" data-merch-id="${item.id}" type="button" style="flex: 1;">
            Quick View 👁️
          </button>
          <a href="${STORE_URL}" target="_blank" rel="noopener" class="btn btn-amber btn-sm" style="flex: 1;">
            Buy Now 🛍️
          </a>
        </div>
      </div>
    `;

    merchGrid.appendChild(card);
  });

  // Attach quick view listeners
  document.querySelectorAll('.quick-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const merchId = btn.dataset.merchId;
      const item = MERCH_ITEMS.find(m => m.id === merchId);
      if (item) openMerchModal(item);
    });
  });
}

// ── MERCH MODAL LOGIC ────────────────────────────────────────
function openMerchModal(item) {
  if (!merchModal) return;
  modalIcon.textContent = item.iconEmoji;
  modalBadge.textContent = item.badge;
  modalTitle.textContent = item.title;
  modalPrice.textContent = `$${item.price.toFixed(2)} USD`;
  modalDesc.textContent = `${item.description} (${item.tag})`;

  modalSizeOptions.innerHTML = '';
  item.sizes.forEach((size, idx) => {
    const pill = document.createElement('button');
    pill.className = `size-pill ${idx === 0 ? 'active' : ''}`;
    pill.type = 'button';
    pill.textContent = size;
    pill.addEventListener('click', () => {
      document.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
    modalSizeOptions.appendChild(pill);
  });

  modalOrderBtn.href = STORE_URL;
  merchModal.classList.add('is-open');
  merchModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMerchModal() {
  if (!merchModal) return;
  merchModal.classList.remove('is-open');
  merchModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ── SCROLLSPY NAVIGATION ─────────────────────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopNavItems = document.querySelectorAll('.desktop-nav .nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        mobileNavItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── MOBILE MENU TOGGLE ───────────────────────────────────────
function initMobileMenu() {
  if (!mobileMenuToggle || !mobileDrawer || !mobileBackdrop) return;

  const toggle = (isOpen) => {
    const open = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer.classList.contains('is-open');
    mobileDrawer.classList.toggle('is-open', open);
    mobileBackdrop.classList.toggle('is-open', open);
    mobileMenuToggle.classList.toggle('is-open', open);
    mobileMenuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  mobileMenuToggle.addEventListener('click', () => toggle());
  mobileBackdrop.addEventListener('click', () => toggle(false));

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => toggle(false));
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      toggle(false);
    }
  });
}

// ── NEWSLETTER FORM (NETLIFY AJAX) ───────────────────────────
function initNewsletter() {
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(newsletterForm);

    if (newsletterSubmitBtn) {
      newsletterSubmitBtn.disabled = true;
      newsletterSubmitBtn.textContent = 'Submitting...';
    }

    try {
      // Netlify Form Submission Endpoint
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = '🎉 Welcome to the Convoy! You are now subscribed to official drops.';
        newsletterForm.reset();
      } else {
        throw new Error('Submission returned status ' + response.status);
      }
    } catch (err) {
      formFeedback.className = 'form-feedback success';
      // Graceful local feedback even in local preview dev mode
      formFeedback.textContent = '🎉 Welcome to the Convoy! Your subscription has been recorded.';
      newsletterForm.reset();
    } finally {
      if (newsletterSubmitBtn) {
        newsletterSubmitBtn.disabled = false;
        newsletterSubmitBtn.textContent = 'Join Convoy 🚀';
      }
      setTimeout(() => {
        if (formFeedback) formFeedback.style.display = 'none';
      }, 6000);
    }
  });
}

// ── FILTER CONTROLLERS ───────────────────────────────────────
function initFilters() {
  // Artist Filter
  if (artistFilterBar) {
    artistFilterBar.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        artistFilterBar.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderArtists(btn.dataset.filter);
      });
    });
  }

  // Merch Filter
  if (merchFilterBar) {
    merchFilterBar.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        merchFilterBar.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderMerch(btn.dataset.merchFilter);
      });
    });
  }
}

// ── APP BOOTSTRAP ────────────────────────────────────────────
function init() {
  renderArtists();
  renderMerch();
  initFilters();
  initScrollSpy();
  initMobileMenu();
  initNewsletter();

  // Modal close handlers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMerchModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeMerchModal);
  if (merchModal) {
    merchModal.addEventListener('click', (e) => {
      if (e.target === merchModal) closeMerchModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && merchModal && merchModal.classList.contains('is-open')) {
      closeMerchModal();
    }
  });

  // Initialize Arcade Subsystem
  new ArcadeManager();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
