const userForm = document.getElementById('search-city-form');
const cityInput = document.getElementById('city');
const previousCityButtons = document.getElementById('previous-city-buttons');
const currentCity = document.getElementById('current-city');
const weatherCardContainer = document.getElementById('weather-card-container');


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

function fetchWeather(cityName) {
    const apiKey = '6f204029b6e80349cc7078978811b9f3';
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
            saveCity(cityName);
        })
        .catch(error => {
            console.error('Error fetching Weatrher Data:', error);
            alert('Failed to fetch Weather Data. Please try again');
        });
};

function updateUI(weatherData) {
    currentCity.innerHTML =`
    <h1>Current City: ${weatherData.name}</h1>
    <h2>Temperature: ${weatherData.main.temp} °C</h2>
    <h2>Humidity: ${weatherData.main.humidity}%</h2>
    <h2>Wind Speed: ${weatherData.wind.speed} m/s</h2>
`;
};

function saveCity(cityName) {
    let cities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));

        displayPreviousCities();
    };
};

function displayPreviousCities() {
    previousCityButtons.innerHTML = '';
    let cities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : [];
    cities.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.classList.add('btn');
        button.addEventListener('click', () => fetchWeather(city));
        previousCityButtons.appendChild(button);
    })
}

