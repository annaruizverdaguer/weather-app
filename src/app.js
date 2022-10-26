const apiKey = "0ebc654fccbc00189d5408f3d6f15b08";
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const geoUrl = "https://api.openweathermap.org/geo/1.0/direct?";
const reverseGeoUrl = "https://api.openweathermap.org/geo/1.0/reverse?";
let currentCity = "Barcelona";

let week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let date = new Date();
let day = week[date.getDay()];
let hours = date.getHours();
let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

let dateElement = document.querySelector("#current-date");
dateElement.innerHTML = `📅 ${day} 🕐 ${hours}:${minutes}`;

function capitalizeCity(city) {
  let capCity = "";

  if (city.split(" ").length > 1) {
    let words = city.split(" ");
    let capWords = [];
    words.forEach(function (word) {
      let capWord = word.charAt(0).toUpperCase() + word.slice(1);
      capWords.push(capWord);
    });
    capCity = capWords.join(" ");
  } else {
    capCity = city.charAt(0).toUpperCase() + city.slice(1);
  }
  return capCity;
}

function getCity() {
  currentCity = capitalizeCity(document.querySelector("input").value);
  getCoordinates(currentCity);
}

function printWeather(response) {
  let temperature = Math.round(response.current.temp);
  let description = response.current.weather[0].description;
  let iconCode = response.current.weather[0].icon;
  let windSpeed = response.current.wind_speed;
  document.querySelector("h2").innerHTML = currentCity;
  document.querySelector("#current-temperature").innerHTML = `${temperature}`;
  document.querySelector(".description").innerHTML =
    description.charAt(0).toUpperCase() + description.slice(1);
  document
    .querySelector("#current-weather-icon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    );
  document.querySelector(".wind").innerHTML = `${windSpeed} m/s`;
}

function printForecast(response) {
  let forecastContainer = document.querySelector(".forecast");
  forecastContainer.innerHTML = "";
  for (let index = 1; index < response.daily.length; index++) {
    let date = new Date(response.daily[index].dt * 1000);
    let day = week[date.getDay()];
    let maxTemp = Math.round(response.daily[index].temp.max);
    let minTemp = Math.round(response.daily[index].temp.min);
    let iconCode = response.daily[index].weather[0].icon;
    let dailyForecast = document.createElement("div");
    dailyForecast.classList.add("col");
    dailyForecast.innerHTML = `<div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">${day}</h5>
              <h6 class="card-subtitle mb-2 text-muted"> 
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Forecast icon" class="weather-icon">
                <br/>
                <span class="forecast-temperature max-temp">${maxTemp}</span>º 
                <span class="forecast-temperature">${minTemp}</span>º
              </h6>
            </div>
          </div>`;
    forecastContainer.appendChild(dailyForecast);
  }
}

function printInfo(response) {
  printWeather(response);
  printForecast(response);
}

function getForecast(latitude, longitude) {
  let params = `onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${apiKey}`;
  axios.get(baseUrl + params).then((response) => printInfo(response.data));
}

function getCoordinates(city) {
  let params = `&q=${city}&appid=${apiKey}`;
  axios
    .get(geoUrl + params)
    .then((response) =>
      getForecast(response.data[0].lat, response.data[0].lon)
    );
}

function getCityFromCoordinates(latitude, longitude) {
  let params = `&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  axios
    .get(reverseGeoUrl + params)
    .then((response) => (currentCity = response.data[0].name));
  getForecast(latitude, longitude);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition((position) =>
    getCityFromCoordinates(position.coords.latitude, position.coords.longitude)
  );
}

function celciusToFarenheit(celcius) {
  let farenheit = (celcius * 9) / 5 + 32;
  return Math.round(farenheit);
}

function farenheitToCelcius(farenheit) {
  let celcius = ((farenheit - 32) * 5) / 9;
  return Math.round(celcius);
}

function switchUnits(temperatureElement) {
  let notActiveUnit = document.querySelector("#link-active");
  let forecastTemperatureElements = document.querySelectorAll(
    ".forecast-temperature"
  );
  let temp = "";
  if (notActiveUnit.innerHTML == "ºF") {
    temp = celciusToFarenheit(temperatureElement.innerHTML);
    forecastTemperatureElements.forEach(function (element) {
      let value = celciusToFarenheit(parseInt(element.textContent));
      element.textContent = value;
    });
    unitsClickable.innerHTML = '<a href="#" id="link-active">ºC</a> | ºF';
  } else {
    temp = farenheitToCelcius(temperatureElement.innerHTML);
    forecastTemperatureElements.forEach(function (element) {
      let value = farenheitToCelcius(parseInt(element.textContent));
      element.textContent = value;
    });
    unitsClickable.innerHTML = 'ºC | <a href="#" id="link-active">ºF</a>';
  }
  temperatureElement.innerHTML = `${temp}`;
}

getCoordinates(currentCity);

let submitButton = document.querySelector("#search-button");
submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  getCity();
  document.querySelector("input").value = "";
});

let currentLocationButton = document.querySelector("#current-location-btn");
currentLocationButton.onclick = getCurrentLocation;

let currentTemperature = document.querySelector("#current-temperature");
let unitsClickable = document.querySelector(".units");
unitsClickable.onclick = function (e) {
  e.preventDefault();
  switchUnits(currentTemperature);
};
