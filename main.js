const button_get = document.querySelector('#get_weather');
const button_locate = document.querySelector('#locate');
const inputEl = document.querySelector('#input');
var API_key_weather = '8beeaebc4fe0055b9a899d663f148a31';
var API_key_iq = 'pk.faf89031dbbf489bd2fd386d5fd5b9a7';
var lat = '';
var lon = '';
var city = '';


button_get.onclick = function (event) {
    const mesto = inputEl.value
    console.log(mesto);

    //fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=daily&appid='+API_key+'&lang=cz')//daily 7 days only GPS
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + mesto + '&exclude=daily&appid=' + API_key + '&lang=cz')//zavolame na mesto a potom si precteme GPS....
        .then(response => response.json())
        .then(data => {
            var gps_lat = data.coord.lat;
            var gps_lon = data.coord.lon;
            var city_name = data.name; //city name
            var popis = data.weather[0];//array
            var popis2 = popis.description; //notes
            var tempK = data.main.temp - 273.15;//Kelvin
            var temp = tempK.toFixed(2); //x.00

        })
}
button_locate.onclick = function (event) {//get GPS and find by gps
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        lat = crd.latitude.toString();
        lon = crd.longitude.toString();
        var coordinates = [lat,lon];
        city = getCity(coordinates);
        
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=daily&appid=' + API_key_weather + '&lang=cz')//daily 7 days only GPS
            .then(response => response.json())
            .then(data => {
                console.log(data);
               // var city_name = data.name; //city name
                var popis = data.current.weather[0];//array
                var popis2 = popis.description; //notes
                var tempK = data.current.temp - 273.15;//Kelvin
                var temp = tempK.toFixed(2); //x.00
                
            })



        
        return;

    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}


/*
function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lon = coordinates[1];
    var URL = 'https://eu1.locationiq.com/v1/reverse.php?key='+API_key_iq+'&lat='+lat+'&lon='+lon+'&format=json';
    console.log(URL);
    xhr.open('GET', URL, true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var city = response.address.city;
            var city2 = response.address.suburb;
            var city3 = response.address.country;
            console.log(city);
            return;
        }
    }
}

*/
function getCity(coordinates) {
    var lat = coordinates[0];
    var lon = coordinates[1];
    fetch('https://eu1.locationiq.com/v1/reverse.php?key='+API_key_iq+'&lat='+lat+'&lon='+lon+'&format=json')
    .then(response => response.json())
    .then(data => {
        city = data.display_name;
        return city;

    })
    return;
}
