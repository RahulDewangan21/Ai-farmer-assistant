import axios from "axios";

/**
 * Get weather data (current + forecast) using OpenWeather ONLY
 */
export const getWeatherData = async (city = "Delhi") => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // ✅ CURRENT WEATHER
    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${apiKey}`
    );

    // ✅ FORECAST (5 DAYS)
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},IN&units=metric&appid=${apiKey}`
    );

    const current = currentRes.data;
    const forecast = forecastRes.data;

    return {
      city: current.name,
      country: current.sys.country,

      current: {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        description: current.weather[0].description,
        windSpeed: current.wind.speed,
      },

      forecast: forecast.list.slice(0, 5).map((item) => ({
        date: item.dt_txt,
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        description: item.weather[0].description,
      })),
    };

  } catch (error) {
    console.error("Weather Error:", error.response?.data || error.message);

    throw new Error("Unable to fetch weather data");
  }
};