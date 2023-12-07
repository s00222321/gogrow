import React, { useEffect, useState } from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';

interface WeatherData {
  '@name': string;
  temp: { '#text': string; '@unit': string };
  rain: { '#text': string; '@unit': string };
  wind: { '#text': string; '@units': string };
  soil: { '#text': string; '@units': string };
  // Add other fields if needed
}

interface VegetableData {
  plant_id: number;
  name: string;
  latin_name: string;
  description: string;
  season: string;
  plants: string;
  planticons: string;
  growtime: string;
}

const HomePage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedVegetable, setSelectedVegetable] = useState<VegetableData | null>(null);
  const [sensorData, setSensorData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch weather data
        const weatherResponse = await fetch('https://prodapi.metweb.ie/agriculture/report');
        const weatherData = await weatherResponse.json();
        const station = weatherData.report.station.find((station: WeatherData) => station['@name'] === 'Knock Airport');
        setWeatherData(station);

        // Determine current season
        const date = new Date();
        const month = date.getMonth() + 1;
        let season;

        if (month >= 3 && month <= 5) {
          season = 'spring';
        } else if (month >= 6 && month <= 8) {
          season = 'summer';
        } else if (month >= 9 && month <= 11) {
          season = 'autumn';
        } else {
          season = 'winter';
        }

        // Fetch plant data based on the current season
        const plantDataResponse = await fetch(`https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1/season/${season}`);
        const responseData = await plantDataResponse.json();

        // Check if the response data has a 'body' property
        if (responseData.body) {
          const plantData = JSON.parse(responseData.body);

          let randomIndex, randomPlant;
          if (plantData.length > 1) {
            randomIndex = Math.floor(Math.random() * plantData.length);
            randomPlant = plantData[randomIndex];
          } else {
            randomPlant = plantData[0];
          }
          setSelectedVegetable(randomPlant);
        } else {
          console.error('Error: Response data does not contain a body property');
        }

        // Fetch sensor data
        const sensorResponse = await fetch('https://loxs1vvtc3.execute-api.eu-west-1.amazonaws.com/v1/SoilMoisture');
        const sensorData = await sensorResponse.json();
        
        // Log the raw sensor data
        console.log('Raw Sensor Data:', sensorData);
        
        // Check if the sensor data is not empty
        if (sensorData && sensorData.length > 0) {
          // Get the most recent sensor reading
          const mostRecentReading = sensorData[sensorData.length - 1];
          setSensorData(sensorData);
        
          // Log the most recent reading
          console.log('Most Recent Sensor Reading:', mostRecentReading);
        
          // You can use mostRecentReading.reading_value as needed
        } else {
          console.error('Error: Sensor data is empty');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center" style={{ minHeight: '100vh' }}>
      <h1 className="mt-3 mb-4">Welcome Siobhan 🌱</h1>

      {weatherData && (
        <MDBCard className="mb-3" style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <MDBCardBody>
            <MDBCardTitle className="mb-3">Weather at {weatherData['@name']}</MDBCardTitle>
            <div className="d-flex justify-content-between mb-2">
              <div>Temperature:</div>
              <div>{weatherData.temp['#text']}°{weatherData.temp['@unit']}</div>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <div>Rainfall:</div>
              <div>{weatherData.rain['#text']} {weatherData.rain['@unit']}</div>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <div>Wind:</div>
              <div>{weatherData.wind['#text']} {weatherData.wind['@units']}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>Soil Temp:</div>
              <div>{weatherData.soil['#text']} {weatherData.soil['@units']}</div>
            </div>
          </MDBCardBody>
        </MDBCard>
      )}

      {selectedVegetable && (
        <MDBCard className="mb-3" style={{ width: '20rem' }}>
          <img src={selectedVegetable.plants} alt={selectedVegetable.name} style={{ width: '100%', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
          <MDBCardBody>
            <MDBCardTitle className="text-center mt-3 mb-3">Recommended Seasonal Veg</MDBCardTitle>
            <MDBCardText className="text-center">
              <strong>{selectedVegetable.name}</strong>
            </MDBCardText>
            <MDBCardText className="text-center">Season: {selectedVegetable.season}</MDBCardText>
            <MDBCardText className="text-center">Grow Time: {selectedVegetable.growtime}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      )}

{sensorData && (
        <MDBCard className="mb-3" style={{ width: '20rem' }}>
          <MDBCardBody>
            <MDBCardTitle>Soil Moisture Sensor</MDBCardTitle>
            <MDBCardText>
              Most Recent Reading: {sensorData[sensorData.length - 1].reading_value}
            </MDBCardText>
            {/* You can add more details as needed */}
          </MDBCardBody>
        </MDBCard>
      )}
    </div>
  );
};

export default HomePage;
