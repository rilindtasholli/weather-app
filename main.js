const apiKey = '5ad5366ef19803003112548fec639f07';
const city = 'Arizona';

async function getWeather(){
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

function renderData(data){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    const date = new Date();
    document.querySelector('.main-info .day').innerText = days[date.getDay()];
    document.querySelector('.main-info .date').innerText = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    
    document.querySelector('.main-info .location span').innerText = `${data.name}, ${data.sys.country}`;
    document.querySelector('.weather-info .icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector('.weather-info .temp').innerText = `${Math.floor(data.main.temp)}°C`;
    document.querySelector('.weather-info .temp-text').innerText = data.weather[0].main;
;
}

getWeather().then((res)=>{
    console.log(res);
    renderData(res);
})
