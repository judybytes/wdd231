const courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: true },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
    { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, completed: false }
];

const courseContainer = document.getElementById('course-container');
const totalCreditsElement = document.getElementById('total-credits');
const currentYearElement = document.getElementById('current-year');
const lastModifiedElement = document.getElementById('lastModified');

// Display current year and last modified date
currentYearElement.textContent = new Date().getFullYear();
lastModifiedElement.textContent += document.lastModified;

// Render courses dynamically
function renderCourses(filter) {
    courseContainer.innerHTML = '';
    let filteredCourses = courses;

    if (filter === 'CSE') filteredCourses = courses.filter(course => course.subject === 'CSE');
    if (filter === 'WDD') filteredCourses = courses.filter(course => course.subject === 'WDD');

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsElement.textContent = totalCredits;

    filteredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;
        courseCard.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.subject} ${course.number}</p>
            <p>Credits: ${course.credits}</p>
            <p>Status: ${course.completed ? 'Completed' : 'In Progress'}</p>
        `;
        courseContainer.appendChild(courseCard);
    });
}

// Filter courses by category
function filterCourses(filter) {
    renderCourses(filter);
}

// Initial render of all courses
renderCourses('all');


