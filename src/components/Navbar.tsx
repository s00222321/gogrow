import { useState, useEffect } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import { useAuth } from './AuthContext';
import { USER_API, SENSOR_API, WEATHER_API } from '../apis';

function Navbar() {
  const { loginData, isAuthenticated, logout, clearUserData } = useAuth();
  const [userProfilePic, setUserProfilePic] = useState("/gogrow.svg");
  const [showWaterNotification, setShowWaterNotification] = useState(true);
  const [weatherNotification, setWeatherNotification] = useState(true);
  const [tempNotification, setTempNotification] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 992);
    }

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        if (isAuthenticated && loginData && loginData.username) {
          const response = await fetch(
            `${USER_API}/users/${loginData.username}`,
            { signal }
          );
          const data = await response.json();
          if (isMounted) {
            if (data && data.data && data.data.ProfilePic) {
              setUserProfilePic(data.data.ProfilePic);
            } else {
              setUserProfilePic("/defaultuser.png");
            }
          }
        } else {
          setUserProfilePic("/defaultuser.png");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (isMounted) {
          setUserProfilePic("/defaultuser.png");
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [loginData, isAuthenticated]);

  useEffect(() => {
    const fetchSoilMoistureData = async () => {
      const response = await fetch(`${SENSOR_API}/SoilMoisture`);
      const data = await response.json();
      const readings = JSON.parse(data.body);
      const mostRecentReading = readings[readings.length - 1];
      setShowWaterNotification(mostRecentReading.reading_value === "0");
    };

    fetchSoilMoistureData();
  }, []);

  // Added useEffect to determine rainfall level and return true if rainfall == 0 over three days
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (isAuthenticated && loginData && loginData.username) {
          const response = await fetch(
            `${USER_API}/users/${loginData.username}`
          );
          const jsonResponse = await response.json();
          const userCounty = jsonResponse.data?.County;
          const uppercaseCounty = userCounty ? userCounty.toUpperCase() : '';

          const weatherResponse = await fetch(WEATHER_API);
          const weatherData = await weatherResponse.json();

          const userCountyWeather = weatherData.find(
            (county: { county_name: any; }) => county.county_name === uppercaseCounty
          );

          if (userCountyWeather) {
            const noRainfallForThreeDays = userCountyWeather.forecast
              .slice(0, 3)
              .every((day: { rain: number; }) => day.rain === 0);

            if (noRainfallForThreeDays) {
              setWeatherNotification(true);
            } else {
              setWeatherNotification(false);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [isAuthenticated, loginData]);

  // Added useEffect to determine temperature and return true if temp <= 0 
  useEffect(() => {
    const fetchTempData = async () => {
      try {
        if (isAuthenticated && loginData && loginData.username) {
          const response = await fetch(
            `${USER_API}/users/${loginData.username}`
          );
          const jsonResponse = await response.json();
          const userCounty = jsonResponse.data?.County;
          const uppercaseCounty = userCounty ? userCounty.toUpperCase() : '';

          const weatherResponse = await fetch(WEATHER_API);
          const weatherData = await weatherResponse.json();

          const userCountyWeather = weatherData.find(
            (county: { county_name: any; }) => county.county_name === uppercaseCounty
          );

          if (userCountyWeather) {
            const lowTemperature = userCountyWeather.forecast
              .some((day: { min_temp: string; max_temp: string; }) => parseFloat(day.min_temp) < 0 || parseFloat(day.max_temp) < 0);

            if (lowTemperature) {
              setTempNotification(true);
            }
            else setTempNotification(false);
          }

        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchTempData();
  }, [isAuthenticated, loginData]);

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      console.log('Before clearing user data:', userProfilePic);

      clearUserData();
      logout();

      setUserProfilePic("/defaulticon.svg");

      console.log('After setting default pic:', userProfilePic);

      window.location.href = "/login";
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <div className="container-fluid d-flex align-items-center">
        <MDBNavbarBrand href="/home" className="me-3">
          <img src="/gogrow.svg" height="32" alt="GoGrow Logo" />
        </MDBNavbarBrand>

        {isMobile ? (
          <MDBDropdown className="me-auto">
            <MDBDropdownToggle
              tag="a"
              href="#!"
              role="button"
              className="hamburger"
            >
              <MDBIcon fas icon="bars" className="hamburger" />
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem link>
                <MDBNavbarLink className="dropdownlink" href="/mygarden">
                  My Garden
                </MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink className="dropdownlink" href="/plants">
                  Plants
                </MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink className="dropdownlink" href="/articles">
                  Articles
                </MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink className="dropdownlink" href="/forum">
                  Forum
                </MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink className="dropdownlink" href="/sensors">
                  Sensors
                </MDBNavbarLink>
              </MDBDropdownItem>
            </MDBDropdownMenu>
          </MDBDropdown>
        ) : (
          <MDBNavbarNav className="me-auto">
            <MDBNavbarItem>
              <MDBNavbarLink href="/mygarden">My Garden</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="/plants">Plants</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="/articles">Articles</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="/forum">Forum</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="/sensors">Sensors</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        )}

        <MDBDropdown className="me-3">
          <MDBDropdownToggle tag="a" href="#!" role="button">
            <MDBIcon fas icon="bell" className="me-2" />
            {showWaterNotification && ( // Add notification badge later
              <span className="badge rounded-pill badge-notification bg-danger">
              </span>
            )}
          </MDBDropdownToggle>
          <MDBDropdownMenu style={{ width: '250px' }}>
            <MDBDropdownItem link>
              {showWaterNotification ? (
                <MDBNavbarLink className="dropdownlink" href="/sensors">
                  Your plant needs water!
                </MDBNavbarLink>
              ) : null}
              {weatherNotification === true ? (
                <MDBNavbarLink className="dropdownlink" href="/home">
                  Dry weather ahead!
                </MDBNavbarLink>
              ) : null}
            </MDBDropdownItem>
            <MDBDropdownItem link>
              {tempNotification === true ? (
                <MDBNavbarLink className="dropdownlink" href="/home">
                  Frost Warning!
                </MDBNavbarLink>
              ) : null}
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>

        <MDBDropdown className="me-3">
          <MDBDropdownToggle tag="a" href="#!" role="button">
            <img
              src={userProfilePic}
              alt="User"
              style={{ borderRadius: "50%", width: "32px", height: "32px" }}
              className="me-2"
            />
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem link>
              <MDBNavbarLink className="dropdownlink" href="/userdetails">
                My profile
              </MDBNavbarLink>
            </MDBDropdownItem>
            <MDBDropdownItem link>
              <MDBNavbarLink className="dropdownlink" href="/leaderboard">
                Leaderboard
              </MDBNavbarLink>
            </MDBDropdownItem>
            <MDBDropdownItem link>
              <MDBNavbarLink className="dropdownlink" onClick={handleLogout}>
                Logout
              </MDBNavbarLink>
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </div>
    </MDBNavbar>
  );
}

export default Navbar;
