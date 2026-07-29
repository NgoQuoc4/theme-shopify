// Recently Viewed Products Web Component
class RecentlyViewedProducts extends HTMLElement {
  constructor() {
    super();
    this.storageKey = 'recently_viewed_furniture';
    this.container = this.querySelector('.recently-viewed__grid');
    this.maxItems = parseInt(this.dataset.maxItems) || 4;
  }

  connectedCallback() {
    this.recordCurrentProduct();
    this.renderProducts();
  }

  recordCurrentProduct() {
    const handle = this.dataset.productHandle;
    if (!handle) return;

    const currentItem = {
      id: this.dataset.productId,
      handle: handle,
      title: this.dataset.productTitle,
      url: this.dataset.productUrl,
      image: this.dataset.productImg,
      price: this.dataset.productPrice
    };

    let list = this.getHistory();
    // Filter out duplicate
    list = list.filter(item => item.handle !== handle);
    // Unshift current to start
    list.unshift(currentItem);
    // Limit size
    if (list.length > 12) list = list.slice(0, 12);

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }

  getHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  renderProducts() {
    if (!this.container) return;
    const history = this.getHistory();
    const currentHandle = this.dataset.productHandle;

    // Filter out current product if on PDP
    const itemsToRender = history.filter(item => item.handle !== currentHandle).slice(0, this.maxItems);

    if (itemsToRender.length === 0) {
      this.classList.remove('is-active');
      return;
    }

    this.classList.add('is-active');
    this.container.innerHTML = itemsToRender.map(item => `
      <a href="${item.url}" class="recently-viewed__card">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" class="recently-viewed__card-img" loading="lazy">` : ''}
        <div class="recently-viewed__card-body">
          <h3 class="recently-viewed__card-title">${item.title}</h3>
          <span class="recently-viewed__card-price">${item.price}</span>
        </div>
      </a>
    `).join('');
  }
}

if (!customElements.get('recently-viewed-products')) {
  customElements.define('recently-viewed-products', RecentlyViewedProducts);
}
