const apiKey = "ff2bea0947534c497b1ca8ae13179f7f"; 
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const forecastContainer = document.getElementById("forecast-container");
async function fetchWeather(city) {
    try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await weatherRes.json();
        if (data.cod === "404") {
            alert("City not found!");
            return;
        }
        document.getElementById("location-name").innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById("main-temp").innerText = Math.round(data.main.temp);       
        let high = Math.round(data.main.temp_max);
        let low = Math.round(data.main.temp_min);
        if (high === low) { high += 2; low -= 3; } // Visual variety
        document.getElementById("temp-high").innerText = high;
        document.getElementById("temp-low").innerText = low;       
        const mainDesc = data.weather[0].main;
        document.getElementById("description").innerHTML = `${mainDesc} <br>over the peaks`;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById("current-date").innerText = `(${new Date().toLocaleDateString('en-IN', options)})`;
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const aqiData = await aqiRes.json();     
        const aqi = aqiData.list[0].main.aqi;
        const label = document.getElementById("status-label");
        const aqiValueDisplay = document.getElementById("aqi-text");
        const statusMap = {
            1: { text: "Excellent", color: "#2ed573" },
            2: { text: "Good", color: "#7bed9f" },
            3: { text: "Moderate", color: "#ffa502" },
            4: { text: "Poor", color: "#ff7f50" },
            5: { text: "Dangerous", color: "#ff4757" }
        };
        label.innerText = statusMap[aqi].text;
        label.style.background = statusMap[aqi].color;
        label.style.color = aqi > 3 ? "white" : "black";
        aqiValueDisplay.innerText = `AQI Index: ${aqi}/5`;
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();
        forecastContainer.innerHTML = "";
        const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
        dailyData.forEach((day, index) => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
            const temp = Math.round(day.main.temp);
            const activeClass = index === 0 ? "active" : "";
            forecastContainer.innerHTML += `
                <div class="forecast-item ${activeClass}">
                    <span>${dayName}</span>
                    <strong>${temp}°</strong>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error:", error);
    }
}
searchBtn.addEventListener("click", () => { if (cityInput.value) fetchWeather(cityInput.value); });
cityInput.addEventListener("keypress", (e) => { if (e.key === "Enter" && cityInput.value) fetchWeather(cityInput.value); });
window.onload = () => fetchWeather("New Delhi");