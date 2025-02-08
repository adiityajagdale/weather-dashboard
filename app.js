const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    windSpeed = document.querySelector(".wind-speed"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query");

let currentCity = "Sangli";
let currentUnit = "C";
let hourlyorWeek = "Week";

function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    hour = hour % 12 || 12;
    let ampm = now.getHours() >= 12 ? "PM" : "AM";
    minute = minute < 10 ? "0" + minute : minute;

    return `${days[now.getDay()]}, ${hour}:${minute} ${ampm}`;
}

date.innerText = getDateTime();
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                // Use a reverse geocoding API to get city name from lat/lon
                fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`)
                    .then(response => response.json())
                    .then(data => {
                        currentCity = data.city || "Sangli"; // Fallback if API fails
                        getWeatherData(currentCity, currentUnit, hourlyorWeek);
                    })
                    .catch(err => {
                        console.error("Error fetching location:", err);
                        getWeatherData("Maharashtra", currentUnit, hourlyorWeek); // Fallback to Sangli
                    });
            },
            (error) => {
                console.warn("Geolocation permission denied or error:", error);
                getWeatherData("Maharashtra", currentUnit, hourlyorWeek); // Fallback to Sangli
            }
        );
    } else {
        console.warn("Geolocation not supported");
        getWeatherData("Maharashtra", currentUnit, hourlyorWeek); // Fallback to Sangli
    }
}

// Call the function on page load
getUserLocation();

function getWeatherData(city, unit, hourlyorWeek) {
    const apiKey = "2VXNCLWCN2QYBZTHRJU89EP8Q";
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`
    )
        .then(response => response.json())
        .then(data => {
            let today = data.currentConditions;
            temp.innerText = unit === "C" ? today.temp : celciusToFahrenheit(today.temp);
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = `Perc - ${today.precip}%`;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = `${today.humidity}%`;
            visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureHumidityStatus(today.humidity);
            mainIcon.src = getIcon(today.icon);
            updateForecast(data.days, unit, "week");
        })
        .catch(() => alert("Invalid Entry"));
}

function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureHumidityStatus(humidity) {
    humidityStatus.innerText = humidity <= 30 ? "Low" : humidity <= 60 ? "Moderate" : "High";
}

function getIcon(condition) {
    const icons = {
        "Partly-cloudy-day": "icons/sun/27.png",
        "partly-cloudy-night": "icons/moon/15.png",
        "rain": "icons/rain/39.png",
        "clear-day": "icons/sun/26.png",
        "clear-night": "icons/moon/10.png"
    };
    return icons[condition] || "icons/sun/26.png";
}

function getDayName(date) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(date).getDay()];
}

function updateForecast(data, unit) {
    weatherCards.innerHTML = "";
    for (let i = 0; i < 7; i++) {
        let dayData = data[i];
        let card = document.createElement("div");
        card.classList.add("card");
        let dayTemp = unit === "F" ? celciusToFahrenheit(dayData.temp) : dayData.temp;
        card.innerHTML = `
            <h2 class="day-name">${getDayName(dayData.datetime)}</h2>
            <div class="card-icon"><img src="${getIcon(dayData.icon)}" alt="" /></div>
            <div class="day-temp"><h2 class="temp">${dayTemp}</h2><span class="temp-unit">°${unit.toUpperCase()}</span></div>
        `;
        weatherCards.appendChild(card);
    }
}

fahrenheitBtn.addEventListener("click", () => changeUnit("F"));
celciusBtn.addEventListener("click", () => changeUnit("C"));

function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        tempUnit.forEach(elem => elem.innerText = `°${unit.toUpperCase()}`);
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

weekBtn.addEventListener("click", () => getWeatherData(currentCity, currentUnit, "week"));

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (search.value) {
        currentCity = search.value;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
});
// Temperature unit toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    const celciusBtn = document.querySelector('.celcius');
    const fahrenheitBtn = document.querySelector('.fahrenheit');

    celciusBtn.addEventListener('click', function () {
        celciusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
        // Add your temperature conversion logic here
    });

    fahrenheitBtn.addEventListener('click', function () {
        fahrenheitBtn.classList.add('active');
        celciusBtn.classList.remove('active');
        // Add your temperature conversion logic here
    });
});
