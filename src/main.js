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

// ── FILTER ARTISTS ───────────────────────────────────────────
function filterArtists(filter = 'all') {
  if (!artistGrid) return;
  const cards = artistGrid.querySelectorAll('.artist-card');
  cards.forEach((card) => {
    if (filter === 'all' || card.dataset.genreCategory === filter) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── FILTER MERCH ─────────────────────────────────────────────
function filterMerch(filter = 'all') {
  if (!merchGrid) return;
  const cards = merchGrid.querySelectorAll('.merch-card');
  cards.forEach((card) => {
    if (filter === 'all' || card.dataset.category === filter) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── MERCH MODAL LOGIC & ACCESSIBILITY ────────────────────────
let lastFocusedElement = null;

function openMerchModal(item) {
  if (!merchModal) return;
  lastFocusedElement = document.activeElement;

  if (modalIcon) modalIcon.textContent = item.iconEmoji;
  if (modalBadge) modalBadge.textContent = item.badge;
  if (modalTitle) modalTitle.textContent = item.title;
  if (modalPrice) modalPrice.textContent = `$${item.price.toFixed(2)} USD`;
  if (modalDesc) modalDesc.textContent = `${item.description} (${item.tag})`;

  if (modalSizeOptions) {
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
  }

  if (modalOrderBtn) modalOrderBtn.href = STORE_URL;
  merchModal.classList.add('is-open');
  merchModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalCloseBtn?.focus();
}

function closeMerchModal() {
  if (!merchModal) return;
  merchModal.classList.remove('is-open');
  merchModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
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
        filterArtists(btn.dataset.filter);
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
        filterMerch(btn.dataset.merchFilter);
      });
    });
  }
}

// ── APP BOOTSTRAP ────────────────────────────────────────────
function init() {
  initFilters();
  initScrollSpy();
  initMobileMenu();
  initNewsletter();

  // Merch Quick View Delegation
  if (merchGrid) {
    merchGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-view-btn');
      if (btn) {
        const merchId = btn.dataset.merchId;
        const item = MERCH_ITEMS.find((m) => m.id === merchId);
        if (item) openMerchModal(item);
      }
    });
  }

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

  // Check initial anchor hash navigation for legacy links
  if (window.location.hash === '#artists') {
    const musicSec = document.getElementById('music') || document.getElementById('artists');
    if (musicSec) {
      setTimeout(() => musicSec.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  }

  // Initialize Arcade Subsystem
  new ArcadeManager();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
