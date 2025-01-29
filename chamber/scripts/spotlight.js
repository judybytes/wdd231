// spotlight.js

// Main function to get and display spotlights
async function getSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Members data:', data); // Debug log

        // Filter for gold and silver members (levels 2 and 3)
        const eligibleMembers = data.members.filter(member =>
            member.membershipLevel >= 2
        );
        console.log('Eligible members:', eligibleMembers); // Debug log

        // Check image paths
        checkImagePaths(eligibleMembers);

        // Randomly select 2 members
        const spotlights = selectRandomMembers(eligibleMembers, 2);
        console.log('Selected spotlights:', spotlights); // Debug log

        displaySpotlights(spotlights);
    } catch (error) {
        console.error('Error fetching members:', error);
        displaySpotlightError();
    }
}

// Function to check image paths
function checkImagePaths(members) {
    members.forEach(member => {
        const img = new Image();
        img.src = `images/members/${member.image}`;
        img.onload = () => console.log(`Image loaded successfully: ${member.image}`);
        img.onerror = () => console.error(`Image failed to load: ${member.image}`);
    });
}

// Randomly select members
function selectRandomMembers(members, count) {
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, members.length));
}

// Display spotlights
function displaySpotlights(members) {
    const container = document.getElementById('spotlight-container');
    if (!container) {
        console.error('Spotlight container not found');
        return;
    }

    container.innerHTML = '';

    members.forEach(member => {
        const spotlight = document.createElement('div');
        spotlight.className = 'spotlight-card';

        // Create image path
        const imagePath = `images/members/${member.image}`;

        spotlight.innerHTML = `
            <img src="${imagePath}" 
                 alt="${member.name}" 
                 onerror="this.src='images/placeholder.png'; this.onerror=null;"
            >
            <h3>${member.name}</h3>
            <p>📍 ${member.address}</p>
            <p>📞 ${member.phone}</p>
            ${member.website !== 'N/A'
                ? `<p><a href="${member.website}" target="_blank" rel="noopener">🌐 Visit Website</a></p>`
                : '<p class="no-website">❌ No website available</p>'
            }
            <p class="membership-level ${getMembershipClass(member.membershipLevel)}">
                ${getMembershipLevel(member.membershipLevel)} Member
            </p>
        `;

        container.appendChild(spotlight);
    });
}

// Display error message if spotlights fail to load
function displaySpotlightError() {
    const container = document.getElementById('spotlight-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the business spotlights.</p>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Utility functions
function getMembershipClass(level) {
    return level === 3 ? 'gold' : 'silver';
}

function getMembershipLevel(level) {
    return level === 3 ? 'Gold' : 'Silver';
}

// Initialize spotlights when DOM is loaded
document.addEventListener('DOMContentLoaded', getSpotlights);