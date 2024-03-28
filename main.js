const apiKey = '5ad5366ef19803003112548fec639f07';
let defaultCity = localStorage.getItem('defaultCity') || 'Prishtina'

let result = {
    locationName: '',
    countryCode: '',
    lon: '',
    lat: '',
    weatherData: null
}

search(defaultCity);

document.querySelector('#search').addEventListener('keypress', function(e){
    if (e.key === 'Enter') {
        search(this.value);
    }
});
document.querySelector('.search-container button').addEventListener('click', function(){
    let searchString = document.querySelector('#search').value;
    search(searchString);
});

function showError(){
    let errorMessage = document.querySelector('.error');
    errorMessage.style.opacity = 1;

    setTimeout(function(){
        errorMessage.style.opacity = 0;
    }, 2000)
}

function search(searchString){
    
    getData(searchString).then(()=>{
        document.querySelector('.weather-container').style.visibility = 'unset';

        displayCurrentData(result);
        displayForecast(result.weatherData)
        displayDayDetailsData(result.weatherData.daily[0]);

        document.querySelector('#search').value = '';
        localStorage.setItem('defaultCity', searchString);

    }).catch((err)=>{
        // console.error(err);
        showError();
    });

}

async function getData(cityInput){

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

    await fetch(`https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${result.lat}&lon=${result.lon}&exclude=minutely&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        result.weatherData = data;
    });

}

function displayDate(date){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.querySelector('.main-info .day').innerText = days[date.getDay()];
    document.querySelector('.main-info .date').innerText = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function displayCurrentData(data){
    const date = new Date();
    displayDate(changeTimezone(date, data.weatherData.timezone));
    
    document.querySelector('.main-info .location span').innerText = `${data.locationName}, ${data.countryCode}`;
    document.querySelector('.weather-info .icon').src = `http://openweathermap.org/img/wn/${data.weatherData.current.weather[0].icon}@2x.png`;
    document.querySelector('.weather-info .temp').innerText = `${data.weatherData.current.temp.toFixed()}°C`;
    document.querySelector('.weather-info .temp-text').innerText = data.weatherData.current.weather[0].main;
    document.querySelector('.weather-info .feels-like .info-value').innerText = `${data.weatherData.current.feels_like.toFixed()}°C`
    document.querySelector('.weather-info .humidity .info-value').innerText = `${data.weatherData.current.humidity.toFixed()}%`
    document.querySelector('.weather-info .visibility .info-value').innerText = `${(data.weatherData.current.visibility/1000).toFixed(1)}km`
    document.querySelector('.weather-info .wind .info-value').innerText = `${data.weatherData.current.wind_speed.toFixed()}km/h`
    document.querySelector('.weather-info .wind .direction').style.transform = `rotate(${data.weatherData.current.wind_deg + 45 + 90}deg)`
    document.querySelector('.weather-info .dew-point .info-value').innerText = `${data.weatherData.current.dew_point.toFixed()}°C`;
    document.querySelector('.weather-info .uv .info-value').innerText = data.weatherData.current.uvi.toFixed();
    document.querySelector('.weather-info .temp-description').innerText = data.weatherData.current.weather[0].description[0].toUpperCase() + data.weatherData.current.weather[0].description.substring(1);
    
}

function getForecastDays(data){
    let date = new Date();
    date = changeTimezone(date, data.timezone);

    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let forecastDays = [];
    let day = null;
    let count = date.getDay();

    for(let i = 0; i <= 3; i++){
        if(count > 6) count=0;
        day = data.daily[i];
        day.dayName = days[count++]
        forecastDays.push(day)
    }
    
    return forecastDays;
}

function displayForecast(data){
    let currentForecast = document.querySelectorAll('.forecast .item');
    currentForecast.forEach(day => {
        day.remove()
    })
    
    let forecastDays = getForecastDays(data);

    let forecast = document.querySelector('.forecast');
  

    forecastDays.forEach((day, i) => {
        forecast.insertAdjacentHTML('beforeend', 
        `
        <div class="item ${i == 0 ? 'active' : ''}" onclick="handleDaySelect(${i})">
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
            <span class="day">${day.dayName}</span>
            <span class="max-temp">${day.temp.max.toFixed()}°C</span>
            <span class="min-temp">${day.temp.min.toFixed()}°C</span>
        </div>
        `
        );
    })
}

function displayDayDetailsData(data){

    document.querySelector('.weather-details .description .desc span').innerText = data.weather[0].description[0].toUpperCase() + data.weather[0].description.substring(1);
    document.querySelector('.weather-details .description p').innerText = `The high will be ${data.temp.max.toFixed()}°C, the low will be ${data.temp.min.toFixed()}°C`;
    document.querySelector('.weather-details .description img').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector('.weather-details .humidity .info-value').innerText = `${data.humidity.toFixed()} %`;
    document.querySelector('.weather-details .wind .info-value').innerText = `${data.wind_speed.toFixed()} km/h`;
    document.querySelector('.weather-details .wind .direction').style.transform = `rotate(${data.wind_deg + 45 + 90}deg)`;
    document.querySelector('.weather-details .rain .info-value').innerText = `${data.rain || data.snow || data.drizzle || 0}mm ( ${(data.pop *100).toFixed()}% )`;
    document.querySelector('.weather-details .pressure .info-value').innerText = `${data.pressure} hPa`;
    document.querySelector('.weather-details .dew-point .info-value').innerText = `${data.dew_point.toFixed()}°C`;
    document.querySelector('.weather-details .uv .info-value').innerText = data.uvi.toFixed();
}

function handleDaySelect(i){
    let currentForecast = document.querySelectorAll('.forecast .item');
  
    currentForecast.forEach(day => {
        day.classList.remove('active');
    })

    currentForecast[i].classList.add('active');

    displayDayDetailsData(result.weatherData.daily[i]);
}

function changeTimezone(date, ianatz) {

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: ianatz
    }));
  
    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();
  
    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff); // needs to substract
}
