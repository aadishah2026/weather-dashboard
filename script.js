const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');

function getWeatherDetails(code) {
  if (code === 0) return { icon: '☀️', text: 'Clear Sky' };
  if (code >= 1 && code <= 3) return { icon: '⛅', text: 'Partly Cloudy' };
  if (code >= 45 && code <= 48) return { icon: '🌫️', text: 'Foggy' };
  if (code >= 51 && code <= 67) return { icon: '🌧️', text: 'Rain' };
  if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Snow' };
  if (code >= 80 && code <= 82) return { icon: '🌦️', text: 'Rain Showers' };
  if (code >= 95) return { icon: '⛈️', text: 'Thunderstorm' };
  return { icon: '🌡️', text: 'Cloudy' };
}

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  errorMessage.classList.add('hidden');
  weatherDisplay.classList.add('hidden');

  try {
    // 1. Convert city name to latitude & longitude
    const geoUrl = `https://open-meteo.com{encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found. Please try another search.');
    }

    // Grab the first result from the array
    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Fetch current temperature, humidity, and weather code
    const weatherUrl = `https://open-meteo.com{latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;
    const details = getWeatherDetails(current.weather_code);

    // 3. Update the HTML elements
    document.getElementById('city-name').textContent = `${name}, ${country}`;
    document.getElementById('weather-icon').textContent = details.icon;
    document.getElementById('temperature').textContent = Math.round(current.temperature_2m);
    document.getElementById('condition').textContent = details.text;
    document.getElementById('humidity').textContent = current.relative_humidity_2m;

    weatherDisplay.classList.remove('hidden');
  } catch (err) {
    errorMessage.textContent = err.message;
    errorMessage.classList.remove('hidden');
  }
}

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchWeather();
});