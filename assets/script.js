// Creating variables for the search button and form
const searchBtn = document.querySelector('#search-btn');
const searchForm = document.querySelector('#search-form');
const clearHistoryBtn = document.querySelector('#clear-history-btn');

// Add a submit event listener to the form
searchForm.addEventListener('submit', function(event) { // When form is submitted, trigger function"event"
    event.preventDefault(); // Prevent form from executing a page refresh
    const city = event.target.querySelector('#city-input').value; // Get the city value from the input field
    getWeather(city); // Then call the getWeather function with the newly acquired city value
});

// Add a click event listener to the clear history button
clearHistoryBtn.addEventListener('click', function() {
    localStorage.removeItem('cityHistory'); // Clear the city history from local storage
    updateSearchHistory(); // Update the search history section
    });

// Fetching the weather data from Open Weather
function getWeather(city) { // Create new function that takes the city value as an argument
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=46b7ef6bf0d16988ac3f5f8e04b5bf40&units=imperial` // Build the proper API URL using the 'city' value 
   
    fetch(requestUrl) // Kicking off the fetch function using the new requestURL
    .then(function (response) { // Getting a response
        return response.json(); // Converting this response to JSON
    })
    .then (function (weatherData) { // Combine the promise using .then
        console.log(weatherData); // Log the weather data to the console
        todayForecast(weatherData); // Pass newly acquired weatherData to today's forecast function
        fiveDayForecast(weatherData); // Pass newly acquired weatherData to five day forecast function
    })

    // Save the city name in the local storage
    saveCityToLocalStorage(city);

    // Update the search history section
    updateSearchHistory();
}

//Display the weather data for today's weather
function todayForecast(weatherData) {
    const todayEl = document.querySelector('#today');
    const currentWeather = weatherData.list[0];
    console.log(currentWeather);
    const currentDate = new Date(currentWeather.dt_txt.split(' ')[0]).toLocaleDateString('en-US');
    
    
    const currentTemp = currentWeather.main.temp;
    const currentWeatherIcon = currentWeather.weather[0].icon;
    const currentHumidity = currentWeather.main.humidity;
  
    todayEl.innerHTML = `
    <span>  
        <h2>Weather for ${weatherData.city.name} on ${currentDate}</h2>
      <p>Temperature: ${currentTemp}°F</p>
      <p>Wind Speed: ${currentTemp}</p>
      <p>Humidity: ${currentHumidity}%</p>
    </span>
      <img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png" alt="Weather icon" id="weather-icon">

    `;
  }

// Displaying the weather data for the 5-day forecast
function fiveDayForecast(weatherData) {
    const fiveDaySection = document.querySelector('#five-day');
    fiveDaySection.innerHTML = ''; // Clear the existing content

    const forecast = weatherData.list.filter(item => {
        const itemDate = new Date(item.dt_txt);
        const itemHour = itemDate.getHours();

        // Get the noon weather (12:00) for the next 5 days
        return itemHour === 12;
    }).slice(0, 5); // Limit the forecast to 5 days

    forecast.forEach((day) => {
        // Create elements for the forecast card
        const card = document.createElement('div');
        const title = document.createElement('h3');
        const icon = document.createElement('img');
        const temp = document.createElement('p');
        const wind = document.createElement('p');
        const humidity = document.createElement('p');

        // Set the content and attributes for the elements
        const date = new Date(day.dt_txt);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        title.textContent = formattedDate;
        icon.src = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
        icon.alt = 'Weather icon';
        temp.textContent = `Temperature: ${day.main.temp}°F`;
        wind.textContent = `Wind: ${day.wind.speed} MPH`;
        humidity.textContent = `Humidity: ${day.main.humidity}%`;

        // Append the elements to the card
        card.appendChild(title);
        card.appendChild(icon);
        card.appendChild(temp);
        card.appendChild(wind);
        card.appendChild(humidity);

        // Append the card to the five-day section
        fiveDaySection.appendChild(card);
    });
}


function saveCityToLocalStorage(city) {
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];

    // Check if the city is already in the history
    if (!cityHistory.includes(city)) {
        cityHistory.push(city);
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
    }
}

function updateSearchHistory() {
    const cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
    const historyEl = document.querySelector('#history');
    historyEl.innerHTML = '';

    cityHistory.forEach(city => {
        const cityBtn = document.createElement('button');
        cityBtn.textContent = city;
        cityBtn.addEventListener('click', () => {
            getWeather(city);
        });

        historyEl.appendChild(cityBtn);
    });
}

updateSearchHistory();