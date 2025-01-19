// Course Data
const courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: true },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
    { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, completed: false }
];

// Mobile Menu Toggle
document.getElementById('menu-button').addEventListener('click', function() {
    const navMenu = document.getElementById('nav-menu');
    const menuButton = this;
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    
    menuButton.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('open');
    
    // Toggle menu icon
    const icon = menuButton.querySelector('.material-icons');
    icon.textContent = isExpanded ? 'menu' : 'close';
});

// Course Display Function
function displayCourses(filter = 'all') {
    const courseContainer = document.getElementById('course-container');
    courseContainer.classList.add('fade-out');
    
    setTimeout(() => {
        courseContainer.innerHTML = '';
        const filteredCourses = filter === 'all' 
            ? courses 
            : courses.filter(course => course.subject === filter);

        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        document.getElementById('total-credits').textContent = totalCredits;

        filteredCourses.forEach((course, index) => {
            const card = document.createElement('article');
            card.className = `course-card ${course.completed ? 'completed' : ''} fade-in`;
            
            const statusIcon = course.completed ? 'check_circle' : 'schedule';
            card.innerHTML = `
                <h3>${course.subject} ${course.number}</h3>
                <p>${course.title}</p>
                <p>
                    <span class="material-icons">school</span>
                    Credits: ${course.credits}
                </p>
                <p class="status">
                    <span class="material-icons">${statusIcon}</span>
                    ${course.completed ? 'Completed' : 'In Progress'}
                </p>
            `;
            
            courseContainer.appendChild(card);
        });
        
        courseContainer.classList.remove('fade-out');
    }, 300);
}

// Add Hover Effects
function addHoverEffects() {
    const cards = document.querySelectorAll('.progress-card, .course-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover');
        });
    });
}

// Filter Button Event Listeners
function initializeFilterButtons() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-button').forEach(btn => 
                btn.classList.remove('active'));
            
            // Add active class and animation
            button.classList.add('active');
            
            // Get the filter value and update display
            const filter = button.dataset.filter;
            displayCourses(filter);
        });
    });
}

// Update Date Information
function updateDates() {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
    document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;
}

// Initialize Animations
function initializeAnimations() {
    document.querySelectorAll('section').forEach((section, index) => {
        section.classList.add('fade-in');
    });
}

// Initialize Page
function initializePage() {
    updateDates();
    displayCourses();
    initializeFilterButtons();
    initializeAnimations();
    addHoverEffects();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializePage);

// Accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('nav-menu').classList.contains('open')) {
        document.getElementById('menu-button').click();
    }
});

// Responsive Design Handler
function handleResponsiveDesign() {
    const navMenu = document.getElementById('nav-menu');
    const menuButton = document.getElementById('menu-button');
    
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.querySelector('.material-icons').textContent = 'menu';
    }
}

// Debounced resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResponsiveDesign, 250);
});

// Error Handler
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});


