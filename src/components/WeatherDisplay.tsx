"use client";
import React, { useState, useEffect } from 'react';
import { getDistrictPincode, getCoordinatesByPincode, getCurrentWeather, getCachedWeatherData, cacheWeatherData } from '@/lib/weather';

interface WeatherDisplayProps {
    districtData: any; // Type DistrictData interface
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ districtData }) => {
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            setLoading(true);
            setError(null);
            // let cachedWeather = getCachedWeatherData();

            // if (cachedWeather) {
            //     setWeatherData(cachedWeather);
            //     setLoading(false);
            //     return; // Use cached data and exit
            // }

            try {
                const pincode = await getDistrictPincode(districtData);
                if (!pincode) {
                    setError("Pincode not found in district data.");
                    setLoading(false);
                    return;
                }

                const coordinates = await getCoordinatesByPincode(pincode, "IN"); // India country code
                if (!coordinates) {
                    setError("Could not fetch coordinates for the location.");
                    setLoading(false);
                    return;
                }
                
                const weather = await getCurrentWeather(coordinates.lat, coordinates.lon);
                console.log(weather);
                if (weather) {
                    setWeatherData(weather);
                    cacheWeatherData(weather); // Cache the fetched data
                } else {
                    setError("Could not fetch weather data.");
                }
            } catch (err: any) {
                console.error("Error fetching weather:", err);
                setError("Failed to fetch weather data.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [districtData]); // Depend on districtData prop

    if (loading) {
        return <p>Loading weather data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!weatherData) {
        return <p>Could not display weather information.</p>;
    }

    const temperature = weatherData.main.temp;
    const condition = weatherData.weather[0].description;
    const locationName = weatherData.name;
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;


    return (
        <div className="sm:absolute sm:bottom-8 sm:left-4 relative bg-card p-4 rounded-md shadow-md text-foreground">
            <div className="flex items-center">
                <img src={iconUrl} alt={condition} className="mr-2" />
                <div>
                    <p className="text-xl">{temperature}°C</p>
                    <p className="text-sm capitalize">{condition}</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherDisplay;