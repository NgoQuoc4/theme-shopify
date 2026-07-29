// Custom Japandi Furniture Header Interactions
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    this.header = this.querySelector('.furniture-header');
  }

  connectedCallback() {
    this.initSticky();
  }

  initSticky() {
    if (!this.header || !this.header.classList.contains('furniture-header--sticky')) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        this.header.classList.add('is-scrolled');
      } else {
        this.header.classList.remove('is-scrolled');
      }
    });
  }
}

if (!customElements.get('custom-header')) {
  customElements.define('custom-header', CustomHeader);
}
