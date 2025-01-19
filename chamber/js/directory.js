// directory.js
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const directoryContainer = document.getElementById('directory-container');

// Toggle view functions
gridBtn.addEventListener('click', () => {
    directoryContainer.classList.remove('list');
    directoryContainer.classList.add('grid');
    localStorage.setItem('viewPreference', 'grid');
});

listBtn.addEventListener('click', () => {
    directoryContainer.classList.remove('grid');
    directoryContainer.classList.add('list');
    localStorage.setItem('viewPreference', 'list');
});

// Fetch and display members
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error('Error fetching members:', error);
        directoryContainer.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the member directory. Please try again later.</p>
            </div>
        `;
    }
}

function displayMembers(members) {
    directoryContainer.innerHTML = '';
    
    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        
        const membershipClass = getMembershipClass(member.membershipLevel);
        
        memberCard.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}" loading="lazy">
            <div class="card-content">
                <h2>${member.name}</h2>
                <p>📍 ${member.address}</p>
                <p>📞 ${member.phone}</p>
                ${member.website !== 'N/A' 
                    ? `<a href="${member.website}" target="_blank" rel="noopener">
                         🌐 Visit Website
                       </a>`
                    : '<p class="no-website">❌ No website available</p>'
                }
                <span class="membership-level ${membershipClass}">
                    ${getMembershipLevel(member.membershipLevel)}
                </span>
            </div>
        `;
        
        directoryContainer.appendChild(memberCard);
    });
}

function getMembershipClass(level) {
    switch(level) {
        case 1: return "member";
        case 2: return "silver";
        case 3: return "gold";
        default: return "";
    }
}

function getMembershipLevel(level) {
    switch(level) {
        case 1: return "Member";
        case 2: return "Silver";
        case 3: return "Gold";
        default: return "Unknown";
    }
}

function getMembershipIcon(level) {
    switch(level) {
        case 3: return "fa-crown";
        case 2: return "fa-star";
        case 1: return "fa-certificate";
        default: return "fa-user";
    }
}

// Load saved view preference
function loadViewPreference() {
    const savedView = localStorage.getItem('viewPreference') || 'grid';
    directoryContainer.classList.add(savedView);
    if (savedView === 'list') {
        directoryContainer.classList.remove('grid');
    }
}

// Footer date information
function updateFooterDates() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    document.getElementById('lastModified').textContent = document.lastModified;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadViewPreference();
    getMembers();
    updateFooterDates();
});

// Hamburger menu for mobile
const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');

if (hamburgerBtn && primaryNav) {
    hamburgerBtn.addEventListener('click', () => {
        primaryNav.classList.toggle('show');
        hamburgerBtn.classList.toggle('open');
    });
}