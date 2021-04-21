const button_get = document.querySelector('#get_weather');
const button_locate = document.querySelector('#locate');
const inputEl = document.querySelector('#input');
var API_key_weather = '8beeaebc4fe0055b9a899d663f148a31';
var API_key_iq = 'pk.faf89031dbbf489bd2fd386d5fd5b9a7';
var lat = '';
var lon = '';
var city = '';
var mycoordinates = new Array();
var temp = '';
var popis = '';
function shower(){
    document.getElementById("dnes").innerHTML = temp+ ' ' + popis+ ' ' + city;
    document.getElementById("input").value = '';
}
function getCity() {
    var lat2 = mycoordinates[0];
    var lon2 = mycoordinates[1];

    fetch('https://eu1.locationiq.com/v1/reverse.php?key=' + API_key_iq + '&lat=' + lat2 + '&lon=' + lon2 + '&format=json')
        .then(response => response.json())
        .then(data => {
            var city2 = data.display_name;
            city = city2;
            shower();
        })
}

button_get.onclick = function (event) {
    const mesto = inputEl.value

    //fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&exclude=daily&appid='+API_key+'&lang=cz')//daily 7 days only GPS
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + mesto + '&exclude=daily&appid=' + API_key_weather + '&lang=cz')//zavolame na mesto a potom si precteme GPS....
        .then(response => response.json())
        .then(data => {
            lat = data.coord.lat;
            lon = data.coord.lon;
            mycoordinates = [lat, lon];
            var popis2 = data.weather[0];//array
            popis = popis2.description; //notes
            var tempK = data.main.temp - 273.15;//Kelvin
            temp = tempK.toFixed(2); //x.00
            //city = getCity(coordinates);
            getCity(mycoordinates);
            //tady budeme vypisovat do html
            
           // document.getElementById("history").innerHTML = text;
            //document.getElementById("history").innerHTML = text;
        
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
        mycoordinates = [lat, lon];
        getCity(mycoordinates);

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
