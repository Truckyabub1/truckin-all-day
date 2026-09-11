import { ARTISTS } from './data/artists.js';
import { ArcadeManager } from './games/arcade-manager.js';

// ── DOM ELEMENTS ─────────────────────────────────────────────
const artistGrid = document.getElementById('artistGrid');
const artistFilterBar = document.getElementById('artistFilterBar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileBackdrop = document.getElementById('mobileBackdrop');

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

// ── FILTER CONTROLLERS ───────────────────────────────────────
function initFilters() {
  if (artistFilterBar) {
    artistFilterBar.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        artistFilterBar.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        filterArtists(btn.dataset.filter);
      });
    });
  }
}

// ── APP BOOTSTRAP ────────────────────────────────────────────
function init() {
  initFilters();
  initScrollSpy();
  initMobileMenu();

  // Check initial anchor hash navigation for legacy links
  if (window.location.hash === '#artists') {
    const musicSec = document.getElementById('music') || document.getElementById('artists');
    if (musicSec) {
      setTimeout(() => musicSec.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  }

  // Initialize Arcade Subsystem (All 5 Games)
  new ArcadeManager();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
