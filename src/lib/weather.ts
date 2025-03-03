const API_KEY = "0210db923f2a167955a50f3b43d3ba26"; // API Key provided by the user

const WEATHER_CACHE_KEY = 'weatherData';
const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

async function getDistrictPincode(districtData: any): Promise<string | null> {
    return districtData?.pincode || null;
}

async function getCoordinatesByPincode(pincode: string, countryCode: string): Promise<{ lat: number, lon: number } | null> {
    const geoApiUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${pincode},${countryCode}&appid=${API_KEY}`;
    
    try {
        const response = await fetch(geoApiUrl);
        if (!response.ok) {
            console.error("Geocoding API error:", response.status, response.statusText);
            return null;
        }
        const data = await response.json();
        if (!data || !data.lat || !data.lon) {
            console.error("Invalid geocoding API response:", data);
            return null;
        }
        return { lat: data.lat, lon: data.lon };
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
}

async function getCurrentWeather(lat: number, lon: number): Promise<any | null> {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`; // Units in Celsius
    
    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) {
            console.error("Weather API error:", response.status, response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function cacheWeatherData(data: any): void {
    const cacheData = {
        weather: data,
        timestamp: Date.now()
    };
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cacheData));
}

function getCachedWeatherData(): any | null {
    const cachedData = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cachedData) {
        return null;
    }
    const parsedCache = JSON.parse(cachedData);
    const expiryTime = parsedCache.timestamp + CACHE_EXPIRY_TIME;
    if (Date.now() > expiryTime) {
        localStorage.removeItem(WEATHER_CACHE_KEY); // Cache expired, remove it
        return null;
    }
    return parsedCache.weather;
}

export { getDistrictPincode, getCoordinatesByPincode, getCurrentWeather, cacheWeatherData, getCachedWeatherData };