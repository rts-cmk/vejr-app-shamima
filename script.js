
async function getCoordinates(city) {
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${token}`;
  const response = await fetch(geoUrl);
  if (!response.ok) {
    throw new Error(`Fejl ved geokodning (HTTP ${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Byen "${city}" findes ikke (ingen koordinater fundet).`);
  }
  const first = data[0];
  return {
    lat: first.lat,
    lon: first.lon,
    name: first.name,
    state: first.state,
    country: first.country
  };
}

async function fetchWeather(lat, lon) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${token}`;
  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error(`Fejl ved hentning af vejrdata (HTTP ${response.status})`);
  }
  const weatherData = await response.json();
  return weatherData;
}

async function getWeather() {
  const cityInput = document.getElementById("cityInput").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const weatherResult = document.getElementById("weatherResult");
  const cityNameEl = document.getElementById("cityName");
  const coordsEl = document.getElementById("coords");
  const temperatureEl = document.getElementById("temperature");
  const weatherIconEl = document.getElementById("weatherIcon");

  errorMessage.textContent = "";
  weatherResult.classList.add("hidden");

  if (!cityInput) {
    errorMessage.textContent = "Indtast venligst et bynavn.";
    return;
  }

  try {
    const { lat, lon, name, state, country } = await getCoordinates(cityInput);
    const weatherData = await fetchWeather(lat, lon);
    const temp = weatherData.main.temp;
    const iconCode = weatherData.weather[0].icon;
    const description = weatherData.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    cityNameEl.textContent = `${name}${state ? ", " + state : ""}${country ? ", " + country : ""}`;
    coordsEl.textContent = `Koordinater: Latitude: ${lat.toFixed(4)}, Longitude: ${lon.toFixed(4)}`;
    temperatureEl.textContent = `Temperatur: ${temp} °C, Beskrivelse: ${description}`;
    weatherIconEl.src = iconUrl;
    weatherIconEl.alt = description;

    weatherResult.classList.remove("hidden");
  } catch (err) {
    errorMessage.textContent = `Der opstod en fejl: ${err.message}`;
  }
}
document.getElementById("btnGetWeather").addEventListener("click", getWeather);
