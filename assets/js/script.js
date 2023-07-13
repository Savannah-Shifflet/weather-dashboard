var geoURL = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var apiKey = '&appid=a6249de91a8f3cbb556fdd4308539cf7';
var cityName = 'Austin'

fetch(geoURL + cityName + apiKey) 
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        var latitude = data.city.coord.lat;
        var longitude = data.city.coord.lon;
        console.log(latitude)
        console.log(longitude)
    })