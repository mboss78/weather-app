import { useState, useRef, useEffect, useContext } from 'react'; // Importing hooks from React
import axios from 'axios'; // Importing axios for making HTTP requests
import { format, subDays } from 'date-fns'; // Importing date formatting functions from date-fns
import WeatherChart from './WeatherChart'; // Importing the WeatherChart component
import { useTranslation } from 'react-i18next'; // Importing useTranslation for handling translations
import { useRouter } from 'next/router'; // Importing useRouter from Next.js for routing
import { CityContext } from '../context/CityContext'; // Importing CityContext for managing city state

const Weather = () => {
  const [city, setCity] = useState(''); // State for the current city
  const [weather, setWeather] = useState(null); // State for current weather data
  const [pastWeather, setPastWeather] = useState([]); // State for past weather data
  const [error, setError] = useState(null); // State for error messages
  const [suggestions, setSuggestions] = useState([]); // State for city suggestions
  const [suggestedCitiesWeather, setSuggestedCitiesWeather] = useState([]); // State for weather data of suggested cities
  const [suggestedCityLoading, setSuggestedCityLoading] = useState({}); // State for loading status of suggested cities
  const [isFetching, setIsFetching] = useState(false); // State for fetching status
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius'); // State for temperature unit
  const [windSpeedUnit, setWindSpeedUnit] = useState('kph'); // State for wind speed unit
  const [isHovered, setIsHovered] = useState(false); // State for hover status
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const { t } = useTranslation(); // Translation function

  const bottomRef = useRef(null); // Ref for the bottom of the page
  const debounceTimeout = useRef(null); // Ref for debounce timeout

  const cityPool = [
    'New York', 'London', 'Tokyo', 'Sydney', 'Berlin', 'Moscow', 'Beijing', 'Cairo', 'Rio de Janeiro',
    'Los Angeles', 'Toronto', 'Mexico City', 'Mumbai', 'Shanghai', 'São Paulo', 'Buenos Aires', 'Rome', 'Madrid', 'Bangkok',
    'Seoul', 'Istanbul', 'Dubai', 'Singapore', 'Hong Kong', 'Lagos', 'Jakarta', 'Chicago', 'Delhi', 'Manila',
    'Johannesburg', 'Lima', 'Tehran', 'Vienna', 'Stockholm', 'Helsinki', 'Oslo', 'Zurich', 'Athens'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTemperatureUnit = localStorage.getItem('temperatureUnit');
      const savedWindSpeedUnit = localStorage.getItem('windSpeedUnit');
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';

      if (savedTemperatureUnit) {
        setTemperatureUnit(savedTemperatureUnit);
      }
      if (savedWindSpeedUnit) {
        setWindSpeedUnit(savedWindSpeedUnit);
      }
      document.body.classList.toggle('dark-mode', savedDarkMode);
    }
  }, []);

  const { setCityContext } = useContext(CityContext);
  const router = useRouter();

  useEffect(() => {
    const queryCity = router.query.city;
    if (queryCity) {
      setCity(queryCity);
      setCityContext(queryCity);
      fetchWeather(queryCity);
    }
  }, [router.query.city, setCityContext]);

  const convertTemperature = (tempC) => {
    if (temperatureUnit === 'Fahrenheit') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const convertWindSpeed = (windKph) => {
    if (windSpeedUnit === 'mph') {
      return Math.round(windKph * 0.621371);
    }
    return Math.round(windKph);
  };

  const getWeatherImage = (condition) => {
    const category = mapConditionToCategory(condition);

    switch (category) {
      case 'sunny':
        return '/sunny.png';
      case 'cloudy':
        return '/cloudy.png';
      case 'rainy':
        return '/rainy.png';
      case 'snowy':
        return '/snowy.png';
      case 'thunderstorm':
        return '/thunderstorm.png';
      default:
        return '/default.png';
    }
  };

  const mapConditionToCategory = (condition) => {
    const conditionLower = condition.toLowerCase();

    if (['sunny', 'clear', 'sunny nearby', 'clear nearby'].includes(conditionLower)) {
      return 'sunny';
    }
    if (['partly cloudy', 'cloudy', 'overcast', 'mist', 'fog', 'freezing fog', 'partly cloudy nearby', 'cloudy nearby', 'overcast nearby', 'mist nearby', 'fog nearby', 'freezing fog nearby'].includes(conditionLower)) {
      return 'cloudy';
    }
    if ([
      'patchy rain possible', 'patchy light drizzle', 'light drizzle', 'freezing drizzle', 'heavy freezing drizzle',
      'patchy light rain', 'light rain', 'moderate rain at times', 'moderate rain', 'heavy rain at times', 'heavy rain',
      'light freezing rain', 'moderate or heavy freezing rain', 'light rain shower', 'moderate or heavy rain shower', 'torrential rain shower',
      'patchy rain nearby', 'patchy light drizzle nearby', 'light drizzle nearby', 'freezing drizzle nearby', 'heavy freezing drizzle nearby',
      'patchy light rain nearby', 'light rain nearby', 'moderate rain at times nearby', 'moderate rain nearby', 'heavy rain at times nearby', 'heavy rain nearby',
      'light freezing rain nearby', 'moderate or heavy freezing rain nearby', 'light rain shower nearby', 'moderate or heavy rain shower nearby', 'torrential rain shower nearby'
    ].includes(conditionLower)) {
      return 'rainy';
    }
    if ([
      'patchy snow possible', 'blowing snow', 'blizzard', 'patchy light snow', 'light snow', 'patchy moderate snow', 'moderate snow',
      'patchy heavy snow', 'heavy snow', 'light snow showers', 'moderate or heavy snow showers', 'patchy sleet', 'light sleet',
      'moderate or heavy sleet', 'light sleet showers', 'moderate or heavy sleet showers', 'ice pellets', 'light showers of ice pellets',
      'moderate or heavy showers of ice pellets',
      'patchy snow nearby', 'blowing snow nearby', 'blizzard nearby', 'patchy light snow nearby', 'light snow nearby', 'patchy moderate snow nearby', 'moderate snow nearby',
      'patchy heavy snow nearby', 'heavy snow nearby', 'light snow showers nearby', 'moderate or heavy snow showers nearby', 'patchy sleet nearby', 'light sleet nearby',
      'moderate or heavy sleet nearby', 'light sleet showers nearby', 'moderate or heavy sleet showers nearby', 'ice pellets nearby', 'light showers of ice pellets nearby',
      'moderate or heavy showers of ice pellets nearby'
    ].includes(conditionLower)) {
      return 'snowy';
    }
    if ([
      'thundery outbreaks possible', 'patchy light rain with thunder', 'moderate or heavy rain with thunder',
      'patchy light snow with thunder', 'moderate or heavy snow with thunder',
      'thundery outbreaks nearby', 'patchy light rain with thunder nearby', 'moderate or heavy rain with thunder nearby',
      'patchy light snow with thunder nearby', 'moderate or heavy snow with thunder nearby'
    ].includes(conditionLower)) {
      return 'thunderstorm';
    }
    return 'default';
  };

  // Fetch current and past weather data
  const fetchWeather = async (cityName = city) => {
    if (isRequestInProgress) return; // Prevent new requests if one is already in progress
  
    setIsRequestInProgress(true);
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const currentDate = new Date();
    setIsLoading(true);
    try {
      const currentResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=no`
      );
  
      const pastWeatherData = [];
      for (let i = 0; i < 30; i++) {
        const date = format(subDays(currentDate, i), 'yyyy-MM-dd');
        const response = await axios.get(
          `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${cityName}&dt=${date}`
        );
        pastWeatherData.push(response.data);
      }
  
      setWeather(currentResponse.data);
      setPastWeather(pastWeatherData.reverse());
      setError(null);
      fetchSuggestedCitiesWeather();
    } catch (error) {
      setError(t('City Not Found'));
      setWeather(null);
      setPastWeather([]);
    } finally {
      setIsLoading(false);
      setIsRequestInProgress(false);
    }
  };
  

// Inside fetchSuggestions function
const fetchSuggestions = async (query) => {
  setIsFetching(true);
  try {
    const response = await axios.get(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
      {
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
        },
        params: {
          namePrefix: query,
          limit: 5,
        },
      }
    );
    setSuggestions(response.data.data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    setSuggestions([]);
  } finally {
    setIsFetching(false);
  }
};

console.log('Weather API Key:', process.env.NEXT_PUBLIC_WEATHER_API_KEY);
console.log('Rapid API Key:', process.env.NEXT_PUBLIC_RAPIDAPI_KEY);


  // Fetch weather data for randomly selected cities
  const fetchSuggestedCitiesWeather = async () => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const suggestedCities = getRandomCitiesFromPool(5);

    try {
      const weatherDataPromises = suggestedCities.map(async (city) => {
        setSuggestedCityLoading((prev) => ({ ...prev, [city]: true }));
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
        );
        setSuggestedCityLoading((prev) => ({ ...prev, [city]: false }));
        return response.data;
      });

      const weatherData = await Promise.all(weatherDataPromises);
      setSuggestedCitiesWeather(weatherData);
    } catch (error) {
      console.error('Error fetching suggested cities weather:', error);
    }
  };

  // Get a random subset of cities from the pool
  const getRandomCitiesFromPool = (num) => {
    const shuffled = cityPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.length > 2) {
      debounceTimeout.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  // Handle click on a suggested city
  const handleSuggestionClick = (suggestion) => {
    if (isRequestInProgress) return; // Prevent new requests if one is already in progress
    
    setCity(suggestion.city);
    setSuggestions([]);
    fetchWeather(suggestion.city);
  };
  
  const handleSuggestedCityClick = (city) => {
    if (isRequestInProgress) return; // Prevent new requests if one is already in progress
    
    setCity(city);
    fetchWeather(city);
  };
  

  // Scroll to the bottom of the page
  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const currentDate = weather ? format(new Date(weather.location.localtime), 'EEEE, MMM d') : '';

  return (
    <div className="weather-container">
      <h1>{t('Forecast')}</h1>
      <div className="input-and-suggestions">
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder={t('home.enterCity')}
          className="city-input"
        />
        {suggestions.length > 0 && !isFetching && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.city}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => fetchWeather(city)} className="fetch-button">
          Get Weather
        </button>
      </div>
      {isLoading && <div className="spinner"></div>} {/* Spinner */}
      {error && <p className="error-message">{error}</p>} {/* Error message */}
      <div className="weather-content">
        <div className="suggested-cities-container">
          {suggestedCitiesWeather.map((cityWeather, index) => (
            <div
              key={index}
              className="suggested-city"
              onClick={() => handleSuggestedCityClick(cityWeather.location.name)}
            >
              <h3>{cityWeather.location.name}</h3>
              {suggestedCityLoading[cityWeather.location.name] ? (
                <div className="spinner small-spinner"></div>
              ) : (
                <>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {convertTemperature(cityWeather.current.temp_c)} °{temperatureUnit === 'Celsius' ? 'C' : 'F'}
                  </p>
                  <img src={getWeatherImage(cityWeather.current.condition.text)} alt={cityWeather.current.condition.text} style={{ width: '40px', height: '40px' }} />
                </>
              )}
            </div>
          ))}
        </div>
        {weather && (
          <div className="weather-info">
            <h2>{weather.location.name} - {currentDate}</h2>
            <p style={{ fontSize: '48px', fontWeight: 'bold' }}>
              {convertTemperature(weather.current.temp_c)} °{temperatureUnit === 'Celsius' ? 'C' : 'F'}
            </p>
            <p>{t('home.weather')}: {weather.current.condition.text}</p>
            <img src={getWeatherImage(weather.current.condition.text)} alt={weather.current.condition.text} style={{ width: '50px', height: '50px' }} />
            <p>{t('home.humidity')}: {weather.current.humidity}%</p>
            <p>{t('home.windSpeed')}: {convertWindSpeed(weather.current.wind_kph)} {windSpeedUnit}</p>
          </div>
        )}
      </div>
      {weather && (
        <>
          <div
            className="past-weather-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {pastWeather.slice(0, 3).map((dayWeather, index) => {
              const date = new Date(dayWeather.forecast.forecastday[0].date);
              const formattedDate = format(date, 'EEEE, MMM d'); // Format date as Weekday, Month Day

              return (
                <div key={index} className="past-weather">
                  <div className="past-weather-summary">
                    <p>{convertTemperature(dayWeather.forecast.forecastday[0].day.avgtemp_c)} °{temperatureUnit === 'Celsius' ? 'C' : 'F'}</p>
                    <p>{formattedDate}</p> {/* Always show the date */}
                    <img src={getWeatherImage(dayWeather.forecast.forecastday[0].day.condition.text)} alt={dayWeather.forecast.forecastday[0].day.condition.text} style={{ width: '50px', height: '50px' }} />
                  </div>
                  {isHovered && (
                    <div className="past-weather-details">
                      <p>{t('home.weather')}: {dayWeather.forecast.forecastday[0].day.condition.text}</p>
                      <p>{t('home.humidity')}: {dayWeather.forecast.forecastday[0].day.avghumidity}%</p>
                      <p>{t('home.windSpeed')}: {convertWindSpeed(dayWeather.forecast.forecastday[0].day.maxwind_kph)} {windSpeedUnit}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <WeatherChart pastWeather={pastWeather} />
          <button onClick={scrollToBottom} className="scroll-button">{t('Go to Graph')}</button>
        </>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default Weather;
