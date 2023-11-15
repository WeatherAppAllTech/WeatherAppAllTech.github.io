// Estado
let currCity = "Londres"; // Ciudad inicial
let units = "metric"; // Unidades iniciales (celsius)

// Selectores
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax");
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

// Función para convertir la marca de tiempo en una fecha y hora legibles
function convertTimeStamp(timestamp, timezone) {
    const convertTimezone = timezone / 3600; // Convertir segundos a horas

    const date = new Date(timestamp * 1000);

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("es-ES", options);
}

// Función para convertir el código de país en el nombre del país
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["es"], { type: "region" });
    return regionNames.of(country);
}

// Función para obtener el estado del tiempo en español
function obtenerEstadoDelTiempoEnEspanol(description) {
    const traducciones = {
        "clear sky": "cielo despejado",
        "few clouds": "pocas nubes",
        "scattered clouds": "nubes dispersas",
        "broken clouds": "nubes rotas",
        "overcast clouds": "nubosidad completa",
        "light rain": "lluvia ligera",
        "moderate rain": "lluvia moderada",
        "heavy rain": "lluvia intensa",
        "thunderstorm": "tormenta",
        "snow": "nieve",
        "mist": "neblina",
        // Puedes agregar más traducciones según sea necesario
    };

    return traducciones[description.toLowerCase()] || description;
}

// Función para obtener el pronóstico del tiempo
function getWeather() {
    const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
            // Cambiar el texto del estado del tiempo al español
            let estadoDelTiempo = obtenerEstadoDelTiempoEnEspanol(data.weather[0].description);
            weather__forecast.innerHTML = `<p>${estadoDelTiempo}</p>`;
            weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
            weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" />`;
            weather__minmax.innerHTML = `<p>Mín: ${data.main.temp_min.toFixed()}&#176</p><p>Máx: ${data.main.temp_max.toFixed()}&#176</p>`;
            weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
            weather__humidity.innerHTML = `${data.main.humidity}%`;
            weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
            weather__pressure.innerHTML = `${data.main.pressure} hPa`;
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

// Manejador de eventos para el envío del formulario de búsqueda
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // Prevenir la acción predeterminada
    e.preventDefault();
    // Cambiar la ciudad actual
    currCity = search.value;
    // Obtener el pronóstico del tiempo
    getWeather();
    // Limpiar el formulario
    search.value = ""
});

// Manejadores de eventos para cambiar las unidades
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if (units !== "metric") {
        // Cambiar a unidades métricas
        units = "metric";
        // Obtener el pronóstico del tiempo
        getWeather();
    }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if (units !== "imperial") {
        // Cambiar a unidades imperiales
        units = "imperial";
        // Obtener el pronóstico del tiempo
        getWeather();
    }
});

// Llamar a getWeather() al cargar la página
window.addEventListener('load', getWeather);
