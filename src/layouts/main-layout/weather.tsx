import { useEffect, useState } from "react";
import { toast } from "sonner";

import { WeatherData } from "./types";

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData>();
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${
          // import.meta.env.VITE_WEATHER_API_KEY
          "2722cca9280348888f7220344250304"
        }&q=Tashkent&aqi=no`
      );
      const weatherData = await response.json();
      const expirationTime = Date.now() + 8 * 60 * 60 * 1000;

      setWeather({ ...weatherData, expirationTime });
    } catch (error) {
      toast.warning(String(error));
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className={`flex items-center justify-center flex-col mb-4 gap-1 mr-2 `}>
      <img width={40}  src={weather?.current?.condition?.icon} />
      <h3 className="text-[24px] relative text-primary leading-[120%]">
        {weather?.current?.temp_c}
        <p className="font-normal absolute -top-3 -right-3 text-[10px]">° C</p>
      </h3>
    </div>
  );
}
