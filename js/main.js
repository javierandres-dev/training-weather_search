const d = document,
  $form = d.querySelector("form"),
  $countries = d.getElementById("countries"),
  $city = d.getElementById("city");
d.addEventListener("DOMContentLoaded", () => {
  fillCountries();
  eventListeners();
});
const eventListeners = () => {
  $form.addEventListener("submit", searchCity);
};
const searchCity = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    const country = $countries.value,
      city = $city.value,
      data = await getWeather(country, city);
    showWeather(data);
    $form.reset();
  }
};
const showWeather = (data) => {
  const $results = d.getElementById("results");
  if ($results.firstChild) {
    while ($results.firstChild) {
      $results.removeChild($results.firstChild);
    }
  }
  const $title = d.createElement("h2"),
    $figure = d.createElement("figure"),
    $icon = d.createElement("img"),
    $description = d.createElement("figcaption"),
    $subtitle = d.createElement("h3"),
    $temperature = d.createElement("h4"),
    $ul = d.createElement("ul"),
    $human = d.createElement("li"),
    $pressure = d.createElement("li"),
    $humidity = d.createElement("li"),
    $wind = d.createElement("li"),
    $clouds = d.createElement("li"),
    $tempMin = d.createElement("li"),
    $tempMax = d.createElement("li");
  $title.textContent = `${data.name}, ${data.sys.country}`;
  $icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );
  $description.textContent = `${data.weather[0].description}`;
  $subtitle.textContent = `${data.weather[0].main}`;
  $temperature.textContent = `${kelvin_to_celsius(data.main.temp).toFixed(
    1
  )} °C`;
  $human.textContent = `Human perception: ${kelvin_to_celsius(
    data.main.feels_like
  ).toFixed(1)} °C`;
  $pressure.textContent = `Atmospheric pressure: ${data.main.pressure} hPa`;
  $humidity.textContent = `Humidity: ${data.main.humidity} %`;
  $wind.textContent = `Wind speed: ${(
    parseFloat(data.wind.speed) * 3.6
  ).toFixed(2)} Km/h`;
  $clouds.textContent = `Cloudiness: ${data.clouds.all} %`;
  $tempMin.textContent = `Minimun: ${kelvin_to_celsius(
    data.main.temp_min
  ).toFixed(1)} °C`;
  $tempMax.textContent = `Maximum: ${kelvin_to_celsius(
    data.main.temp_max
  ).toFixed(1)} °C`;
  $results.appendChild($title);
  $figure.appendChild($icon);
  $figure.appendChild($description);
  $results.appendChild($figure);
  $results.appendChild($subtitle);
  $results.appendChild($temperature);
  $ul.appendChild($human);
  $ul.appendChild($pressure);
  $ul.appendChild($humidity);
  $ul.appendChild($wind);
  $ul.appendChild($clouds);
  $ul.appendChild($tempMin);
  $ul.appendChild($tempMax);
  $results.appendChild($ul);
  //console.log(data);
};
const kelvin_to_celsius = (kelvin_degrees) => {
  const kelvin = parseFloat(kelvin_degrees);
  return kelvin - 273.15;
};
async function getWeather(country_code, city_name) {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city_name},${country_code}&appid=bf98ddfab12df74a9092fa9b9b43f70e`
    );
    if (!resp.ok) throw `${resp.statusText}`;
    const data = await resp.json();
    return data;
  } catch (error) {
    showAlert(error, "warning");
  }
}
const validateForm = () => {
  const country = $countries.value,
    city = $city.value;
  if (country === "") {
    showAlert("Please choose a country.", "warning");
    return false;
  } else if (city === "") {
    showAlert("Please enter city name.", "warning");
    return false;
  } else {
    return true;
  }
};
const showAlert = (message, type) => {
  const $info = d.getElementById("info");
  $info.innerHTML = `
<p class="${type}">${message}</p>
  `;
  setTimeout(() => {
    $info.innerHTML = null;
  }, 3000);
};
const fillCountries = async () => {
  const countries = await getCountries();
  countries.forEach((country) => {
    const $country = d.createElement("option");
    $country.setAttribute("value", `${country.alpha2Code}`);
    $country.textContent = `${country.name}`;
    $countries.appendChild($country);
  });
};
async function getCountries() {
  try {
    const resp = await fetch("https://restcountries.eu/rest/v2/all");
    if (!resp.ok) throw "Error";
    const data = await resp.json();
    return data;
  } catch (error) {
    showAlert(error, "warning");
  }
}
