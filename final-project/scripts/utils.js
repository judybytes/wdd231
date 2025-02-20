// scripts/utils.js

/**
 * Currency formatter
 */
const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

/**
 * Format price to currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
    return currencyFormatter.format(price);
};

/**
 * Create product card HTML
 * @param {Object} product - Product data
 * @returns {string} HTML string
 */
export const createProductCard = (product) => {
    const stockStatus = product.inStock 
        ? '<span class="stock-status in-stock">In Stock</span>'
        : '<span class="stock-status out-of-stock">Out of Stock</span>';

    return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image" 
                     loading="lazy"
                     width="300"
                     height="300">
                ${stockStatus}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-artisan">By ${product.artisan}</p>
                <p class="product-description">${truncateText(product.description, 100)}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
                <div class="product-actions">
                    <button class="btn btn-secondary view-details" 
                            data-id="${product.id}"
                            aria-label="View details for ${product.name}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${product.inStock ? 
                        `<button class="btn btn-primary add-to-cart" 
                                data-id="${product.id}"
                                aria-label="Add ${product.name} to cart">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>` : 
                        '<button class="btn btn-disabled" disabled>Out of Stock</button>'
                    }
                </div>
            </div>
        </article>
    `;
};

/**
 * Create product modal content
 * @param {Object} product - Product data
 * @returns {string} HTML string
 */
export const createProductModal = (product) => {
    return `
        <div class="product-modal">
            <div class="modal-gallery">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="modal-image"
                     width="500"
                     height="500">
            </div>
            <div class="modal-info">
                <h2>${product.name}</h2>
                <div class="modal-meta">
                    <p class="modal-price">${formatPrice(product.price)}</p>
                    <p class="modal-artisan">Crafted by ${product.artisan}</p>
                    <div class="modal-availability">
                        ${product.inStock ? 
                            '<span class="status-badge in-stock"><i class="fas fa-check"></i> In Stock</span>' : 
                            '<span class="status-badge out-of-stock"><i class="fas fa-times"></i> Out of Stock</span>'
                        }
                    </div>
                </div>
                
                <div class="modal-description">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>
                
                <div class="modal-details">
                    <h3>Product Details</h3>
                    <ul>
                        <li><i class="fas fa-ruler"></i> <strong>Dimensions:</strong> ${product.dimensions}</li>
                        <li><i class="fas fa-layer-group"></i> <strong>Materials:</strong> ${product.materials.join(', ')}</li>
                        <li><i class="fas fa-info-circle"></i> <strong>Care:</strong> ${product.careInstructions}</li>
                        <li><i class="fas fa-calendar"></i> <strong>Created:</strong> ${formatDate(product.dateCreated)}</li>
                    </ul>
                </div>

                <div class="modal-tags">
                    ${product.tags.map(tag => `
                        <span class="tag">
                            <i class="fas fa-tag"></i> ${tag}
                        </span>
                    `).join('')}
                </div>

                ${product.inStock ? 
                    `<button class="btn btn-primary btn-lg add-to-cart" 
                            data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>` : 
                    '<button class="btn btn-disabled btn-lg" disabled>Out of Stock</button>'
                }
            </div>
        </div>
    `;
};

/**
 * Local Storage Operations
 */
export const storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Filter products
 * @param {Array} products - Products array
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const filterProducts = (products, filters) => {
    return products.filter(product => {
        const searchTerm = filters.search.toLowerCase();
        const searchMatch = !filters.search || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.artisan.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        const categoryMatch = !filters.category || 
            product.category === filters.category;

        const priceMatch = !filters.priceRange || 
            isPriceInRange(product.price, filters.priceRange);

        return searchMatch && categoryMatch && priceMatch;
    });
};

/**
 * Price range checker
 * @param {number} price - Product price
 * @param {string} range - Price range
 * @returns {boolean}
 */
const isPriceInRange = (price, range) => {
    const ranges = {
        'under-50': price < 50,
        '50-100': price >= 50 && price <= 100,
        '100-200': price > 100 && price <= 200,
        'over-200': price > 200
    };
    return ranges[range] || true;
};

/**
 * Sort products
 * @param {Array} products - Products array
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted products
 */
export const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products];
    
    const sortFunctions = {
        'price-low': (a, b) => a.price - b.price,
        'price-high': (a, b) => b.price - a.price,
        'newest': (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated),
        'name-asc': (a, b) => a.name.localeCompare(b.name),
        'name-desc': (a, b) => b.name.localeCompare(a.name),
        'featured': () => 0 // Keep original order
    };

    return sortedProducts.sort(sortFunctions[sortBy] || sortFunctions.featured);
};

/**
 * Form validation
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation results
 */
export const validateForm = (formData) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Required fields
    ['name', 'email', 'message'].forEach(field => {
        if (!formData[field] || !formData[field].trim()) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        }
    });

    // Specific validations
    if (formData.name && formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }

    if (formData.email && !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (formData.message && formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 */
export const showNotification = (message, type = 'success') => {
    const container = document.getElementById('notifications-container') || 
                     createNotificationContainer();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <p>${message}</p>
        <button class="close-notification" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));

    // Add click handler for close button
    notification.querySelector('.close-notification').addEventListener('click', 
        () => removeNotification(notification));

    // Auto-remove after delay
    setTimeout(() => removeNotification(notification), 5000);
};

/**
 * Create notification container
 * @returns {HTMLElement} Container element
 */
const createNotificationContainer = () => {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    document.body.appendChild(container);
    return container;
};

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Icon class
 */
const getNotificationIcon = (type) => {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
};

/**
 * Remove notification
 * @param {HTMLElement} notification - Notification element
 */
const removeNotification = (notification) => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
};

/**
 * Loading spinner
 */
export const spinner = {
    show: () => {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'flex';
    },
    hide: () => {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'none';
    }
};

/**
 * Format date
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Generate pagination
 * @param {number} currentPage - Current page
 * @param {number} totalPages - Total pages
 * @returns {string} Pagination HTML
 */
export const generatePagination = (currentPage, totalPages) => {
    if (totalPages <= 1) return '';

    return `
        <nav class="pagination" role="navigation" aria-label="Pagination">
            <button class="pagination-btn" 
                    ${currentPage === 1 ? 'disabled' : ''}
                    data-page="${currentPage - 1}"
                    aria-label="Previous page">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            
            ${generatePageNumbers(currentPage, totalPages)}
            
            <button class="pagination-btn" 
                    ${currentPage === totalPages ? 'disabled' : ''}
                    data-page="${currentPage + 1}"
                    aria-label="Next page">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </nav>
    `;
};

/**
 * Generate page numbers for pagination
 * @param {number} current - Current page
 * @param {number} total - Total pages
 * @returns {string} Page numbers HTML
 */
const generatePageNumbers = (current, total) => {
    let pages = [];
    const range = 2; // Show 2 pages before and after current

    for (let i = 1; i <= total; i++) {
        if (
            i === 1 || // First page
            i === total || // Last page
            (i >= current - range && i <= current + range) // Pages around current
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return pages.map(page => {
        if (page === '...') {
            return '<span class="pagination-ellipsis">...</span>';
        }
        return `
            <button class="pagination-btn ${current === page ? 'active' : ''}"
                    data-page="${page}"
                    aria-label="Page ${page}"
                    ${current === page ? 'aria-current="page"' : ''}>
                ${page}
            </button>
        `;
    }).join('');
};