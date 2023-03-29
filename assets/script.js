const searchBtn = document.querySelector('#search-btn');
const searchForm = document.querySelector('#search form');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = event.target.querySelector('input').value;
    getWeather(city);
});

function getWeather(city) {
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=46b7ef6bf0d16988ac3f5f8e04b5bf40&units=imperial`
    fetch(requestUrl)
    .then(function (response) { 
        return response.json(); 
    })
    .then (function (weatherData) { 
        todayForecast(weatherData);
        fiveDayForecast(weatherData);

    })
}
