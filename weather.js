// api link and api keys
const api = {
    base: "https://api.openweathermap.org/data/2.5/",
    key: "0cda204f5c471e0ad7f6cc99a5ec1249"
}
// Variables
const search = document.getElementById("search");
const searchBtn = document.querySelector(".s-btn");
// const date = document.querySelector(".date");
// Live location button
const liveBtn = document.getElementById("live-location");
// More less buttons
const moreLessBtns = document.querySelector(".more-less-btns");

// adding event listener to the search btn
searchBtn.addEventListener("click", getInput);
// Adding event listner to the live location
liveBtn.addEventListener("click", () => {
    document.querySelector(".c-names").innerText="Loading...";
    document.querySelector(".weather-five-update").style.display = "none";
    document.querySelector(".weather-updates").style.display = "none";
    document.querySelector(".weather-detail-update").style.display = "none";
    moreLessBtns.style.display = "none";
    // date.style.display = "none";
    lessDetail.style.display = "none";
    // detailedBtn.style.display = "block";
    navigator.geolocation.getCurrentPosition(getLocation,(error)=>{
        if (error.code === error.PERMISSION_DENIED) {
            document.querySelector(".c-names").innerHTML = "Location access denied. Please allow location access to get live weather updates.";
        } 
        else
        {
            document.querySelector(".c-names").innerHTML = "Unable to fetch location. Please try again.";
        }
        document.querySelector(".weather-updates").style.display = "none";
    });
});
async function getLocation(position) {
    // console.log(lon);
    try{
        const lan = position.coords.latitude;
        const lon = position.coords.longitude;
        let cityLocation = await fetch(`${api.base}weather?lat=${lan}&lon=${lon}&units=metric&appid=${api.key}`)
        cityLocation = await cityLocation.json();
        let fiveDaysCityData = await fetch(`${api.base}forecast?lat=${lan}&lon=${lon}&units=metric&appid=${api.key}`)
        fiveDaysCityData = await fiveDaysCityData.json()
        if (cityLocation.cod == "404") {
            throw new Error("Soory We cannot have weather data of your city")
        }
        else if (fiveDaysCityData.cod == "404")
        {
            throw new Error("Soory We cannot have weather data of your city")
        }
        else {
            displayData(cityLocation)
            displayFiveDaysDate(fiveDaysCityData)
        }
    }
    catch(e){
        document.querySelector(".c-names").innerHTML = `${e.message}`;
        document.querySelector(".weather-updates").style.display = "none";
        search.value = "";
    }
    
    
}

function getInput(event) {
    event.preventDefault();
    if (event.type == "click") {
        document.querySelector(".c-names").innerText = "Loading...";
        document.querySelector(".weather-five-update").style.display = "none";
        document.querySelector(".weather-updates").style.display = "none";
        document.querySelector(".weather-detail-update").style.display = "none";
        moreLessBtns.style.display = "none";
        // date.style.display = "none";
        lessDetail.style.display = "none";
        // detailedBtn.style.display = "block";
        if (!search.value) {
            document.querySelector(".c-names").innerHTML = `Enter the city Name`;
            document.querySelector(".weather-updates").style.display = "none";
        }
        else {
            getData(search.value);
        }

    }
}
async function getData(cityName) {
    try{
        response = await fetch(`${api.base}weather?q=${cityName}&units=metric&appid=${api.key}`);
        weatherData = await response.json()
        const res2 = await fetch(`${api.base}forecast?q=${cityName}&units=metric&appid=${api.key}`)
        const fiveDayData = await res2.json()
        if (weatherData.cod == "404") {
            throw new Error(`${search.value} is invalid city name`)
        }
        else if (fiveDayData.cod == "404")
        {
            throw new Error(`${search.value} is invalid city name`)
        }
        else {
            displayData(weatherData)
            displayFiveDaysDate(fiveDayData)
        }
    }catch(e){
        document.querySelector(".c-names").innerHTML = e.message;
        document.querySelector(".weather-updates").style.display = "none";
        search.value = "";
    }
    
}
function displayData(data) {
    let dt = new Date(data.dt *1000).toDateString();
    date.style.display = "block";
    date.textContent = dt;
    const city = document.querySelector(".c-names");
    city.innerText = `${data.name},${data.sys.country}`;
    const icon = document.getElementById("icon-img");
    const iconURL = "http://openweathermap.org/img/w/";
    icon.src = iconURL + data.weather[0].icon + ".png";
    icon.alt = data.weather[0].description;
    const temp = document.querySelector(".temp");
    temp.innerText = `Temp: ${data.main.temp}°C`;
    const weather = document.querySelector(".weather-condition");
    weather.innerText = `weather: ${data.weather[0].main}`
    // moreLessBtns.style.display = "block";
    // ? display is here that it will display as fast as it can
    document.querySelector(".weather-updates").style.display = "flex";
    search.value = "";
    // ? Detailed Allocation Start here
    const dIcon = document.getElementById("d-icon-img");
    const dIconURL = "http://openweathermap.org/img/w/";
    dIcon.src = dIconURL + data.weather[0].icon + ".png";
    const dTemp = document.querySelector(".d-temp");
    dTemp.innerText = `Temp: ${data.main.temp}°C`;
    const tempRange = document.querySelector(".temp-range");
    tempRange.innerText = `max:${data.main.temp_max}°C, min:${data.main.temp_min}°C`;
    const feelTemp = document.querySelector(".feels-temp");
    feelTemp.innerHTML = `Feels Like: ${Math.round(data.main.feels_like)}°C`
    const wind = document.querySelector(".wind");
    wind.innerText = `Wind Speed:${data.wind.speed}m/s`
    const humidity = document.querySelector(".humidity");
    humidity.innerText = `Humidity:${data.main.humidity}%`;
    const dDescription = document.querySelector(".w-description");
    dDescription.innerHTML = ` ${data.weather[0].description}`;
    // Sunrise And sunset Things
    let timeRise = new Date(data.sys.sunrise*1000).toTimeString();
    let timeSet = new Date(data.sys.sunset *1000 ).toTimeString();
    const sunrise = document.querySelector(".sunrise");
    sunrise.innerHTML = `<b>sunrise</b>: ${timeRise}`;
    const sunset = document.querySelector(".sunset");
    sunset.innerHTML = `<b>sunset</b>: ${timeSet}` ;
    const pressure = document.querySelector(".pressure-info");
    pressure.innerHTML = `Pressure: ${data.main.pressure}hPa`;
    const visibility = document.querySelector('.visibility-info');
    visibility.innerHTML = `visibility: ${data.visibility / 1000}km`;
    const lan = document.querySelector('.lan-info');
    lan.innerHTML = `Latitude: ${data.coord.lat}`;
    const lon = document.querySelector('.lon-info');
    lon.innerHTML = `Longitude: ${data.coord.lon}`;
}
function displayFiveDaysDate(wdata){
    let i = 0
    let j = 0
    while(i<40)
    {
        const dIconURL = "http://openweathermap.org/img/w/";
        const dt = new Date(wdata.list[i].dt * 1000) 
        const dateShow = document.getElementById(`date-${j}`)
        const imgShow = document.getElementById(`five-img-${j}`)
        // accesing detailed show
        const dDateShow = document.getElementById(`five-dt-${j}`)
        const dimgShow = document.getElementById(`fd-img-${j}`)
        const dTempShow = document.querySelector(`.fd-temp-${j}`)
        console.log(dTempShow)
        const dFeelsShow = document.querySelector(`.fd-feels-${j}`)
        const dHumidityShow = document.querySelector(`.fd-humidity-${j}`)
        const dVisibilityShow = document.querySelector(`.fd-visibility-${j}`)
        // normal showcase
        dateShow.textContent = dt.toDateString()
        const imgLink = dIconURL + wdata.list[i].weather[0].icon+".png"
        imgShow.setAttribute("src",imgLink)
        // detailed Showcasing
        dDateShow.textContent = dt.toDateString()
        dimgShow.setAttribute("src", imgLink)
        console.log(wdata.list[i].main.temp)
        dTempShow.textContent = `temp: ${wdata.list[i].main.temp} °C`
        dFeelsShow.textContent = `Feels Like: ${wdata.list[i].main.feels_like} °C`
        dHumidityShow.textContent = `Humidity: ${wdata.list[i].main.humidity}`
        dVisibilityShow.textContent = `Visibility ${wdata.list[i].visibility / 1000}km`
        i+=8
        j++
    }
    const fiveDayDataShow = document.querySelector(".weather-five-update")
    fiveDayDataShow.style.display = "flex"
}
const weatherUpDiv = document.querySelector(".weather-updates");
const lessDetail = document.querySelector(".less-btn");
weatherUpDiv.addEventListener("click", () => {
    // detailedBtn.style.display = "none";
    lessDetail.style.display = "block";
    moreLessBtns.style.display = "block";
    document.querySelector(".weather-five-update").style.display = "none";
    document.querySelector(".weather-updates").style.display = "none";
    document.querySelector(".weather-detail-update").style.display = "flex";
});
lessDetail.addEventListener("click", () => {
    lessDetail.style.display = "none";
    moreLessBtns.style.display = "none";
    // detailedBtn.style.display = "block";
    document.querySelector(".weather-five-update").style.display = "flex";
    document.querySelector(".weather-detail-update").style.display = "none";
    document.querySelector(".weather-updates").style.display = "flex";
})
// detailed Button taking care
const weatherDetailedBtn = document.querySelector(".weather-five-update")
weatherDetailedBtn.addEventListener("click",()=>{
    moreLessBtns.style.display = "block";
    document.querySelector(".more-btn").style.display = "block"
    document.querySelector(".weather-five-update").style.display = "none";
    document.querySelector(".weather-updates").style.display = "none";
    document.querySelector(".five-detail-update").style.display = "flex"
})
const weatherDetailedLessBtn = document.querySelector(".more-btn")
weatherDetailedLessBtn.addEventListener("click",()=>{
    weatherDetailedLessBtn.style.display = "none"
    document.querySelector(".weather-five-update").style.display = "flex";
    document.querySelector(".weather-updates").style.display = "flex";
    document.querySelector(".five-detail-update").style.display = "none"
})


// todo need to change the date function as it is taking my date 
// function dateFunction(d) {
//     let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     let day = days[d.getDay()];
//     let date = d.getDate();
//     let month = months[d.getMonth()];
//     let year = d.getFullYear();
//     return `${day},${date} ${month} ${year}`
// }
// // ? converting the seconds to the time
// function timeConvert(totalseconds) {
//     const hour = Math.floor((totalseconds / 3600) % 24);
//     const minutes = Math.floor((totalseconds / 60) % 60);
//     const seconds = Math.floor(totalseconds % 60);
//     console.log(hour, minutes, seconds);
//     return `${hour}hr : ${minutes}min : ${seconds}seconds`
// }

