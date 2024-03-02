import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol, MDBRow, MDBContainer, MDBCardImage } from 'mdb-react-ui-kit';
import { WiCloudy, WiDayCloudyGusts, WiThermometer, WiThermometerExterior, WiWindDeg, WiRaindrop } from "react-icons/wi";
import { CgCalendarDates } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { WEATHER_API, USER_API, PLANT_API, SENSOR_API, ARTICLE_API } from '../apis'

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

interface UserData {
  ProfilePic: string;
  Username: string;
  email: string;
  DateJoined: string;
  County: string;
  SustainabilityScore: number;
  Achievements: Record<string, { DateEarned: string; Description: string }>;
}

const HomePage: React.FC = () => {
  const { isAuthenticated, loginData } = useAuth();
  const username = loginData?.username || '';

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [vegetables, setVegetables] = useState<VegetableData[]>([]);
  const [UserCounty, setUserCounty] = useState<string | null>(null);
  const [waterStatus, setWaterStatus] = useState<string>('');
  const [lastChecked, setLastChecked] = useState<string>('');
  const [navigationArticle, setNavigationArticle] = useState<ArticleData | null>(null);
  const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);


  async function fetchWeatherData() {
    try {
      const weatherResponse = await fetch(WEATHER_API);
      const weatherData = await weatherResponse.json();
      const response = await fetch(
        `${USER_API}/users/${username}`
      );
      const jsonResponse = await response.json();
      setUserData(jsonResponse.data);
      
      const UserCounty = jsonResponse.data?.County;
      setUserCounty(UserCounty);
      const uppercaseCounty = UserCounty ? UserCounty.toUpperCase() : '';

      setWeatherData(weatherData.find((county: { county_name: any; }) => county.county_name === uppercaseCounty));
    }
    catch {
      console.log('Error retrieving weather data')
    }
  }

  async function fetchPlantData() {
    try {
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

      const plantDataResponse = await fetch(`${PLANT_API}/season/${season}`);
      const responseData = await plantDataResponse.json();

      if (responseData.body) {
        const plantData = JSON.parse(responseData.body);
        setVegetables(plantData);
      } else {
        console.error('Error: Response data does not contain a body property');
      }
    }
    catch {
      console.log('Error retrieving plant data')
    }
  }

  async function FetchSensorData() {
    try {
      const response = await fetch(`${SENSOR_API}/SoilMoisture`);
      const responseData = await response.json();

      const parsedData = JSON.parse(responseData.body);

      const labels = parsedData.map((entry: { reading_timestamp: string }) => {
        const date = new Date(entry.reading_timestamp);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        return formattedDate;
      });
      const dataValues = parsedData.map((entry: { reading_value: string }) => parseFloat(entry.reading_value));

      const latestReading = dataValues[dataValues.length - 1];
      const latestTimestamp = labels[labels.length - 1];
      setWaterStatus(latestReading === 0 ? '⚠️ The plant has no water' : '💦 The plant has water');
      setLastChecked(`Last checked: ${latestTimestamp}`);
    }
    catch {
      console.log('Error retrieving sensor data')
    }
  }

  async function FetchNavigationArticle() {
    try {
      const tutorialArticleId = 1;
      const response = await fetch(`${ARTICLE_API}/${tutorialArticleId}`);
      const responseData = await response.json();
      const data = JSON.parse(responseData.body);
      setNavigationArticle(data);
    }
    catch {
      console.log('Error getting random article')
    }
  }

  useEffect(() => {
    fetchWeatherData();
    fetchPlantData();
    FetchSensorData();
    FetchNavigationArticle();
  }, [username]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the index to switch to the next plant
      setCurrentPlantIndex((prevIndex) => (prevIndex + 1) % vegetables.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [vegetables]);

  return (
    <MDBContainer fluid className="d-flex flex-column mx-auto align-items-center" style={{ minHeight: '100vh' }}>
      <h3 className="mt-3 mb-4">
        {isAuthenticated ? `Welcome ${loginData?.username} 🌱` : 'Welcome Guest 🌱'}
      </h3>

      {waterStatus && (
        <MDBRow className="mx-auto text-center">
          <MDBCol className='mb-4'>
            <MDBCard
              className="mb-3"
              style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <MDBCardBody style={{ border: '0px solid #808080', borderRadius: '8px', height: '100%' }}>
                <MDBCardTitle className="mb-3">Soil Moisture Status</MDBCardTitle>
                <div>{waterStatus}</div>
                <div>{lastChecked}</div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          
          <MDBCol className='mb-4'>
          <MDBCard
            className="mb-3"
            style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <MDBCardBody style={{ border: '0px solid #808080', borderRadius: '8px', height: '100%' }}>
              <MDBCardTitle className="mb-3">Your progress 🤩</MDBCardTitle>
              <div>Sustainability Score: {userData?.SustainabilityScore || 'N/A'}</div>
              <div>Achievements: {Object.keys(userData?.Achievements || {}).length}/4</div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    )}
      {weatherData && (
        <>
          <MDBRow className="mx-auto text-center">
            <MDBCol className='mb-4'>
              <MDBCard
                key={weatherData.county_name}
                className="mb-3"
                style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <MDBCardBody style={{ border: '0px solid #808080', borderRadius: '8px', height: '100%' }}>
                  <MDBCardTitle className="mb-3">Weather today in {UserCounty}</MDBCardTitle>
                  {weatherData.forecast.map((day) => {
                    const dateObj = new Date(day.date);
                    const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
                    const isToday = dateObj.toDateString() === new Date().toDateString();

                    if (isToday) {
                      return (
                        <div key={day.day_num}>
                          <div><CgCalendarDates /> Date: {formattedDate}</div>
                          <div><WiThermometer /> Max Temp: {day.max_temp}&deg;C</div>
                          <div><WiThermometerExterior /> Min Temp: {day.min_temp}&deg;C</div>
                          <div><WiCloudy /> Weather: {day.weather.replace(/_/g, ' ')}</div>
                          <div><WiDayCloudyGusts /> Wind Speed: {day.wind_speed.value} {day.wind_speed.units}</div>
                          <div><WiWindDeg /> Wind Direction: {day.wind_dir}</div>
                          <div><WiRaindrop /> Rainfall from 6-18: {day.rainfall_6_18}mm</div>
                          <div><WiRaindrop /> Rainfall from 18-6: {day.rainfall_18_6}mm</div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol className='mb-4'>
              <MDBCard
                key={`tomorrow-${weatherData.county_name}`}
                className="mb-3"
                style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
              >
                <MDBCardBody style={{ border: '0px solid #808080', borderRadius: '8px', height: '100%' }}>
                  <MDBCardTitle className="mb-3">Weather tomorrow in {UserCounty}</MDBCardTitle>
                  {weatherData.forecast.map((day) => {
                    const dateObj = new Date(day.date);
                    const tomorrow = new Date();
                    tomorrow.setDate(new Date().getDate() + 1);
                    const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();

                    if (isTomorrow) {
                      const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

                      return (
                        <div key={day.day_num}>
                          <div><CgCalendarDates /> Date: {formattedDate}</div>
                          <div><WiThermometer /> Max Temp: {day.max_temp}&deg;C</div>
                          <div><WiThermometerExterior />Min Temp: {day.min_temp}&deg;C</div>
                          <div><WiCloudy /> Weather: {day.weather.replace(/_/g, ' ')}</div>
                          <div><WiDayCloudyGusts /> Wind Speed: {day.wind_speed.value} {day.wind_speed.units}</div>
                          <div><WiWindDeg /> Wind Direction: {day.wind_dir}</div>
                          <div><WiRaindrop /> Rainfall from 6-18: {day.rainfall_6_18}mm</div>
                          <div><WiRaindrop /> Rainfall from 18-6: {day.rainfall_18_6}mm</div>
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

      {vegetables.length > 0 && (
        <MDBRow className="mx-auto text-center">
          <MDBCol className="mb-4">
            <Link to={`/plant/${vegetables[currentPlantIndex].plant_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <MDBCard className="mb-3" style={{ width: '20rem' }}>
                <MDBCardTitle className="text-center mt-3 mb-3">Plants in Season</MDBCardTitle>
                <img
                  src={vegetables[currentPlantIndex].plants}
                  alt={vegetables[currentPlantIndex].name}
                  style={{ width: '100%', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                />
                <MDBCardBody>
                  <MDBCardTitle className="text-center mt-3 mb-3">{vegetables[currentPlantIndex].name}</MDBCardTitle>
                  <MDBCardText className="text-center">Season: {vegetables[currentPlantIndex].season}</MDBCardText>
                  <MDBCardText className="text-center">Grow Time: {vegetables[currentPlantIndex].growtime}</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </Link>
          </MDBCol>

          {navigationArticle && (
            <MDBCol className="mb-4">
              <Link to={`/article/${navigationArticle.article_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <MDBCard className="mb-3" style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  <MDBCardTitle className="text-center mt-3 mb-3">Tutorial Article</MDBCardTitle>
                  <MDBCardImage src={navigationArticle.image} alt={navigationArticle.title} position="top" />
                  <MDBCardBody>
                    <MDBCardTitle className="text-center mt-3 mb-3">{navigationArticle.title}</MDBCardTitle>
                    <MDBCardText>{navigationArticle.content.slice(0, 100)}...</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </Link>
            </MDBCol>
          )}

        </MDBRow>
      )}

      <MDBRow className="mx-auto text-center">
        <MDBCol className='mb-4'>
          <MDBCard
            className="mb-3"
            style={{ width: '20rem', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
          >
            <MDBCardBody style={{ border: '0px solid #808080', borderRadius: '8px', height: '100%' }}>
              <MDBCardTitle className="mb-3">✨ More Questions? ✨</MDBCardTitle>
              <a href="https://chat.openai.com/g/g-lufaLKPNR-green-thumb-guide" target="_blank" rel="noopener noreferrer">Ask The Green Thumb Guide</a>
              <div style={{ marginTop: '10px' }}>
                Use our custom GPT to get tailored answers to your garden!*
              </div>
              <div><small>*ChatGPT4 subscription required</small></div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default HomePage;
