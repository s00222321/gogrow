import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';

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
  const [vegetableData, setVegetableData] = useState<VegetableData | null>(null);

  useEffect(() => {
    // Fetch weather data
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('https://prodapi.metweb.ie/agriculture/report');
        const data = await response.json();
        const station = data.report.station.find((station: WeatherData) => station['@name'] === 'Knock Airport');
        setWeatherData(station);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Fetch vegetable data
    const fetchVegetableData = async () => {
        try {
          const response = await fetch('https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1/4');
          const data = await response.json();
          const parsedData = JSON.parse(data.body);
          setVegetableData(parsedData);
        } catch (error) {
          console.error('Error fetching vegetable data:', error);
        }
      };
        // For now, setting dummy vegetable data
        

    fetchWeatherData();
    fetchVegetableData();
  }, []);

  return (
    <div>
      <MDBContainer className="py-5 d-flex justify-content-center align-items-center">
        {weatherData && (
          <MDBCard style={{ width: '20rem', margin: '1rem' }}>
            <MDBCardBody>
              <MDBCardTitle>Weather at {weatherData['@name']}</MDBCardTitle>
              <MDBCardText>
                Temperature: {weatherData.temp['#text']}°{weatherData.temp['@unit']}
              </MDBCardText>
              <MDBCardText>
                Rainfall: {weatherData.rain['#text']} {weatherData.rain['@unit']}
              </MDBCardText>
              <MDBCardText>
                Wind: {weatherData.wind['#text']} {weatherData.wind['@units']}
              </MDBCardText>
              <MDBCardText>
                Soil Temp: {weatherData.soil['#text']} {weatherData.soil['@units']}
              </MDBCardText>
              {/* Add more fields if needed */}
            </MDBCardBody>
          </MDBCard>
        )}
      </MDBContainer>

      {/* Vegetable Card */}
      
      {vegetableData && (
        <MDBCard style={{ width: '20rem', margin: '1rem' }}>
          <MDBCardBody>
            <MDBCardTitle>{vegetableData.name}</MDBCardTitle>
            <img src={vegetableData.plants} alt={vegetableData.name} style={{ width: '100%' }} />
            <MDBCardText>{vegetableData.description}</MDBCardText>
            <MDBCardText>Season: {vegetableData.season}</MDBCardText>
            <MDBCardText>Grow Time: {vegetableData.growtime}</MDBCardText>
            {/* Add image display here */}
            
          </MDBCardBody>
        </MDBCard>
      )}
    </div>
  );
};

export default HomePage;