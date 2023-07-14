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
            // TODO add weather symbol to title
            $(cityTitle).text(cityName + ' - ' + todaysDate);
            $(todayTemp).text('Temp: ' + data.current.temp.toString() + ' °F');
            $(todayWind).text('Wind: ' + data.current.wind_speed.toString() + ' MPH');
            $(todayHumidity).text('Humidity: ' + data.current.humidity.toString() + ' %');
            var iconSrc = ('https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png');
            $(todayIcon).attr('src', iconSrc);
        })
}

$(searchBtn).on("click", function () {
    cityName = $('#cityName').val();
    console.log(cityName);
    cityCoord();
})