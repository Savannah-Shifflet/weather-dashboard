var searchBtn = $('#searchBtn');
var searchCard = $('#searchCard');
var cityName = '';

var geoURL = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var apiKey = '&appid=a6249de91a8f3cbb556fdd4308539cf7';

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
                console.log(latitude)
                console.log(longitude)
            } else {
                var error = document.createElement('p');
                $(error).text('Please enter a valid city name');
                $(error).attr('style', 'color: red; font-style: italic');
                $(searchCard).append(error);
            }
        })
}

$(searchBtn).on("click", function () {
    cityName = $('#cityName').val();
    console.log(cityName);
    cityCoord();
})