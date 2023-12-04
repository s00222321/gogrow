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
    name: string;
    image: string;
    description: string;
    growTime: string;
    season: string;
    // Add other fields if needed
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
        // Fetch vegetable data from your API or source
        // Example: const response = await fetch('https://your-vegetable-api.com');
        // const data = await response.json();
        // setVegetableData(data);

        // For now, setting dummy vegetable data
        setVegetableData({
          name: 'Tomato',
          image: 'tomato.jpg',
          description: 'A red fruit that is used in many culinary dishes.',
          growTime: '80 days',
          season: 'Winter'
        });
      } catch (error) {
        console.error('Error fetching vegetable data:', error);
      }
    };

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

      {vegetableData && (
        <MDBContainer className="py-5 d-flex justify-content-center align-items-center">
          <MDBCard style={{ width: '20rem', margin: '1rem' }}>
            <MDBCardBody>
            <MDBCardTitle>Suggested Vegetable in {vegetableData.season}</MDBCardTitle>
              <MDBCardTitle>{vegetableData.name}</MDBCardTitle>
              <MDBCardText>{vegetableData.description}</MDBCardText>
              <MDBCardText>Grow Time: {vegetableData.growTime}</MDBCardText>
              {/* Render the image here */}
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      )}
    </div>
  );
};

export default HomePage;