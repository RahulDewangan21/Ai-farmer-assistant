import axios from 'axios';

/**
 * Fetch current weather data from OpenWeather API
 */
export const getWeatherData = async (city = 'Delhi') => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      city: data.name,
      country: data.sys.country,
    };
  } catch (error) {
    console.error('Weather API Error:', error.message);
    throw new Error('Unable to fetch weather data. Please check city name and try again.');
  }
};
