import React, { useState, useEffect } from "react";

// Define a type for the weather station data
type WeatherStation = {
  "@name": string;
  temp: {
    "#text": string;
    "@unit": string;
  };
  rain: {
    "#text": string;
    "@unit": string;
  };
  // Add more fields as needed
};

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherStation[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://prodapi.metweb.ie/agriculture/report"
        );
        const data = await response.json();
        setWeatherData(data.report.station);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Weather Data</h1>
      <div className="weather-cards">
        {weatherData &&
          weatherData.map((station, index) => (
            <div className="weather-card" key={index}>
              <h2>{station["@name"]}</h2>
              <p>
                Temperature: {station.temp["#text"]} {station.temp["@unit"]}
              </p>
              <p>
                Rain: {station.rain["#text"]} {station.rain["@unit"]}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Weather;
