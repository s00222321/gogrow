import React, { useState, useEffect } from "react";
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

function Navbar() {
  const { loginData, isAuthenticated, logout, clearUserData } = useAuth();
  const [userProfilePic, setUserProfilePic] = useState("/gogrow.svg");

  const isMobile = window.innerWidth < 992;

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchUserData = async () => {
      try {
        if (isAuthenticated && loginData && loginData.username) {
          const response = await fetch(
            `https://0fykzk1eg7.execute-api.eu-west-1.amazonaws.com/v1/users/${loginData.username}`,
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

    let isMounted = true;

    fetchUserData();

    return () => {
      isMounted = false;
      abortController.abort(); 
    };
  }, [loginData, isAuthenticated]);

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      console.log('Before clearing user data:', userProfilePic);
  
      // Clear user data and log out
      clearUserData();
      logout();
  
      // Update the state after logout
      setUserProfilePic("/defaulticon.svg");
  
      console.log('After setting default pic:', userProfilePic);
  
      // Redirect to login page
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
            <span className="badge rounded-pill badge-notification bg-danger">
              1
            </span>
          </MDBDropdownToggle>
          <MDBDropdownMenu style={{ width: '250px' }}>
            <MDBDropdownItem link>
              <MDBNavbarLink className="dropdownlink" href="/sensors">
                Your plant needs water!
              </MDBNavbarLink>
            </MDBDropdownItem>
            <MDBDropdownItem link>
              <MDBNavbarLink className="dropdownlink" href="/home">
                Blight warning!
              </MDBNavbarLink>
            </MDBDropdownItem>
            <MDBDropdownItem link>
              <MDBNavbarLink className="dropdownlink" href="/home">
                Dry weather ahead!
              </MDBNavbarLink>
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
              <MDBNavbarLink className="dropdownlink" href="/userdetails">
                Settings
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
