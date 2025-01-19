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

// Enhanced Course Display Function
function displayCourses(filter = 'all') {
    const courseContainer = document.getElementById('course-container');
    courseContainer.style.opacity = '0';
    
    setTimeout(() => {
        courseContainer.innerHTML = '';
        const filteredCourses = filter === 'all' 
            ? courses 
            : courses.filter(course => course.subject === filter);

        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        document.getElementById('total-credits').textContent = totalCredits;

        filteredCourses.forEach((course, index) => {
            const card = document.createElement('article');
            card.className = `course-card ${course.completed ? 'completed' : ''}`;
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
            
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
            
            // Add hover effect listeners
            card.addEventListener('mouseover', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseout', () => {
                card.style.transform = 'translateY(0)';
            });
            
            courseContainer.appendChild(card);
        });
        
        courseContainer.style.opacity = '1';
    }, 300);
}

// Filter Button Event Listeners
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-button').forEach(btn => 
            btn.classList.remove('active'));
        
        // Add active class with animation
        e.target.classList.add('active');
        e.target.style.animation = 'pulse 0.3s ease';
        
        setTimeout(() => {
            e.target.style.animation = '';
        }, 300);
        
        displayCourses(e.target.dataset.filter);
    });
});

// Update Date Information
function updateDates() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;
    
    // Update last modified date
    document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;
}

// Initialize Page with Animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dates
    updateDates();
    
    // Initial course display
    displayCourses();
    
    // Add fade-in animation to sections
    document.querySelectorAll('section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
    });
    
    // Add hover effects to progress cards
    document.querySelectorAll('.progress-card').forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseout', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // You could add more sophisticated error handling here
});

// Accessibility Enhancement
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('nav-menu').classList.contains('open')) {
        document.getElementById('menu-button').click();
    }
});

// Performance Optimization
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle any necessary responsive adjustments
        if (window.innerWidth > 768) {
            document.getElementById('nav-menu').classList.remove('open');
            document.getElementById('menu-button').querySelector('.material-icons').textContent = 'menu';
        }
    }, 250);
});


