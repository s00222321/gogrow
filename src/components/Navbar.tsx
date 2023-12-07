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

function Navbar() {
  const [userProfilePic, setUserProfilePic] = useState("/gogrow.svg");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        "https://kiozllvru1.execute-api.eu-west-1.amazonaws.com/v1/siobhan_donnelly"
      );
      const data = await response.json();
      if (data && data.data && data.data.ProfilePic) {
        setUserProfilePic(data.data.ProfilePic);
      }
    };
    fetchUserData();
  }, []);

  return (
    <MDBNavbar expand="lg" light bgColor="light" fixed="top">
      <div className="container-fluid d-flex align-items-center">
        <MDBNavbarBrand href="/home" className="me-3">
          <img src="/gogrow.svg" height="32" alt="GoGrow Logo" />
        </MDBNavbarBrand>

        {isMobile ? (
          <MDBDropdown className="me-auto">
            <MDBDropdownToggle
              tag="a"
              href="#"
              role="button"
              className="hamburger"
            >
              <MDBIcon fas icon="bars" className="hamburger" />
            </MDBDropdownToggle>
            <MDBDropdownMenu>
              <MDBDropdownItem link>
                <MDBNavbarLink href="/mygarden">My Garden</MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink href="/plants">Plants</MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink href="/articles">Articles</MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink href="/forum">Forum</MDBNavbarLink>
              </MDBDropdownItem>
              <MDBDropdownItem link>
                <MDBNavbarLink href="/sensors">Sensors</MDBNavbarLink>
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
          <MDBDropdownToggle tag="a" href="#" role="button">
            <MDBIcon fas icon="bell" className="me-2" />
            <span className="badge rounded-pill badge-notification bg-danger">
              1
            </span>
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem link>Some news</MDBDropdownItem>
            <MDBDropdownItem link>Another news</MDBDropdownItem>
            <MDBDropdownItem link>Something else here</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>

        <MDBDropdown className="me-3">
          <MDBDropdownToggle tag="a" href="#" role="button">
            <img
              src={userProfilePic}
              alt="User"
              style={{ borderRadius: "50%", width: "32px", height: "32px" }}
              className="me-2"
            />
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem link>My profile</MDBDropdownItem>
            <MDBDropdownItem link>Settings</MDBDropdownItem>
            <MDBDropdownItem link>Logout</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </div>
    </MDBNavbar>
  );
}

export default Navbar;
