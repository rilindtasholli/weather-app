const apiKey = '5ad5366ef19803003112548fec639f07';
const cityInput = 'Paris';

async function getData(){

    let result = {
        locationName: '',
        countryCode: '',
        lon: '',
        lat: '',
        weatherData: null
    }

    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        result = {
            locationName: data.name,
            countryCode: data.sys.country,
            lat: data.coord.lat,
            lon: data.coord.lon
        }
    });

    await fetch(`https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${result.lat}&lon=${result.lon}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        result.weatherData = data;
    });

    return result;
}

function renderMainData(data){
    console.log('renderMainData')
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    const date = new Date();
    document.querySelector('.main-info .day').innerText = days[date.getDay()];
    document.querySelector('.main-info .date').innerText = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    
    document.querySelector('.main-info .location span').innerText = `${data.locationName}, ${data.countryCode}`;
    document.querySelector('.weather-info .icon').src = `http://openweathermap.org/img/wn/${data.weatherData.current.weather[0].icon}@2x.png`;
    document.querySelector('.weather-info .temp').innerText = `${data.weatherData.current.temp.toFixed()}°C`;
    document.querySelector('.weather-info .temp-text').innerText = data.weatherData.current.weather[0].main;
}

function renderDetailsData(data){
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const date = new Date();

    document.querySelector('.feels-like .info-value').innerText = `${data.weatherData.current.feels_like.toFixed()} °C`
    document.querySelector('.humidity .info-value').innerText = `${data.weatherData.current.humidity.toFixed()} %`
    document.querySelector('.wind .info-value').innerText = `${data.weatherData.current.wind_speed.toFixed()} km/h`

    let forecastDays = [];
    let day = null;
    let count = date.getDay();
    for(let i = 0; i <= 3; i++){
        if(count >= 6) count=0;
        day = data.weatherData.daily[i];
        day.dayName = days[count++]
        forecastDays.push(day)
    }

    let forecast = document.querySelector('.forecast');

    forecastDays.forEach(day => {
        forecast.insertAdjacentHTML('beforeend', 
        `
        <div class="item">
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
            <span class="day">${day.dayName}</span>
            <span class="max-temp">${day.temp.max.toFixed()}°C</span>
            <span class="min-temp">${day.temp.min.toFixed()}°C</span>
        </div>
        `
        );
    })
}


getData().then((response)=>{
    console.log(response);
    renderMainData(response);
    renderDetailsData(response);
}).catch((err)=>{
    console.error(err);
});

// var mylist = document.querySelector('.forecast');
// mylist.insertAdjacentHTML('beforeend', 
// ` <div class="item active">
// <img src="" alt="">
// <span class="day">Tue</span>
// <span class="temp">29°C</span>
// </div>`
// );