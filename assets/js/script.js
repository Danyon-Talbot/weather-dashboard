// Selecting form and input elements
const userForm = document.querySelector('#search-city-form');
const cityInput = document.querySelector('#city');
const previousCityButtons = document.querySelector('#previous-city-buttons');
const currentCity = document.querySelector('#weather-cards');
const weatherCardContainer = document.querySelector('#weather-cards');

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

    const cityName = weatherData.name; // Change 'forecastData.city.name' to 'weatherData.name'
    const date = new Date(weatherData.dt * 1000); // Convert timestamp to milliseconds

    // Convert temperature from Kelvin to Celsius
    const temperatureCelsius = (weatherData.main.temp - 273.15).toFixed(2); // Rounded to 2 decimal places

    currentCity.innerHTML = `
    <div id="current-city" class="card">
        <h1>Current City: ${cityName}</h1>
        <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather Icon">
        <h2>Date: ${date.toDateString()}</h2>
        <h2>Temperature: ${temperatureCelsius} °C</h2>
        <h2>Humidity: ${weatherData.main.humidity}%</h2>
        <h2>Wind Speed: ${weatherData.wind.speed} m/s</h2>
        <button id="fetch-forecast-btn">Fetch 5-Day Forecast</button>
    </div>
    `;

    // Add event listener to the forecast button
    const fetchForecastBtn = document.getElementById('fetch-forecast-btn');
    fetchForecastBtn.addEventListener('click', function() {
        fetchFiveDayForecast(cityName);
    });
}

function fetchFiveDayForecast(cityName) {
    const apiKey = '6f204029b6e80349cc7078978811b9f3';
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        displayFiveDayForecast(data);
    })
    .catch(error => {
        console.log('Error fetching 5-Day Forecast:', error);
    });

}

// Function to get the next five days starting from tomorrow
function getNextFiveDays() {
    const nextFiveDays = [];
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start from tomorrow
    for (let i = 0; i < 5; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(nextDay.getDate() + i);
        nextFiveDays.push(nextDay);
    }
    return nextFiveDays;
}


function displayFiveDayForecast(forecastData) {
    const cityName = forecastData.city.name;
    const weatherCardsContainer = document.querySelector('#weather-cards'); // Select the weather-cards container

    // Create a container div for the forecast cards
    const forecastCardsContainer = document.createElement('div');
    forecastCardsContainer.classList.add('forecast-cards');

    // Add the 5-Day Forecast subtitle with the city name
    const subtitle = document.createElement('h2');
    subtitle.textContent = `5-Day Forecast: ${cityName}`;
    forecastCardsContainer.appendChild(subtitle);

    // Get the next five days starting from tomorrow
    const nextFiveDays = getNextFiveDays();

    // Loop through the next five days and generate forecast cards
    nextFiveDays.forEach((day, index) => {
        const date = new Date(day);
        const dayOfWeek = getDayOfWeek(date.getDay());
        const forecastItem = forecastData.list[index];
        const temperature = (forecastItem.main.temp - 273.15).toFixed(2);

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('card');
        forecastCard.innerHTML = `
            <div class="card">
                <h2 class="subtitle">${dayOfWeek}</h2>
                <div class="card-header">${date.toDateString()}</div>
                <div class="card-body">
                    <p>Temperature: ${temperature} °C</p>
                    <p>Humidity: ${forecastItem.main.humidity}%</p>
                    <p>Wind Speed: ${forecastItem.wind.speed} m/s</p>
                </div>
            </div>
        `;
        forecastCardsContainer.appendChild(forecastCard); // Append forecast cards to the forecast cards container
    });

    // Append the forecast cards container to the weather-cards container
    weatherCardsContainer.appendChild(forecastCardsContainer);
}



// Function to save city to localStorage
function saveCity(cityName) {
    let cities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));

        displayPreviousCities();
    }
};

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
};
