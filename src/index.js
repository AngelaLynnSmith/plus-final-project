function refreshWeather(response) {
	let temperatureElement = document.querySelector("#temperature");
	let temperature = response.data.temperature.current;
	let cityElement = document.querySelector("#city");
	let descriptionElement = document.querySelector("#description");
	let humidityElement = document.querySelector("#humidity");
	let windSpeedElement = document.querySelector("#wind-speed");
	let timeElement = document.querySelector("#time");
	let date = new Date(response.data.time * 1000);
	let iconElement = document.querySelector("#icon");

	cityElement.innerHTML = response.data.city;
	timeElement.innerHTML = formatDate(date);
	descriptionElement.innerHTML = response.data.condition.description;
	humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
	windSpeedElement.innerHTML = `${response.data.wind.speed}m/ph`;
	temperatureElement.innerHTML = Math.round(temperature);
	iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
	console.log(response.data);
	getForecast(response.data.coordinates);
}

function formatDate(date) {
	let minutes = date.getMinutes();
	let hours = date.getHours();
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let day = days[date.getDay()];

	if (minutes < 10) {
		minutes = `0${minutes}`;
	}

	return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
	let apiKey = "cc8ad09bc07492ceeb391dfbot84812f";
	let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
	axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
	event.preventDefault();
	let searchInput = document.querySelector("#search-form-input");

	searchCity(searchInput.value);
}

function formatDay(timestamp) {
	let date = new Date(timestamp * 1000);
	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return days[date.getDay()];
}

function getForecast(coordinates) {
	console.log(coordinates);
	let apiKey = "cc8ad09bc07492ceeb391dfbot84812f";
	let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;
	console.log(apiUrl);
	axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
	let forecast = response.data.daily;

	let forecastElement = document.querySelector("#forecast");

	let forecastHTML = `<div class="row">`;
	forecast.forEach(function (forecastDay, index) {
		console.log(forecastDay);
		if (index < 6) {
			forecastHTML =
				forecastHTML +
				`
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
        <img
          src="${forecastDay.condition.icon_url}"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
						forecastDay.temperature.maximum
					)}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
						forecastDay.temperature.minimum
					)}° </span>
        </div>
      </div>
  `;
		}
	});

	forecastHTML = forecastHTML + `</div>`;
	forecastElement.innerHTML = forecastHTML;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Madrid");
