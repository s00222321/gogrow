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

const HomePage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://prodapi.metweb.ie/agriculture/report');
        const data = await response.json();
        const station = data.report.station.find((station: WeatherData) => station['@name'] === 'Knock Airport');
        setWeatherData(station);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <MDBContainer className="py-5 d-flex flex-column align-items-center">
  <h1 className="mb-4">Home</h1>
  <div className="d-flex justify-content-center">
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
  </div>
</MDBContainer>

  );
};

export default HomePage;
