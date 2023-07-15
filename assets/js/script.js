var searchBtn = $('#searchBtn');
var searchCard = $('#searchCard');
var cityTitle = $('#cityTitle');
var todayTemp = $('#todayTemp');
var todayWind = $('#todayWind');
var todayHumidity = $('#todayHumidity');
var todayIcon = $('#todayIcon');

var error = document.createElement('p');

var cityName = '';
var todaysDate = dayjs().format('MMMM D, YYYY');

var geoURL = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var apiKey = '&appid=a6249de91a8f3cbb556fdd4308539cf7';
var forecastURL = 'https://api.openweathermap.org/data/3.0/onecall?units=imperial&lat='
var forecastURLLonParameter = '&lon='

var latitude = '';
var longitude = '';
var cityHistory = [];


function cityCoord () {
    fetch(geoURL + cityName + apiKey) 
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // ensures API recognizes the city typed in to set lat and lon
            if(data.message === 0) {
                error.textContent = '';
                latitude = data.city.coord.lat.toString();
                longitude = data.city.coord.lon.toString();
                cityName = data.city.name;

                // calls function to store the city in local storage
                storeCities(cityName);

                // calls function to use lat and lon to get weather data
                cityForecast();
            } else {
                // returns error message if city name is not recognized by geo API
                $(error).text('Please enter a valid city name');
                $(error).attr('style', 'color: red; font-style: italic');
                $(searchCard).append(error);
            }
            
        })
}

// use lat and lon to return current weather and 5-day forecast
function cityForecast () {
    fetch(forecastURL + latitude + forecastURLLonParameter + longitude + apiKey) 
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $(cityTitle).text(cityName + ' - ' + todaysDate);
            $(todayTemp).text('Temp: ' + data.current.temp + ' °F');
            $(todayWind).text('Wind: ' + data.current.wind_speed + ' MPH');
            $(todayHumidity).text('Humidity: ' + data.current.humidity + ' %');
            var iconSrc = ('https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png');
            $(todayIcon).attr('src', iconSrc);

            // calls function to update 5-day forecast data
            fiveDay(data);
            
        })
}

// get 5-day forecast data for city
function fiveDay(data) {
    // ensures that previous 5-day forecast data is cleared with a new search
    for (i=1; i < 6; i++ ) {
        $('#' + i).empty();
    }
    
    for (i=1; i < 6; i++ ) {
        var dayDate = document.createElement('h4');
        $(dayDate).text(dayjs.unix(data.daily[i].dt).format('MMMM D, YYYY')); 

        var dayTemp = document.createElement('p');
        $(dayTemp).text('Temp: ' + data.daily[i].temp.day + ' °F');
        
        var dayWind = document.createElement('p');
        $(dayWind).text('Wind: ' + data.daily[i].wind_speed + ' MPH');

        var dayHumidity = document.createElement('p');
        $(dayHumidity).text('Humidity: ' + data.daily[i].humidity + ' %');

        var dayIcon = document.createElement('img');
        var iconSrc = ('https://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png');
        $(dayIcon).attr('src', iconSrc);
        $(dayIcon).css('max-width', '50px')
        $(dayIcon).css('max-height', '50px')
        $('#'+ i).append(dayDate, dayIcon, dayTemp, dayWind, dayHumidity);
    }
}

// store cities that user searched for in local storage
function storeCities(str) {    
    // check for duplicates in the array first
    for (i=0; i<cityHistory.length ; i++) {
            if (str === cityHistory[i]){
                return;  
        } 
    }

    // if not a duplicate, push the city to the array of stored cities
    cityHistory.push(str);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory))
    
    // create button on page with stored city
    var historyBtn = document.createElement('button');
    $(historyBtn).text(str);
    $(historyBtn).attr('class', 'btn btn-secondary mt-2 w-100 historySearch')
    $(historyBtn).attr('data-name', str);
    $('#sideSection').append(historyBtn);
    
    // ensures you can click on a previously used city name without re-loading the page
    $(historyBtn).on("click", function (event){
        cityName = $(event.target).attr('data-name')
        cityCoord();
    })
}

// creates buttons for stored cities on the page
function renderCities(){
    for (i = 0; i < cityHistory.length; i++) {
        var historyBtn = document.createElement('button');
        $(historyBtn).text(cityHistory[i]);
        $(historyBtn).attr('class', 'btn btn-secondary mt-2 w-100 historySearch');
        $(historyBtn).attr('data-name', cityHistory[i]);
        $('#sideSection').append(historyBtn);
        $(historyBtn).on("click", function (event){
            cityName = $(event.target).attr('data-name')
            cityCoord();
        })
    }
}

// renders city history on page when loaded
function init() {
    var storedCities = JSON.parse(localStorage.getItem('cityHistory'));

    if (storedCities !== null) {
        cityHistory = storedCities;
    }

    renderCities();
}

init();

// event listener for search button 
$(searchBtn).on("click", function () {
    cityName = $('#cityName').val();
    cityCoord();
});