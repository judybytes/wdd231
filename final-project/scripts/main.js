// scripts/main.js
import {
    formatPrice,
    createProductCard,
    createProductModal,
    saveToStorage,
    getFromStorage,
    debounce,
    filterProducts,
    sortProducts,
    validateForm,
    showNotification,
    showLoadingSpinner,
    hideLoadingSpinner
} from './utils.js';

class ArtisansHaven {
    constructor() {
        this.products = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            search: '',
            category: '',
            priceRange: '',
            sortBy: 'featured'
        };
        this.cart = getFromStorage('cart') || [];
        this.init();
    }

    async init() {
        try {
            showLoadingSpinner();
            await this.loadProducts();
            this.initializeUI();
            hideLoadingSpinner();
        } catch (error) {
            console.error('Initialization error:', error);
            showNotification('Failed to load content. Please try again.', 'error');
        }
    }

    initializeUI() {
        this.initMobileMenu();
        this.initSearch();
        this.initFilters();
        this.initPagination();
        this.initCart();
        this.initForms();
        this.initAccessibility();

        // Page specific initialization
        if (window.location.pathname.includes('products.html')) {
            this.initProductsPage();
        } else if (window.location.pathname.includes('contact.html')) {
            this.initContactPage();
        } else {
            this.initHomePage();
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('./data/products.json');
            if (!response.ok) throw new Error('Failed to fetch products');
            this.products = await response.json();
        } catch (error) {
            throw new Error('Error loading products: ' + error.message);
        }
    }

    initSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filters.search = e.target.value;
                this.currentPage = 1;
                this.updateProductsDisplay();
            }, 300));
        }
    }

    initFilters() {
        const filterControls = document.querySelectorAll('.filter-control');
        filterControls.forEach(control => {
            control.addEventListener('change', (e) => {
                this.filters[e.target.name] = e.target.value;
                this.currentPage = 1;
                this.updateProductsDisplay();
            });
        });
    }

    initPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (paginationContainer) {
            this.renderPagination();
        }
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        
        let paginationHTML = `
            <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="this.previousPage()">Previous</button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-btn ${this.currentPage === i ? 'active' : ''}"
                        onclick="this.goToPage(${i})">${i}</button>
            `;
        }

        paginationHTML += `
            <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="this.nextPage()">Next</button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    initCart() {
        this.updateCartCount();
        
        // Add to cart functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                this.addToCart(productId);
            }
        });
    }

    addToCart(productId) {
        this.cart.push(productId);
        saveToStorage('cart', this.cart);
        this.updateCartCount();
        showNotification('Product added to cart!');
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }

    initForms() {
        // Contact Form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Newsletter Form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterForm.bind(this));
        }
    }

    async handleContactForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            showLoadingSpinner();
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Message sent successfully!');
            form.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            hideLoadingSpinner();
        }
    }

    async handleNewsletterForm(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;

        try {
            showLoadingSpinner();
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showNotification('Successfully subscribed to newsletter!');
            form.reset();
        } catch (error) {
            showNotification('Failed to subscribe. Please try again.', 'error');
        } finally {
            hideLoadingSpinner();
        }
    }

    initAccessibility() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });

        // Add focus trap to modal
        const modal = document.getElementById('modal');
        if (modal) {
            this.initFocusTrap(modal);
        }
    }

    initFocusTrap(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ArtisansHaven();
});