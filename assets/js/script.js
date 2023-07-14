var searchBtn = $('#searchBtn');
var searchCard = $('#searchCard');
var cityTitle = $('#cityTitle');
var todayTemp = $('#todayTemp');
var todayWind = $('#todayWind');
var todayHumidity = $('#todayHumidity');
var todayIcon = $('#todayIcon');

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
            if(data.message === 0) {
                console.log(data)
                latitude = data.city.coord.lat.toString();
                longitude = data.city.coord.lon.toString();
                cityName = data.city.name;

                storeCities(cityName);
                console.log(latitude)
                console.log(longitude)

                cityForecast();
            } else {
                var error = document.createElement('p');
                $(error).text('Please enter a valid city name');
                $(error).attr('style', 'color: red; font-style: italic');
                $(searchCard).append(error);
            }
            
        })
}

function cityForecast () {
    fetch(forecastURL + latitude + forecastURLLonParameter + longitude + apiKey) 
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            $(cityTitle).text(cityName + ' - ' + todaysDate);
            $(todayTemp).text('Temp: ' + data.current.temp + ' °F');
            $(todayWind).text('Wind: ' + data.current.wind_speed + ' MPH');
            $(todayHumidity).text('Humidity: ' + data.current.humidity + ' %');
            var iconSrc = ('https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png');
            $(todayIcon).attr('src', iconSrc);

            for (i=1; i < 6; i++ ) {
                var dayDate = document.createElement('h4');
                $(dayDate).text(dayjs.unix(data.daily[i].dt).format('MMMM D, YYYY')); 

                var dayTemp = document.createElement('p');
                $(dayTemp).text('Temp: ' + data.daily[i].temp.day + ' °F');
                
                var dayWind = document.createElement('p');
                $(dayWind).text('Wind: ' + data.daily[i].wind_speed + ' MPH');

                var dayHumidity = document.createElement('p');
                $(dayHumidity).text('Humidity: ' + data.daily[i].humidity + ' %');

                $('#'+ i).append(dayDate, dayTemp, dayWind, dayHumidity);
            }
        })
}

function storeCities(str) {    
    // check for duplicates in the array first
    for (i=0; i<cityHistory.length ; i++) {
            console.log(cityHistory.length)
            if (str === cityHistory[i]){
                console.log(str + 'if');
                return;  
        } 
    }

    // if not a duplicate, push the city to the array of stored cities
    cityHistory.push(str);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory))
    var historyBtn = document.createElement('button');
    $(historyBtn).text(str);
    $(historyBtn).attr('class', 'btn btn-secondary mt-2 w-100 historySearch')
    $(historyBtn).attr('data-name', str);
    $('#sideSection').append(historyBtn);
    
    // ensures you can click on a previously used city name without re-loading the page
    $(historyBtn).on("click", function (event){
        console.log($(event.target).attr('data-name'));
        cityName = $(event.target).attr('data-name')
        console.log(cityName);
        cityCoord();
    })
}


function renderCities(){
    for (i = 0; i < cityHistory.length; i++) {
        var historyBtn = document.createElement('button');
        $(historyBtn).text(cityHistory[i]);
        $(historyBtn).attr('class', 'btn btn-secondary mt-2 w-100 historySearch');
        $(historyBtn).attr('data-name', cityHistory[i]);
        $('#sideSection').append(historyBtn);
        $(historyBtn).on("click", function (event){
            console.log($(event.target).attr('data-name'));
            cityName = $(event.target).attr('data-name')
            console.log(cityName);
            cityCoord();
        })
        
    }
}


function init() {
    var storedCities = JSON.parse(localStorage.getItem('cityHistory'));

    if (storedCities !== null) {
        cityHistory = storedCities;
    }

    renderCities();
}

init();

$(searchBtn).on("click", function () {
    cityName = $('#cityName').val();
    cityCoord();
});