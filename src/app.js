const apiKey = "0ebc654fccbc00189d5408f3d6f15b08";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";

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
  let h1 = document.querySelector("h1");
  let span = document.querySelector("#current-temperature");
  h1.innerHTML = `${response.data.name}`;
  span.innerHTML = `${temperature}ºC`;
}

function getWeather(position) {
  let finalUrl = "";
  if (typeof position == "string") {
    finalUrl = `${baseUrl}&q=${position}&units=metric&appid=${apiKey}`;
  } else {
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    finalUrl = `${baseUrl}lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  }
  axios.get(finalUrl).then(printWeather);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getWeather);
}

getWeather("Barcelona");

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
dateElement.innerHTML = `${day} ${hours}:${minutes}`;

let submitButton = document.querySelector("#search-button");
submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  getCity();
});

let currentLocationButton = document.querySelector("#current-location-btn");
currentLocationButton.onclick = getCurrentLocation;
