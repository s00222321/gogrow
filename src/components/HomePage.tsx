import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol, MDBRow } from 'mdb-react-ui-kit';

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
  const [SelectedVegetable, setSelectedVegetable] = useState<VegetableData | null>(null);
  const [currentSeason, setCurrentSeason] = useState('');

  useEffect(() => {
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

    const fetchVegetableData = async () => {
      try {
        const randomNumber = Math.floor(Math.random() * 25) + 1;
        const endpoint = `https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1/${randomNumber}`;
        const response = await fetch(endpoint);
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        setVegetableData(parsedData);
      } catch (error) {
        console.error('Error fetching vegetable data:', error);
      }
    };

    fetchWeatherData();
    fetchVegetableData();
  }, []);

  useEffect(() => {
    const determineCurrentSeason = () => {
      const date = new Date();
      const month = date.getMonth() + 1;
      let season;

      if (month >= 3 && month <= 5) {
        season = 'Spring';
      } else if (month >= 6 && month <= 8) {
        season = 'Summer';
      } else if (month >= 9 && month <= 11) {
        season = 'Autumn';
      } else {
        season = 'Winter';
      }

      setCurrentSeason(season);
    };

    determineCurrentSeason();
  }, []);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const endpoint = `https://bmhnryodyk.execute-api.eu-west-1.amazonaws.com/v1/${generateRandomPlantId(currentSeason)}`;
        const response = await fetch(endpoint);
        const responseBody = await response.json();
        console.log(responseBody)
        setSelectedVegetable(responseBody);
        console.log('Selected plant fetched:', responseBody);
      } catch (error) {
        console.error('Error fetching plant data:', error);
      }
    };

    fetchPlantData();
  }, [currentSeason]);

  const generateRandomPlantId = (season: string) => {
    if (season === 'Spring') {
      return Math.floor(Math.random() * (8 - 1 + 1)) + 1;
    } else if (season === 'Summer') {
      return Math.floor(Math.random() * (18 - 9 + 1)) + 9;
    } else if (season === 'Autumn') {
      return Math.floor(Math.random() * (24 - 19 + 1)) + 19;
    } else if (season === 'Winter') {
      return 25; // Return the specific ID for Winter
    }
  
    return 1; // Default to 1 if the season is not recognized
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <MDBContainer className="py-0">
        <MDBRow className="justify-content-center">
          {weatherData && (
            <MDBCol md="6" lg="4" className="mb-3" style={{ margin: '1rem' }}>
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
            </MDBCardBody>
          </MDBCard>
        )}
            </MDBCol>
          )}
  
          {vegetableData && (
            <MDBCol md="6" lg="4" className="mb-3" style={{ margin: '1rem' }}>
               {vegetableData && (
          <MDBCard style={{ width: '20rem', margin: '1rem' }}>
            <MDBCardBody>
            <MDBCardTitle>Suggested Vegetable for {currentSeason}</MDBCardTitle>
              <MDBCardTitle>{vegetableData.name}</MDBCardTitle>
              <img src={vegetableData.plants} alt={vegetableData.name} style={{ width: '100%' }} />
              <MDBCardText>{vegetableData.description}</MDBCardText>
              <MDBCardText>Season: {vegetableData.season}</MDBCardText>
              <MDBCardText>Grow Time: {vegetableData.growtime}</MDBCardText>
            </MDBCardBody>
          </MDBCard>
        )}
            </MDBCol>
          )}
  
          {SelectedVegetable && (
            <MDBCol md="6" lg="4" className="mb-3" style={{ margin: '1rem' }}>
              {SelectedVegetable && (
  <>
    {console.log('Selected Plant Object:', SelectedVegetable)}
    <MDBCard style={{ width: '20rem', margin: '1rem' }}>
      <MDBCardBody>
        <MDBCardTitle>{SelectedVegetable.name}</MDBCardTitle>
        <img src={SelectedVegetable.plants} alt={SelectedVegetable.name} style={{ width: '100%' }} />
        <MDBCardText>{SelectedVegetable.description}</MDBCardText>
        <MDBCardText>Season: {SelectedVegetable.season}</MDBCardText>
        <MDBCardText>Grow Time: {SelectedVegetable.growtime}</MDBCardText>
      </MDBCardBody>
    </MDBCard>
  </>
)}
            </MDBCol>
          )}
  
          {/* Sensor Data Card */}
          <MDBCol xs="12" style={{ margin: '1rem' }}>
          <MDBCard style={{ width: '20rem', margin: '1rem' }}>
            <MDBCardBody>
              <MDBCardTitle>Sensor Data</MDBCardTitle>
            </MDBCardBody>
          </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );

    
};

export default HomePage;
