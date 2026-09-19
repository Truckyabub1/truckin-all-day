/**
 * Storefront Controller — Truckin all Day x The Purple Vixon
 * Powered by Fourthwall dynamic e-commerce architecture.
 */

import { STORE_PRODUCTS, ARTISTS_CATALOG, CATEGORIES_CATALOG, CURRENCIES } from '../data/storeProducts.js';
import { renderProductMockup } from './mockups.js';

class StoreApp {
  constructor() {
    this.products = [...STORE_PRODUCTS];
    this.selectedArtist = 'all';
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.activeSort = 'featured';
    this.activeCurrency = localStorage.getItem('tad_currency') || 'USD';
    this.cart = this.loadCart();

    // Modal State
    this.activeModalProduct = null;
    this.modalSelectedColor = null;
    this.modalSelectedSize = null;
    this.modalQty = 1;

    // DOM Elements
    this.productsGridEl = document.getElementById('productsGrid');
    this.resultsCountEl = document.getElementById('resultsCount');
    this.searchInputEl = document.getElementById('storeSearchInput');
    this.sortSelectEl = document.getElementById('storeSortSelect');
    this.artistPillsEl = document.getElementById('artistPillsRow');
    this.categoryTabsEl = document.getElementById('categoryTabsRow');
    this.currencySelectEl = document.getElementById('currencySelect');

    // Cart Elements
    this.cartDrawerEl = document.getElementById('cartDrawer');
    this.cartBackdropEl = document.getElementById('cartBackdrop');
    this.cartTriggerBtn = document.getElementById('cartTriggerBtn');
    this.cartCloseBtn = document.getElementById('cartCloseBtn');
    this.cartItemsListEl = document.getElementById('cartItemsList');
    this.cartCountBadgeEl = document.getElementById('cartCountBadge');
    this.cartSubtotalEl = document.getElementById('cartSubtotal');
    this.cartTotalEl = document.getElementById('cartTotal');
    this.shippingProgressFillEl = document.getElementById('shippingProgressFill');
    this.shippingProgressTextEl = document.getElementById('shippingProgressText');
    this.checkoutBtnEl = document.getElementById('cartCheckoutBtn');

    // Quick View Modal Elements
    this.quickViewBackdrop = document.getElementById('quickViewBackdrop');
    this.quickViewCard = document.getElementById('quickViewCard');
    this.quickViewCloseBtn = document.getElementById('quickViewCloseBtn');

    // Systems Modal Elements
    this.systemsModalBackdrop = document.getElementById('systemsModalBackdrop');
    this.openSystemsModalBtn = document.getElementById('openSystemsModalBtn');
    this.closeSystemsModalBtn = document.getElementById('closeSystemsModalBtn');

    // Toast
    this.toastEl = document.getElementById('storeToast');
    this.toastMessageEl = document.getElementById('toastMessage');

    this.init();
  }

  init() {
    this.setupCurrency();
    this.renderArtistPills();
    this.renderCategoryTabs();
    this.renderProducts();
    this.updateCartUI();
    this.bindEvents();
    this.checkInitialHash();
  }

  /* ── CART PERSISTENCE ─────────────────────────────────────────── */
  loadCart() {
    try {
      const saved = localStorage.getItem('tad_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('tad_cart', JSON.stringify(this.cart));
  }

  /* ── CURRENCY FORMATTER ───────────────────────────────────────── */
  setupCurrency() {
    if (this.currencySelectEl) {
      this.currencySelectEl.value = this.activeCurrency;
      this.currencySelectEl.addEventListener('change', (e) => {
        this.activeCurrency = e.target.value;
        localStorage.setItem('tad_currency', this.activeCurrency);
        this.renderProducts();
        this.updateCartUI();
        if (this.activeModalProduct) {
          this.updateModalPrice();
        }
      });
    }
  }

  formatPrice(amountInUSD) {
    const cur = CURRENCIES[this.activeCurrency] || CURRENCIES.USD;
    const converted = amountInUSD * cur.rate;
    return `${cur.symbol}${converted.toFixed(2)}`;
  }

  /* ── CONTROLS & FILTERS ───────────────────────────────────────── */
  renderArtistPills() {
    if (!this.artistPillsEl) return;
    this.artistPillsEl.innerHTML = ARTISTS_CATALOG.map((artist) => `
      <button 
        type="button"
        class="artist-pill ${this.selectedArtist === artist.id ? 'active' : ''}"
        data-artist-id="${artist.id}"
        aria-pressed="${this.selectedArtist === artist.id}"
      >
        <span>${artist.icon || '🏷️'}</span>
        <span>${artist.name}</span>
        <span class="artist-pill-count">(${artist.count})</span>
      </button>
    `).join('');

    this.artistPillsEl.querySelectorAll('.artist-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedArtist = btn.dataset.artistId;
        this.renderArtistPills();
        this.renderProducts();
      });
    });
  }

  renderCategoryTabs() {
    if (!this.categoryTabsEl) return;
    this.categoryTabsEl.innerHTML = CATEGORIES_CATALOG.map((cat) => `
      <button 
        type="button" 
        class="category-tab ${this.selectedCategory === cat.id ? 'active' : ''}" 
        data-cat-id="${cat.id}"
      >
        ${cat.name}
      </button>
    `).join('');

    this.categoryTabsEl.querySelectorAll('.category-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.catId;
        this.renderCategoryTabs();
        this.renderProducts();
      });
    });
  }

  bindEvents() {
    // Search
    if (this.searchInputEl) {
      this.searchInputEl.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });
    }

    // Sort
    if (this.sortSelectEl) {
      this.sortSelectEl.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.renderProducts();
      });
    }

    // Cart Drawer Toggle
    if (this.cartTriggerBtn) {
      this.cartTriggerBtn.addEventListener('click', () => this.toggleCart(true));
    }
    if (this.cartCloseBtn) {
      this.cartCloseBtn.addEventListener('click', () => this.toggleCart(false));
    }
    if (this.cartBackdropEl) {
      this.cartBackdropEl.addEventListener('click', () => this.toggleCart(false));
    }

    // Modal Close
    if (this.quickViewCloseBtn) {
      this.quickViewCloseBtn.addEventListener('click', () => this.toggleQuickView(false));
    }
    if (this.quickViewBackdrop) {
      this.quickViewBackdrop.addEventListener('click', (e) => {
        if (e.target === this.quickViewBackdrop) this.toggleQuickView(false);
      });
    }

    // Systems Modal
    if (this.openSystemsModalBtn) {
      this.openSystemsModalBtn.addEventListener('click', () => this.toggleSystemsModal(true));
    }
    if (this.closeSystemsModalBtn) {
      this.closeSystemsModalBtn.addEventListener('click', () => this.toggleSystemsModal(false));
    }
    if (this.systemsModalBackdrop) {
      this.systemsModalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.systemsModalBackdrop) this.toggleSystemsModal(false);
      });
    }

    // Escape Key to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleCart(false);
        this.toggleQuickView(false);
        this.toggleSystemsModal(false);
      }
    });
  }

  checkInitialHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#artist-')) {
      const artist = hash.replace('#artist-', '');
      if (ARTISTS_CATALOG.some(a => a.id === artist)) {
        this.selectedArtist = artist;
        this.renderArtistPills();
        this.renderProducts();
      }
    } else if (hash.startsWith('#product-')) {
      const prodId = hash.replace('#product-', '');
      const item = this.products.find(p => p.id === prodId);
      if (item) {
        this.openQuickView(item.id);
      }
    }
  }

  /* ── FILTER & SORT DATA ───────────────────────────────────────── */
  getFilteredProducts() {
    return this.products
      .filter((p) => {
        // Artist filter
        if (this.selectedArtist !== 'all' && p.artistId !== this.selectedArtist) {
          return false;
        }
        // Category filter
        if (this.selectedCategory !== 'all' && p.category !== this.selectedCategory) {
          return false;
        }
        // Search query
        if (this.searchQuery) {
          const matchName = p.name.toLowerCase().includes(this.searchQuery);
          const matchArtist = p.artist.toLowerCase().includes(this.searchQuery);
          const matchTag = p.tagline.toLowerCase().includes(this.searchQuery);
          const matchSpec = p.blankSpec.toLowerCase().includes(this.searchQuery);
          if (!matchName && !matchArtist && !matchTag && !matchSpec) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (this.activeSort === 'price-low') return a.price - b.price;
        if (this.activeSort === 'price-high') return b.price - a.price;
        if (this.activeSort === 'rating') return b.rating - a.rating;
        // Default: featured
        return 0;
      });
  }

  /* ── RENDER PRODUCTS GRID ─────────────────────────────────────── */
  renderProducts() {
    if (!this.productsGridEl) return;

    const filtered = this.getFilteredProducts();

    if (this.resultsCountEl) {
      this.resultsCountEl.textContent = `Showing ${filtered.length} of ${this.products.length} products`;
    }

    if (filtered.length === 0) {
      this.productsGridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="color: var(--text-pure); margin-bottom: 0.5rem;">No products found</h3>
          <p>Try adjusting your search terms or filters to find what you're looking for.</p>
          <button 
            type="button" 
            class="btn-card-quick" 
            style="margin-top: 1rem; padding: 0.6rem 1.2rem;" 
            id="resetFiltersBtn"
          >
            Reset All Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.selectedArtist = 'all';
          this.selectedCategory = 'all';
          this.searchQuery = '';
          if (this.searchInputEl) this.searchInputEl.value = '';
          this.renderArtistPills();
          this.renderCategoryTabs();
          this.renderProducts();
        });
      }
      return;
    }

    this.productsGridEl.innerHTML = filtered.map((product) => {
      const defaultColor = product.colors[0]?.hex || '#1a1c22';
      return `
        <article class="product-card" id="card-${product.id}" data-id="${product.id}">
          <div class="card-media-box" id="media-box-${product.id}">
            <span class="card-badge-top">${product.badge}</span>
            <div class="card-mockup-slot" id="mockup-slot-${product.id}">
              ${renderProductMockup(product, defaultColor)}
            </div>
            <span class="card-blank-tag">${product.mockupType.toUpperCase()}</span>
          </div>

          <div class="card-content">
            <div class="card-meta-row">
              <span class="card-artist-tag">${product.artist}</span>
              <div class="card-rating-wrap" title="${product.rating} out of 5 stars">
                <span>★</span>
                <span>${product.rating}</span>
                <span style="color: var(--text-muted); font-size: 0.7rem;">(${product.reviewsCount})</span>
              </div>
            </div>

            <h3 class="card-title">${product.name}</h3>
            <p class="card-desc">${product.description}</p>

            ${product.colors && product.colors.length > 1 ? `
              <div class="swatches-row" aria-label="Color options for ${product.name}">
                ${product.colors.map((c, idx) => `
                  <button 
                    type="button"
                    class="swatch-btn ${idx === 0 ? 'active' : ''}" 
                    style="background-color: ${c.hex};"
                    title="${c.name}"
                    data-card-id="${product.id}"
                    data-hex="${c.hex}"
                    data-name="${c.name}"
                    aria-label="${c.name}"
                  ></button>
                `).join('')}
              </div>
            ` : ''}

            <div class="card-footer">
              <div class="card-price-group">
                <span class="card-price">${this.formatPrice(product.price)}</span>
                <span class="card-stock-label">● In Stock (${product.stockCount} left)</span>
              </div>

              <div class="card-btn-group">
                <button 
                  type="button" 
                  class="btn-card-quick" 
                  data-action="quickview" 
                  data-id="${product.id}"
                  title="View full specs, art concept, and sizing"
                >
                  Quick View
                </button>
                <button 
                  type="button" 
                  class="btn-card-add" 
                  data-action="add-direct" 
                  data-id="${product.id}"
                  title="Add default variant to bag"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.bindCardInteractions();
  }

  bindCardInteractions() {
    // Interactive Swatches on Card (Updates SVG color live!)
    this.productsGridEl.querySelectorAll('.swatch-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardId = btn.dataset.cardId;
        const hex = btn.dataset.hex;
        const product = this.products.find(p => p.id === cardId);
        if (!product) return;

        // Update active swatch state on card
        const card = document.getElementById(`card-${cardId}`);
        if (card) {
          card.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }

        // Re-render only that specific mockup SVG with new color
        const slot = document.getElementById(`mockup-slot-${cardId}`);
        if (slot) {
          slot.innerHTML = renderProductMockup(product, hex);
        }
      });
    });

    // Quick View Buttons
    this.productsGridEl.querySelectorAll('[data-action="quickview"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.openQuickView(btn.dataset.id);
      });
    });

    // Direct Add to Cart from Card
    this.productsGridEl.querySelectorAll('[data-action="add-direct"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const product = this.products.find(p => p.id === btn.dataset.id);
        if (product) {
          const defaultColor = product.colors[0];
          const defaultSize = product.sizes[0];
          this.addToCart(product, defaultColor, defaultSize, 1);
        }
      });
    });
  }

  /* ── QUICK VIEW MODAL CONTROLLER ──────────────────────────────── */
  openQuickView(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    this.activeModalProduct = product;
    this.modalSelectedColor = product.colors[0] || { name: 'Standard', hex: '#1c1c1e' };
    this.modalSelectedSize = product.sizes[0] || 'Standard';
    this.modalQty = 1;

    this.renderModalContent();
    this.toggleQuickView(true);
  }

  renderModalContent() {
    const p = this.activeModalProduct;
    if (!p) return;

    // Render Left Column (Media & Avant-Garde Art Direction)
    const mediaCol = document.getElementById('modalMediaCol');
    if (mediaCol) {
      mediaCol.innerHTML = `
        <div class="modal-mockup-wrapper" id="modalMockupSlot">
          ${renderProductMockup(p, this.modalSelectedColor.hex)}
        </div>

        <div class="modal-art-box">
          <div class="modal-art-title">
            <span>🎨</span>
            <span>Art Direction & Master Specification</span>
          </div>
          <p class="modal-art-text">${p.artDirectionPrompt}</p>
        </div>
      `;
    }

    // Render Right Column (Specs, Poetic Lore, Sizing, CTA)
    const infoCol = document.getElementById('modalInfoCol');
    if (infoCol) {
      infoCol.innerHTML = `
        <div class="modal-header-meta">
          <span class="card-artist-tag">${p.artist}</span>
          <span class="badge-brand" style="font-size: 0.65rem;">${p.badge}</span>
          <div class="card-rating-wrap" style="margin-left: auto;">
            <span>★</span>
            <span>${p.rating}</span>
            <span style="color: var(--text-muted); font-size: 0.75rem;">(${p.reviewsCount} reviews)</span>
          </div>
        </div>

        <h2 class="modal-product-title">${p.name}</h2>

        <div class="modal-price-row">
          <span class="modal-price" id="modalPriceVal">${this.formatPrice(p.price)}</span>
          <span class="modal-blank-spec">${p.blankSpec}</span>
        </div>

        <!-- Domain Directive Creative Lore -->
        <div class="modal-poetic-lore">
          "${p.poeticConcept}"
          <span class="lore-author-tag">— Creative Direction, Truckin all Day Collective</span>
        </div>

        <!-- Color Selection -->
        ${p.colors && p.colors.length > 0 ? `
          <div class="variant-section">
            <div class="variant-label-row">
              <span>Color Selection:</span>
              <span class="variant-label-val" id="modalColorName">${this.modalSelectedColor.name}</span>
            </div>
            <div class="color-swatch-list">
              ${p.colors.map(c => `
                <button 
                  type="button" 
                  class="modal-swatch-btn ${c.hex === this.modalSelectedColor.hex ? 'active' : ''}" 
                  style="background-color: ${c.hex};" 
                  title="${c.name}"
                  data-hex="${c.hex}"
                  data-name="${c.name}"
                  aria-label="${c.name}"
                ></button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Size Selection -->
        ${p.sizes && p.sizes.length > 0 ? `
          <div class="variant-section">
            <div class="variant-label-row">
              <span>Size Selection:</span>
              <span class="size-chart-link" id="toggleSizeChartBtn">View Size Chart 📏</span>
            </div>
            <div class="size-pill-list">
              ${p.sizes.map(s => `
                <button 
                  type="button" 
                  class="size-pill-btn ${s === this.modalSelectedSize ? 'active' : ''}" 
                  data-size="${s}"
                >
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Hidden Size Chart Accordion -->
        <div id="modalSizeChartBox" style="display: none; background: rgba(0,0,0,0.4); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--cyan-primary); font-weight: 700; margin-bottom: 0.4rem;">OFFICIAL FOURTHWALL GARMENT DIMENSIONS (INCHES)</div>
          <table class="size-chart-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest Width</th>
                <th>Body Length</th>
                <th>Sleeve Length</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>S</td><td>18"</td><td>28"</td><td>16.5"</td></tr>
              <tr><td>M</td><td>20"</td><td>29"</td><td>18"</td></tr>
              <tr><td>L</td><td>22"</td><td>30"</td><td>19.5"</td></tr>
              <tr><td>XL</td><td>24"</td><td>31"</td><td>21"</td></tr>
              <tr><td>2XL</td><td>26"</td><td>32"</td><td>22.5"</td></tr>
              <tr><td>3XL</td><td>28"</td><td>33"</td><td>24"</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Quantity & CTA -->
        <div class="modal-cta-row">
          <div class="qty-stepper">
            <button type="button" class="qty-btn" id="modalQtyMinus" aria-label="Decrease quantity">−</button>
            <span class="qty-display" id="modalQtyDisplay">${this.modalQty}</span>
            <button type="button" class="qty-btn" id="modalQtyPlus" aria-label="Increase quantity">+</button>
          </div>

          <button type="button" class="modal-add-btn" id="modalAddCartBtn">
            <span>🛍️</span>
            <span>Add to Bag</span>
          </button>
        </div>

        <a 
          href="https://the-purple-vixon-shop.fourthwall.com" 
          target="_blank" 
          rel="noopener" 
          class="modal-direct-fourthwall-btn"
          title="Direct checkout on Fourthwall creator platform"
        >
          <span>⚡ Instant Checkout via Fourthwall</span>
        </a>

        <!-- Specs Breakdown -->
        <div style="margin-top: 0.5rem;">
          <h4 style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Garment & Print Standards</h4>
          <ul class="specs-list">
            ${p.specs.map(spec => `
              <li class="spec-item">
                <span class="spec-bullet">✔</span>
                <span>${spec}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;

      this.bindModalInteractions();
    }
  }

  updateModalPrice() {
    const el = document.getElementById('modalPriceVal');
    if (el && this.activeModalProduct) {
      el.textContent = this.formatPrice(this.activeModalProduct.price);
    }
  }

  bindModalInteractions() {
    const p = this.activeModalProduct;
    if (!p) return;

    // Color Swatch Selection inside Modal
    document.querySelectorAll('.modal-swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.modalSelectedColor = { name: btn.dataset.name, hex: btn.dataset.hex };
        const label = document.getElementById('modalColorName');
        if (label) label.textContent = this.modalSelectedColor.name;

        // Re-render the modal mockup with new color
        const slot = document.getElementById('modalMockupSlot');
        if (slot) slot.innerHTML = renderProductMockup(p, this.modalSelectedColor.hex);
      });
    });

    // Size Pill Selection inside Modal
    document.querySelectorAll('.size-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.modalSelectedSize = btn.dataset.size;
      });
    });

    // Toggle Size Chart Accordion
    const chartToggle = document.getElementById('toggleSizeChartBtn');
    const chartBox = document.getElementById('modalSizeChartBox');
    if (chartToggle && chartBox) {
      chartToggle.addEventListener('click', () => {
        const isHidden = chartBox.style.display === 'none';
        chartBox.style.display = isHidden ? 'block' : 'none';
        chartToggle.textContent = isHidden ? 'Hide Size Chart ✕' : 'View Size Chart 📏';
      });
    }

    // Stepper
    const minusBtn = document.getElementById('modalQtyMinus');
    const plusBtn = document.getElementById('modalQtyPlus');
    const display = document.getElementById('modalQtyDisplay');
    if (minusBtn && plusBtn && display) {
      minusBtn.addEventListener('click', () => {
        if (this.modalQty > 1) {
          this.modalQty--;
          display.textContent = this.modalQty;
        }
      });
      plusBtn.addEventListener('click', () => {
        if (this.modalQty < 10) {
          this.modalQty++;
          display.textContent = this.modalQty;
        }
      });
    }

    // Add to Cart from Modal
    const addBtn = document.getElementById('modalAddCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addToCart(p, this.modalSelectedColor, this.modalSelectedSize, this.modalQty);
        this.toggleQuickView(false);
      });
    }
  }

  toggleQuickView(isOpen) {
    if (!this.quickViewBackdrop) return;
    this.quickViewBackdrop.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggleSystemsModal(isOpen) {
    if (!this.systemsModalBackdrop) return;
    this.systemsModalBackdrop.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  /* ── CART LOGIC & DRAWER ───────────────────────────────────────── */
  addToCart(product, color, size, qty = 1) {
    const itemKey = `${product.id}-${color.hex}-${size}`;
    const existingIndex = this.cart.findIndex(i => i.itemKey === itemKey);

    if (existingIndex > -1) {
      this.cart[existingIndex].qty += qty;
    } else {
      this.cart.push({
        itemKey,
        productId: product.id,
        name: product.name,
        artist: product.artist,
        price: product.price,
        colorHex: color.hex,
        colorName: color.name,
        size,
        qty,
        mockupType: product.mockupType,
        blankSpec: product.blankSpec
      });
    }

    this.saveCart();
    this.updateCartUI();
    this.showToast(`Added "${product.name}" (${color.name}, ${size}) to your bag!`);
    this.toggleCart(true);
  }

  updateCartQty(itemKey, delta) {
    const idx = this.cart.findIndex(i => i.itemKey === itemKey);
    if (idx === -1) return;

    this.cart[idx].qty += delta;
    if (this.cart[idx].qty <= 0) {
      this.cart.splice(idx, 1);
    }

    this.saveCart();
    this.updateCartUI();
  }

  removeFromCart(itemKey) {
    this.cart = this.cart.filter(i => i.itemKey !== itemKey);
    this.saveCart();
    this.updateCartUI();
    this.showToast('Item removed from your bag.');
  }

  toggleCart(isOpen) {
    if (!this.cartDrawerEl || !this.cartBackdropEl) return;
    this.cartDrawerEl.classList.toggle('is-open', isOpen);
    this.cartBackdropEl.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  updateCartUI() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotalUSD = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update Badge
    if (this.cartCountBadgeEl) {
      this.cartCountBadgeEl.textContent = totalItems;
      this.cartCountBadgeEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    // Free Shipping Progress ($75 Threshold)
    const thresholdUSD = 75.00;
    const progressPercent = Math.min(100, (subtotalUSD / thresholdUSD) * 100);
    if (this.shippingProgressFillEl) {
      this.shippingProgressFillEl.style.width = `${progressPercent}%`;
    }
    if (this.shippingProgressTextEl) {
      if (subtotalUSD >= thresholdUSD) {
        this.shippingProgressTextEl.innerHTML = `<span>🎉 You qualified for <strong>FREE Express Shipping</strong>!</span>`;
      } else {
        const remaining = thresholdUSD - subtotalUSD;
        this.shippingProgressTextEl.innerHTML = `
          <span>Add <strong>${this.formatPrice(remaining)}</strong> more for <strong>FREE Worldwide Shipping</strong></span>
          <span>${Math.round(progressPercent)}%</span>
        `;
      }
    }

    // Update Totals
    if (this.cartSubtotalEl) {
      this.cartSubtotalEl.textContent = this.formatPrice(subtotalUSD);
    }
    if (this.cartTotalEl) {
      this.cartTotalEl.textContent = this.formatPrice(subtotalUSD);
    }

    // Render Items
    if (this.cartItemsListEl) {
      if (this.cart.length === 0) {
        this.cartItemsListEl.innerHTML = `
          <div class="cart-empty-state">
            <div class="cart-empty-icon">🛍️</div>
            <h3 style="color: var(--text-pure); margin-bottom: 0.25rem;">Your bag is empty</h3>
            <p style="font-size: 0.85rem;">Discover apparel and accessories crafted for our headline artists.</p>
          </div>
        `;
        if (this.checkoutBtnEl) {
          this.checkoutBtnEl.style.opacity = '0.5';
          this.checkoutBtnEl.style.pointerEvents = 'none';
        }
      } else {
        if (this.checkoutBtnEl) {
          this.checkoutBtnEl.style.opacity = '1';
          this.checkoutBtnEl.style.pointerEvents = 'auto';
        }
        this.cartItemsListEl.innerHTML = this.cart.map((item) => {
          const dummyProduct = {
            id: item.productId,
            name: item.name,
            artist: item.artist,
            artistId: item.productId.split('-')[0],
            mockupType: item.mockupType
          };
          return `
            <div class="cart-item">
              <div class="cart-item-thumb">
                ${renderProductMockup(dummyProduct, item.colorHex)}
              </div>
              <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <span class="cart-item-variant">${item.colorName} / Size: ${item.size}</span>
                <div class="cart-item-bottom">
                  <span class="cart-item-price">${this.formatPrice(item.price * item.qty)}</span>
                  <div class="cart-qty-ctrls">
                    <button type="button" class="cart-qty-btn" data-action="minus" data-key="${item.itemKey}">−</button>
                    <span class="cart-qty-num">${item.qty}</span>
                    <button type="button" class="cart-qty-btn" data-action="plus" data-key="${item.itemKey}">+</button>
                    <button type="button" class="cart-item-remove" data-action="remove" data-key="${item.itemKey}" title="Remove item">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        this.cartItemsListEl.querySelectorAll('.cart-qty-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            const delta = btn.dataset.action === 'plus' ? 1 : -1;
            this.updateCartQty(key, delta);
          });
        });

        this.cartItemsListEl.querySelectorAll('.cart-item-remove').forEach((btn) => {
          btn.addEventListener('click', () => {
            this.removeFromCart(btn.dataset.key);
          });
        });
      }
    }
  }

  /* ── TOAST NOTIFICATIONS ───────────────────────────────────────── */
  showToast(message) {
    if (!this.toastEl || !this.toastMessageEl) return;
    this.toastMessageEl.textContent = message;
    this.toastEl.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3200);
  }
}

// ── BOOTSTRAP STORE ────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StoreApp());
} else {
  new StoreApp();
}
