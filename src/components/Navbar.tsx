import { useState } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";

function Navbar() {
  const [showNav, setShowNav] = useState(false);

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <div className="container-fluid d-flex align-items-center">
        <MDBNavbarBrand href="#" className="me-3">
          <img src="/gogrow.svg" height="32" alt="GoGrow Logo" />
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowNav(!showNav)}
          className="me-auto"
        >
          <MDBIcon fas icon="bars" />
        </MDBNavbarToggler>

        <MDBCollapse navbar open={showNav} id="navbarContent">
          <MDBNavbarNav>
            <MDBNavbarItem>
              <MDBNavbarLink href="#">My Garden</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="#">Articles</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="#">Forum</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>

        <MDBDropdown className="me-3">
          <MDBDropdownToggle tag="a" href="#" role="button">
            <MDBIcon fas icon="bell" className="me-2" />
            <span className="badge rounded-pill badge-notification bg-danger">
              1
            </span>
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem href="#">Some news</MDBDropdownItem>
            <MDBDropdownItem href="#">Another news</MDBDropdownItem>
            <MDBDropdownItem href="#">Something else here</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>

        <MDBDropdown className="me-3">
          <MDBDropdownToggle tag="a" href="#" role="button">
            <MDBIcon fas icon="user-circle" size="2x" className="me-2" />
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem href="#">My profile</MDBDropdownItem>
            <MDBDropdownItem href="#">Settings</MDBDropdownItem>
            <MDBDropdownItem href="#">Logout</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </div>
    </MDBNavbar>
  );
}

export default Navbar;
