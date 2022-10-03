function formatDate(timestamp) {
  let now = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let hours = now.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let min = now.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let text = `${day} ${hours}:${min}, ${month} ${date}`;
  return text;
}

function formatDay(timestamp) {
  let now = new Date(timestamp);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];
  return day;
}

function showForecast(response) {
  let forecast = document.querySelector("#forecast");

  let forecastInfo = response.data.list;

  let forecastHTML = `<div class="row">`;
  forecastInfo.forEach(function (dayInfo) {
    if (dayInfo.dt_txt.match("00:00:00")) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
          <div class="forecast-day">
            ${formatDay(dayInfo.dt * 1000)}
          </div>
          <div class="row">
            <div class="col-6">
              <img 
              src="http://openweathermap.org/img/wn/${
                dayInfo.weather[0].icon
              }@2x.png" 
              alt=${dayInfo.weather[0].description} 
              class="forecast-icon" />
            </div>
            <div class="col-6">
              <div class="forecast-temperature">
                <strong>${dayInfo.main.temp_max.toFixed(0)}°</strong>
                <br />
                ${dayInfo.main.temp_min.toFixed(0)}°
              </div>
            </div>
          </div>
        </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecast.innerHTML = forecastHTML;
}

function getForecast(city) {
  let apiKey = "3e5761385c02293899defe61082c2901";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  let temperature = document.querySelector("#current-temperature");
  let max = document.querySelector("#max");
  let min = document.querySelector("#min");
  let city = document.querySelector("#city");
  let description = document.querySelector("#description");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let date = document.querySelector("#date");
  let icon = document.querySelector("#icon");

  temperature.innerHTML = response.data.main.temp.toFixed(0);
  max.innerHTML = response.data.main.temp_max.toFixed(0);
  min.innerHTML = response.data.main.temp_min.toFixed(0);
  city.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = response.data.wind.speed.toFixed(0);
  date.innerHTML = formatDate(response.data.dt * 1000);
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.name);
}

function searchCity(city) {
  let apiKey = "3e5761385c02293899defe61082c2901";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function submit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  searchCity(searchInput.value);
  getForecast(searchInput.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", submit); 

  let cities = document.querySelector("#cities");

  let cityName = ["London", "Paris", "Rome", "Berlin", "Kyiv"];

  let cityNameHTML = `<div class="row">`;
  cityName.forEach(function (city) {
    cityNameHTML =
      cityNameHTML +
      `<div class="col">
    <a href="#" class="city-link" id="city-link">${city}</a>
    </div>`;
  });

  cityNameHTML = cityNameHTML + `</div>`;

  cities.innerHTML = cityNameHTML;


let citiesLink = document.querySelectorAll("#city-link");
citiesLink.forEach(function (cityLink) {
  cityLink.addEventListener("click", function () {
    searchCity(this.innerHTML);
  });
});

searchCity("Kyiv");