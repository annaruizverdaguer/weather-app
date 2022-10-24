const apiKey = "0ebc654fccbc00189d5408f3d6f15b08";
const baseUrl = "https://api.openweathermap.org/data/2.5/";

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
  let city = capitalizeCity(document.querySelector("input").value);
  getWeather(city);
}

function printWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  let iconCode = response.data.weather[0].icon;
  let windSpeed = response.data.wind.speed;
  document.querySelector("h2").innerHTML = `${response.data.name}`;
  document.querySelector("#current-temperature").innerHTML = `${temperature}`;
  document.querySelector(".description").innerHTML =
    description.charAt(0).toUpperCase() + description.slice(1);
  document
    .querySelector("#current-weather-icon")
    .setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);
  document.querySelector(".wind").innerHTML = `${windSpeed} m/s`;
}

function printForecast(response) {
  let forecastContainer = document.querySelector(".forecast");
  forecastContainer.innerHTML = "";
  for (let index = 0; index < 5; index++) {
    let iconCode = response.data.list[index * 8].weather[0].icon;
    let description = response.data.list[index * 8].weather[0].description;
    let dailyForecast = document.createElement("div");
    dailyForecast.classList.add("col");
    dailyForecast.innerHTML = `<div class="card text-center">
            <div class="card-body">
              <h5 class="card-title">${week[date.getDay() + index + 1]}</h5>
              <h6 class="card-subtitle mb-2 text-muted"> 
                <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Forecast icon" class="weather-icon">
                <br/>${
                  description.charAt(0).toUpperCase() + description.slice(1)
                } 
              </h6>
            </div>
          </div>`;
    forecastContainer.appendChild(dailyForecast);
  }
}

function getWeather(position) {
  let urlParams = "";
  if (typeof position == "string") {
    urlParams = `&q=${position}&units=metric&appid=${apiKey}`;
  } else {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    urlParams = `lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  }
  axios.get(baseUrl + "weather?" + urlParams).then(printWeather);
  axios.get(baseUrl + "forecast?" + urlParams).then(printForecast);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getWeather);
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
  let temp = "";
  if (notActiveUnit.innerHTML == "ºF") {
    temp = celciusToFarenheit(temperatureElement.innerHTML);
    units.innerHTML = '<a href="#" id="link-active">ºC</a> | ºF';
  } else {
    temp = farenheitToCelcius(temperatureElement.innerHTML);
    units.innerHTML = 'ºC | <a href="#" id="link-active">ºF</a>';
  }
  temperatureElement.innerHTML = `${temp}`;
}

getWeather("Barcelona");

let submitButton = document.querySelector("#search-button");
submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  getCity();
});

let currentLocationButton = document.querySelector("#current-location-btn");
currentLocationButton.onclick = getCurrentLocation;

let currentTemperature = document.querySelector("#current-temperature");
let units = document.querySelector(".units");
units.onclick = function (e) {
  e.preventDefault();
  switchUnits(currentTemperature);
};
