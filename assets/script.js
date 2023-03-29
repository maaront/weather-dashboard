// Creating variables for the search button and form
const searchBtn = document.querySelector('#search-btn');
const searchForm = document.querySelector('#search-form');

// Add a submit event listener to the form
searchForm.addEventListener('submit', function(event) { // When form is submitted, trigger function"event"
    event.preventDefault(); // Prevent form from executing a page refresh
    const city = event.target.querySelector('input').value; // Get the city value from the input field
    getWeather(city); // Then call the getWeather function with the newly acquired city value
});


// Fetching the weather data from Open Weather
function getWeather(city) { // Create new function that takes the city value as an argument
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=46b7ef6bf0d16988ac3f5f8e04b5bf40&units=imperial` // Build the proper API URL using the 'city' value 
    fetch(requestUrl) // Kicking off the fetch function using the new requestURL
    .then(function (response) { // Getting a response
        return response.json(); // Converting this response to JSON
    })
    .then (function (weatherData) { // Combine the promise using .then
        todayForecast(weatherData); // Pass newly acquired weatherData to today's forecast function
        fiveDayForecast(weatherData); // Pass newly acquired weatherData to five day forecast function

    })
}

//Display the weather data for today's weather
function todayForecast(weatherData) { // Create new function that takes the weather data as an argument
    const todayEl = document.querySelector('#today'); // Create new const for the #today section in the HTML
    const currentWeather = weatherData.list[0]; // Assigns new const from 1st result of weatherData list
    const currentTemp = currentWeather.main.temp; // Assigns new const for the temperature
    const currentWeatherIcon = currentWeather.weather[0].icon; //Assigns new const for the icon

    // Adds the city name, weather icon, and temperature with a template literal
    todayEl.innerHTML = `
        <h2>${weatherData.city.name}</h2>
        <img src="https://openweathermap.org/img/w/${currentWeatherIcon}.png" alt="Weather icon">
        <p>Temperature: ${currentTemp}°F</p>
    `;
}

// Displaying the weather data for the 5-day forecast
function fiveDayForecast(weatherData) { // Create new function for the five-day forecast that takes the weather data as an argument
    const fiveDayTable = document.querySelector('#five-day'); // Create new const for the five day table
    const forecast = weatherData.list.filter((index) => index % 8 === 0).slice(1); // Filter data list to retrieve one weather entry per day (every 8th entry) and excludes the first entry

    const tableRows = forecast.map((day, index) => { 
    const dayTemp = day.main.temp;
    const dayWeatherIcon = day.weather[0].icon;
    return `
        <td>
            <h3>Day ${index + 1}</h3>
            <img src="https://openweathermap.org/img/w/${dayWeatherIcon}.png" alt="Weather icon">
            <p>Temperature: ${dayTemp}°F</p>
        </td>
    `;
}).join(''); // Use this method to concatenate the array of table cells into a string

// Then add this new string to with a table row
fiveDayTable.innerHTML = ` 
<tr>
  ${tableRows}
</tr>
`;
}