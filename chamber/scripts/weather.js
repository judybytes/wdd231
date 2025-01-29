// weather.js
const apiKey = 'be73e9fb03b95515cec74e75d0b4d82b';
const city = 'Vanderbijlpark';
const country = 'ZA';

// Fetch current weather
async function getWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`;
        console.log('Fetching weather from:', url); // Debug log

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data); // Debug log
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayWeatherError();
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const description = capitalizeWords(data.weather[0].description);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const icon = data.weather[0].icon;

    document.getElementById('current-temp').textContent = `${temp}°C`;
    document.getElementById('weather-desc').textContent = description;
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind: ${windSpeed} m/s`;
    document.getElementById('current-icon').innerHTML = 
        `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">`;
}

// Fetch forecast
async function getForecast() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${apiKey}`;
        console.log('Fetching forecast from:', url); // Debug log

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Forecast data received:', data); // Debug log
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        displayForecastError();
    }
}

// Display forecast
function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    // Get next three days
    const threeDays = data.list.filter(item => 
        item.dt_txt.includes('12:00:00')
    ).slice(0, 3);

    threeDays.forEach(day => {
        const temp = Math.round(day.main.temp);
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const icon = day.weather[0].icon;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'forecast-day';
        dayDiv.innerHTML = `
            <div>${date}</div>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon">
            <div>${temp}°C</div>
        `;
        forecastDiv.appendChild(dayDiv);
    });
}

// Display error messages
function displayWeatherError() {
    const weatherCard = document.querySelector('.weather-card');
    if (weatherCard) {
        weatherCard.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the weather information.</p>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Utility function to capitalize words
function capitalizeWords(str) {
    return str.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Initialize weather data
document.addEventListener('DOMContentLoaded', () => {
    console.log('Weather script loaded'); // Debug log
    getWeather();
    getForecast();
});
