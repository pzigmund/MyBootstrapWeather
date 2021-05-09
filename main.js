const button_get = document.querySelector('#get_weather');
const button_locate = document.querySelector('#locate');
const inputEl = document.querySelector('#input');
var API_key_weather = '8beeaebc4fe0055b9a899d663f148a31';
var API_key_iq = 'pk.faf89031dbbf489bd2fd386d5fd5b9a7';


var lat = '';
var lon = '';
var mycoordinates = new Array();

var city = '';
var temp = '';
var popis = '';
var dt = '';

var day_plus_one_temp;
var day_plus_one_desc;
var day_plus_two_temp;
var day_plus_two_desc;
var datum;
var datum1;
var datum2;
let history = [];
/*
function timeConverter(){
    var a = new Date(dt * 1000);
    var months = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Záři','Říjen','Listopad','Prosinec'];
   // var year = a.getFullYear();
    var month = months[a.getMonth()];
    var month_n = a.getMonth();
    var date = a.getDate();
   // var hour = a.getHours();
   // var min = a.getMinutes();
   // var sec = a.getSeconds();
   // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
      var time = date + ' ' + month + ' ' + year;
      console.log(time);
    return time;
  }
  */
function timeConverter2(timestamp) {
    var a = new Date(timestamp * 1000);
    var month_n = a.getMonth();
    var date = a.getDate();
    var time = [date, month_n];
    //console.log(time);
    return time;
}
function shower_history(){
    if(localStorage.getItem('history')){
        history = JSON.parse(localStorage.getItem('history'));
        var moje_hisotrie = '';
        for (let index = 0; index < history.length; index++) {
            moje_hisotrie = moje_hisotrie + ' ' + history[index].date + ' ' + history[index].temperature + '°C' + ' ' + '<b>' +history[index].description + '</b>' + ' '  + history[index].city + '<br>' + '<br>'; }
        document.getElementById("history").innerHTML = moje_hisotrie;

    }
}

function shower() {
    document.getElementById("prvni_1").innerHTML = temp + '°C';
    document.getElementById("prvni_2").innerHTML = popis;
    document.getElementById("prvni_3").innerHTML = datum;

    document.getElementById("druhy_1").innerHTML = day_plus_one_temp + '°C';
    document.getElementById("druhy_2").innerHTML = day_plus_one_desc;
    document.getElementById("druhy_3").innerHTML = datum1;

    document.getElementById("treti_1").innerHTML = day_plus_two_temp + '°C';
    document.getElementById("treti_2").innerHTML = day_plus_two_desc;
    document.getElementById("treti_3").innerHTML = datum2;

    document.getElementById("input").value = city;

   history.unshift({
        temperature: temp ,
        description: popis ,
        date: datum ,
        city: city
    });

    localStorage.setItem('history', JSON.stringify(history));
    shower_history();

}
function getCity() {
    lat = mycoordinates[0];
    lon = mycoordinates[1];

    fetch('https://eu1.locationiq.com/v1/reverse.php?key=' + API_key_iq + '&lat=' + lat + '&lon=' + lon + '&format=json')
        .then(response => response.json())
        .then(data => {
            var city2 = data.display_name;
            city = city2;
            shower();
        })

}
function get7day() {
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=daily&appid=' + API_key_weather + '&lang=cz')
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            // var city_name = data.name; //city name
            var popis2 = data.current.weather[0];//array
            // console.log(popis2);
            popis = popis2.description; //notes
            var tempK = data.current.temp - 273.15;//Kelvin
            temp = tempK.toFixed(2); //x.00
            var current = timeConverter2(data.current.dt);
            var currentdate = current[0];
            var currentmonth = current[1];
            datum = currentdate + '.' + (currentmonth + 1)
            for (let index = 0; index < 48; index++) {
                var time = timeConverter2(data.hourly[index].dt);
                var date = time[0];
                var month = time[1];
                if (currentmonth == month) {
                    if (currentdate == (date - 1)) {
                        //tady je day+1
                        day_plus_one_desc = data.hourly[index].weather[0].description;
                        var temp_temp = data.hourly[index].temp - 273.15
                        day_plus_one_temp = temp_temp.toFixed(2);
                        datum1 = date + '.' + (month + 1)
                    }
                    if (currentdate == (date - 2)) {
                        //tady je day+2
                        day_plus_two_desc = data.hourly[index].weather[0].description;
                        var temp_temp = data.hourly[index].temp - 273.15;
                        day_plus_two_temp = temp_temp.toFixed(2);
                        datum2 = date + '.' + (month + 1)

                    }
                }


            }
            getCity();

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
            get7day(mycoordinates);
            //  var popis2 = data.weather[0];//array
            //  popis = popis2.description; //notes
            //  var tempK = data.main.temp - 273.15;//Kelvin
            // temp = tempK.toFixed(2); //x.00
            //city = getCity(coordinates);
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
        get7day(mycoordinates);
        return;

    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

   shower_history();


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
