const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');

function getWeatherIcon(desc) {
  const text = desc.toLowerCase();
  if (text.includes('sun') || text.includes('clear')) return '☀️';
  if (text.includes('partly')) return '⛅';
  if (text.includes('cloud') || text.includes('overcast')) return '☁️';
  if (text.includes('fog') || text.includes('mist')) return '🌫️';
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) return '🌧️';
  if (text.includes('snow') || text.includes('ice') || text.includes('blizzard')) return '❄️';
  if (text.includes('thunder')) return '⛈️';
  return '🌡️';
}

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  errorMessage.classList.add('hidden');
  weatherDisplay.classList.add('hidden');

  try {
    const url = `https://wttr.in{encodeURIComponent(city)}?format=j1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('City not found. Please try another search.');
    }

    const data = await response.json();
    const current = data.current_condition.at(0);
    const area = data.nearest_area.at(0);

    const cityName = area.areaName.at(0).value;
    const countryName = area.country.at(0).value;
    const description = current.weatherDesc.at(0).value;

    document.getElementById('city-name').textContent = `${cityName}, ${countryName}`;
    document.getElementById('weather-icon').textContent = getWeatherIcon(description);
    document.getElementById('temperature').textContent = current.temp_C;
    document.getElementById('condition').textContent = description;
    document.getElementById('humidity').textContent = current.humidity;

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
