// Selecting form and input elements
const userForm = document.querySelector('#search-city-form');
const cityInput = document.querySelector('#city');
const previousCityButtons = document.querySelector('#previous-city-buttons');
const currentCity = document.querySelector('#weather-cards');
const weatherCardContainer = document.querySelector('#weather-card-container');

// Display previous cities when the page loads
displayPreviousCities();

// Event listener for form submission
userForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const cityName = cityInput.value.trim();

    if (cityName) {
        // Call function to fetch weather data
        fetchWeather(cityName);
    } else {
        alert('Please enter a city name');
    }
});

// Function to fetch weather data
function fetchWeather(cityName) {
    const apiKey = '6f204029b6e80349cc7078978811b9f3';
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    const script = document.createElement('script');
    script.src = apiURL + '&callback=handleWeatherResponse';
    document.body.appendChild(script);
}

// Function to handle weather response
function handleWeatherResponse(response) {
    updateUI(response);
    saveCity(response.name);
}

function updateUI(weatherData) {
    // Check if weatherData is undefined or doesn't have expected structure
    if (!weatherData || !weatherData.main || !weatherData.main.temp) {
        alert('Weather data unavailable');
        return;
    }

    const cityName = weatherData.name;
    const date = new Date(weatherData.dt * 1000); // Convert timestamp to milliseconds

    // Convert temperature from Kelvin to Celsius
    const temperatureCelsius = (weatherData.main.temp - 273.15).toFixed(2); // Rounded to 2 decimal places

    currentCity.innerHTML = `
    <div id="current-city" class="card">
        <h1>Current City: ${cityName}</h1>
        <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">
        <h2>Date: ${date.toDateString()}</h2>
        <h2>Temperature: ${weatherData.main.temp} °C</h2>
        <h2>Humidity: ${weatherData.main.humidity}%</h2>
        <h2>Wind Speed: ${weatherData.wind.speed} m/s</h2>
    </div>
    `;
}

// Function to save city to localStorage
function saveCity(cityName) {
    let cities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));

        displayPreviousCities();
    }
}

// Function to display previous cities
function displayPreviousCities() {
    previousCityButtons.innerHTML = '';
    let cities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    cities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.classList.add('btn');
        button.addEventListener('click', () => fetchWeather(city));
        previousCityButtons.appendChild(button);
    });
}
