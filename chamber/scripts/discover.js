// discover.js

function getVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentDate = Date.now();
    let message = '';

    if (!lastVisit) {
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const daysSinceVisit = Math.floor((currentDate - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceVisit < 1) {
            message = "Back so soon! Awesome!";
        } else {
            message = `You last visited ${daysSinceVisit} ${daysSinceVisit === 1 ? 'day' : 'days'} ago.`;
        }
    }

    localStorage.setItem('lastVisit', currentDate.toString());
    return message;
}

async function loadDiscoverCards() {
    try {
        const response = await fetch('data/discover.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const grid = document.querySelector('.discover-grid');
        
        data.locations.forEach((location, index) => {
            const card = document.createElement('div');
            card.className = 'discover-card';
            card.style.gridArea = `card${index + 1}`;
            
            card.innerHTML = `
                <figure>
                    <img src="images/discover/${location.image}" 
                         alt="${location.name}"
                         loading="lazy"
                         width="300"
                         height="200">
                </figure>
                <div class="content">
                    <h2>${location.name}</h2>
                    <address>${location.address}</address>
                    <p>${location.description}</p>
                    <button class="learn-more">Learn More</button>
                </div>
            `;
            
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading discover cards:', error);
        document.querySelector('.discover-grid').innerHTML = `
            <p class="error-message">Sorry, we couldn't load the locations. Please try again later.</p>
        `;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('visit-message');
    messageElement.textContent = getVisitMessage();
    loadDiscoverCards();
    
    // Update footer dates
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
});