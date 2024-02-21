import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol, MDBRow, MDBContainer, MDBCarousel, MDBCarouselItem, MDBCardImage } from 'mdb-react-ui-kit';
import { WiCloudy, WiDayCloudyGusts, WiThermometer, WiThermometerExterior, WiWindDeg, WiRaindrop} from "react-icons/wi";
import { CgCalendarDates } from "react-icons/cg";

interface WeatherData {
  county_name: string;
  forecast: {
    day_num: string;
    date: string;
    min_temp: string;
    max_temp: string;
    weather: string;
    wind_speed: {
      value: string;
      units: string;
    };
    wind_dir: string;
    wind_deg: string;
    rainfall_6_18: string;
    rainfall_18_6: string;
  }[];
}


//const selectedCounty = "MAYO";


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

interface ArticleData {
  article_id: string;
  title: string;
  author: string;
  publication_date: string;
  content: string;
  image: string;
}

const HomePage: React.FC = () => {
  const { isAuthenticated, loginData } = useAuth();
  const username = loginData?.username || '';

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  //const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [vegetables, setVegetables] = useState<VegetableData[]>([]);
  const [sensorData, setSensorData] = useState<any[] | null>(null);
  const [UserCounty, setUserCounty] = useState<string | null>(null);

  const [randomArticleId, setRandomArticleId] = useState<number | null>(null);
  const [randomArticle, setRandomArticle] = useState<ArticleData | null>(null);

  useEffect(() => {
    console.log('MyGarden Component - Username:', username);
    
    const fetchData = async () => {
      try {
        // Fetch weather data
        const weatherResponse = await fetch('https://2vbpsc6e1k.execute-api.eu-west-1.amazonaws.com/production/getWeatherData');
        const weatherData = await weatherResponse.json();
        // For demonstration purposes, you might want to set a default selected county
        //setSelectedCounty(weatherData[0]['@name']);
        const response = await fetch(
          `https://0fykzk1eg7.execute-api.eu-west-1.amazonaws.com/v1/users/${username}`
        );
        const jsonResponse = await response.json();
        console.log('API Response:', jsonResponse);
        const UserCounty = jsonResponse.data?.County;
        setUserCounty(UserCounty);
        const uppercaseCounty = UserCounty ? UserCounty.toUpperCase() : '';
        console.log('User County:', UserCounty);


        // Set weather data for the selected county
        setWeatherData(weatherData.find((county: { county_name: any; }) => county.county_name === uppercaseCounty));
      
    
        

        // Determine current season
        const date = new Date();
        const month = date.getMonth() + 1;
        let season;

        if (month >= 2 && month <= 5) {
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
          setVegetables(plantData);
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
  }, [username]);

  useEffect(() => {
    const fetchRandomArticleId = async () => {
      const totalArticles = 7; // Total number of articles in the database
      const randomId = Math.floor(Math.random() * totalArticles) + 1;
      setRandomArticleId(randomId);
    };

    fetchRandomArticleId();
  }, []);

  useEffect(() => {
    const fetchRandomArticle = async () => {
      try {
        if (randomArticleId !== null) {
          const response = await fetch(`https://yxk4xluq16.execute-api.eu-west-1.amazonaws.com/v1/${randomArticleId}`);
          const responseData = await response.json();
          const data = JSON.parse(responseData.body);
          setRandomArticle(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRandomArticle();
  }, [randomArticleId]);

  return (
    <MDBContainer fluid className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h3 className="mt-3 mb-4">
        {isAuthenticated ? `Welcome ${loginData?.username} 🌱` : 'Welcome Guest 🌱'}
      </h3>


      {weatherData && (
  <>
    {/* Card for today's weather */}
    <MDBRow className="justify-content-center text-center">
    <MDBCol className='mb-4'>
    <MDBCard
      key={weatherData.county_name}
      className="mb-3"
      style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <MDBCardBody style={{  border: '0px solid #808080', borderRadius: '8px', height: '100%' }}>
        <MDBCardTitle className="mb-3">Weather today in {UserCounty}</MDBCardTitle>
        {weatherData.forecast.map((day) => {
          // Parse the date string
          const dateObj = new Date(day.date);
          // Format the date as day-month-year
          const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
          // Check if the day's date matches today's date
          const isToday = dateObj.toDateString() === new Date().toDateString();

          if (isToday) {
            return (
              <div key={day.day_num}>
                {/* Render your weather details here for each day */}
                <div><CgCalendarDates /> Date: {formattedDate}</div>
                <div><WiThermometer /> Max Temp: {day.max_temp}&deg;C</div>
                <div><WiThermometerExterior /> Min Temp: {day.min_temp}&deg;C</div>
                <div><WiCloudy /> Weather: {day.weather.replace(/_/g, ' ')}</div>
                <div><WiDayCloudyGusts /> Wind Speed: {day.wind_speed.value} {day.wind_speed.units}</div>
                <div><WiWindDeg /> Wind Direction: {day.wind_dir}</div>
                <div><WiRaindrop /> Rainfall from 6-18: {day.rainfall_6_18}mm</div>
                <div><WiRaindrop /> Rainfall from 18-6: {day.rainfall_18_6}mm</div>
                {/* Add other weather details as needed */}
              </div>
            );
          }

          return null;
        })}
      </MDBCardBody>
    </MDBCard>
    </MDBCol>
    

    {/* Card for tomorrow's weather (today + 1) */}
    <MDBCol className='mb-4'>
    <MDBCard
      key={`tomorrow-${weatherData.county_name}`}
      className="mb-3"
      style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <MDBCardBody style={{  border: '0px solid #808080', borderRadius: '8px', height: '100%' }}>
        <MDBCardTitle className="mb-3">Weather tomorrow in {UserCounty}</MDBCardTitle>
        {weatherData.forecast.map((day) => {
          // Parse the date string
          const dateObj = new Date(day.date);
          // Get tomorrow's date
          const tomorrow = new Date();
          tomorrow.setDate(new Date().getDate() + 1);
          // Check if the day's date matches tomorrow's date
          const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();

          if (isTomorrow) {
            // Format the date as day-month-year
            const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

            return (
              <div key={day.day_num}>
                {/* Render your weather details here for each day */}
                <div><CgCalendarDates /> Date: {formattedDate}</div>
                <div><WiThermometer /> Max Temp: {day.max_temp}&deg;C</div>
                <div><WiThermometerExterior />Min Temp: {day.min_temp}&deg;C</div>
                <div><WiCloudy /> Weather: {day.weather.replace(/_/g, ' ')}</div>
                <div><WiDayCloudyGusts /> Wind Speed: {day.wind_speed.value} {day.wind_speed.units}</div>
                <div><WiWindDeg /> Wind Direction: {day.wind_dir}</div>
                <div><WiRaindrop /> Rainfall from 6-18: {day.rainfall_6_18}mm</div>
                <div><WiRaindrop /> Rainfall from 18-6: {day.rainfall_18_6}mm</div>
                {/* Add other weather details as needed */}
              </div>
            );
          }

          return null;
        })}
      </MDBCardBody>
    </MDBCard>
    </MDBCol>
    </MDBRow>
  </>
)}

{vegetables && vegetables.length > 0 && (
  <MDBCarousel showIndicators showControls fade>
    {vegetables.map((vegetable, index) => (
      <MDBCarouselItem key={index} itemId={index + 1}>
        <MDBCol>
          <MDBCard className="mb-3" style={{ width: '20rem' }}>
            <img
              src={vegetable.plants}
              alt={vegetable.name}
              style={{ width: '100%', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
            />
            <MDBCardBody>
              <MDBCardTitle className="text-center mt-3 mb-3">Recommended Seasonal Veg</MDBCardTitle>
              <MDBCardText className="text-center">
                <strong>{vegetable.name}</strong>
              </MDBCardText>
              <MDBCardText className="text-center">Season: {vegetable.season}</MDBCardText>
              <MDBCardText className="text-center">Grow Time: {vegetable.growtime}</MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBCarouselItem>
    ))}
  </MDBCarousel>
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

{/* Display the random article preview card */}
{randomArticle && (
        <MDBRow className="justify-content-center">
          <MDBCol className='mb-4'>
            <MDBCard className="mb-3"
      style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <MDBCardTitle className="mb-3">Suggested Article: {randomArticle.title}</MDBCardTitle>
              <MDBCardImage src={randomArticle.image} alt={randomArticle.title} position="top" />
              <MDBCardBody>
                <MDBCardTitle>{randomArticle.title}</MDBCardTitle>
                <MDBCardText>{randomArticle.content.slice(0, 100)}...</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      )}


    </MDBContainer>
  );
};

export default HomePage;
