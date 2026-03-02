const apiKey = "e4dab62a43e3c9569164b26d09fe0075"; // 🔑 OpenWeather API key

function formatTime(ts) {
  const d = new Date(ts * 1000);
  let h = d.getHours();
  let m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  m = m < 10 ? "0" + m : m;
  return `${h}:${m} ${ampm}`;
}

/* 🔥 FINAL THEME SYSTEM */
function setTheme(weatherMain, icon) {
  const app = document.getElementById("app");

  app.classList.remove(
    "hot","cloudy","rainy","night","snow","storm"
  );

  const isNight = icon.includes("n");

  if (isNight) {
    app.classList.add("night");
    return;
  }

  switch (weatherMain) {
    case "Clear":
      app.classList.add("hot");
      break;
    case "Clouds":
      app.classList.add("cloudy");
      break;
    case "Rain":
    case "Drizzle":
      app.classList.add("rainy");
      break;
    case "Snow":
      app.classList.add("snow");
      break;
    case "Thunderstorm":
      app.classList.add("storm");
      break;
    default:
      app.classList.add("hot");
  }
}

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Enter city name");

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await res.json();

  if (data.cod !== 200) return alert("City not found");

  weatherBox.classList.remove("hidden");

  city.innerText = `${data.name}, ${data.sys.country}`;
  temp.innerText = `${Math.round(data.main.temp)}°C`;
  humidity.innerText = `${data.main.humidity}%`;
  wind.innerText = `${data.wind.speed} m/s`;
  sunrise.innerText = formatTime(data.sys.sunrise);
  sunset.innerText = formatTime(data.sys.sunset);
  condition.innerText = data.weather[0].description;

  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  setTheme(data.weather[0].main, data.weather[0].icon);

  getForecast(data.coord.lat, data.coord.lon);
}

async function getForecast(lat, lon) {
  forecast.innerHTML = "";

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await res.json();

  const days = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!days[date]) days[date] = item;
  });

  Object.values(days).slice(1, 8).forEach(d => {
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `
      <p>${new Date(d.dt * 1000).toDateString().slice(0,3)}</p>
      <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png">
      <p>${Math.round(d.main.temp)}°C</p>
    `;
    forecast.appendChild(div);
  });
}
