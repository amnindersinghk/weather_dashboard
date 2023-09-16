const apiKey = '1df0086b20f1ace312830f17bf316b09';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

// Function to fetch current weather data
function fetchCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data and display it in the "current-weather" section
            const cityName = data.name;
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            // Update the "current-weather" section with the data
            currentWeather.innerHTML = `
                <h2>${cityName}</h2>
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
                <!-- Add more elements as needed -->
            `;

            // Call the fetchForecast function with latitude and longitude
            fetchForecast(data.coord.lat, data.coord.lon);
        })
        .catch((error) => {
            console.error('Error fetching current weather:', error);
        });
}

// Function to fetch 5-day forecast data using latitude and longitude
function fetchForecast(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Process the data and display it in the "forecast" section
            forecast.innerHTML = ''; // Clear previous forecast data

            // Loop through the forecast data and create elements for each day's forecast
            data.list.forEach((item) => {
                const date = new Date(item.dt * 1000); // Convert timestamp to date
                const temperature = item.main.temp;
                const weatherDescription = item.weather[0].description;

                // Create a container for each day's forecast
                const dayForecast = document.createElement('div');
                dayForecast.classList.add('forecast-item'); // You can define a CSS class for styling

                // Update the dayForecast element with forecast information
                dayForecast.innerHTML = `
                    <h3>${date.toDateString()}</h3>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Description: ${weatherDescription}</p>
                `;

                // Append the dayForecast to the "forecast" section
                forecast.appendChild(dayForecast);
            });
        })
        .catch((error) => {
            console.error('Error fetching forecast:', error);
        });
}

// Function to update the search history
function updateSearchHistory(city) {
    // Create a list item and append it to the "search-history" section
    const listItem = document.createElement('li');
    listItem.textContent = city;
    searchHistory.appendChild(listItem);

    // Add an event listener to the list item to allow clicking on a city in the history
    listItem.addEventListener('click', () => {
        fetchCurrentWeather(city);
    });
}

// Event listener for the form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        fetchCurrentWeather(city);
        updateSearchHistory(city);
        cityInput.value = ''; // Clear the input field
    }
});
