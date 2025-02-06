// join.js

// Set timestamp when form loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current timestamp
    const timestamp = new Date().toISOString();
    document.getElementById('timestamp').value = timestamp;

    // Update copyright year and last modified date
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;

    // Add form submission handler
    const form = document.getElementById('joinForm');
    form.addEventListener('submit', handleSubmit);
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
}

// Close modal when clicking the X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = "none";
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
});

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Store data in localStorage for thank you page
    localStorage.setItem('formData', JSON.stringify(data));

    // Redirect to thank you page
    window.location.href = 'thankyou.html';
}

// Mobile menu functionality
const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');

if (hamburgerBtn && primaryNav) {
    hamburgerBtn.addEventListener('click', () => {
        primaryNav.classList.toggle('show');
        hamburgerBtn.classList.toggle('open');
    });
}