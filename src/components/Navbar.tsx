import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
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

  const toaster = () => {
    toast("Hello world!");
  };

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
              <MDBNavbarLink href="articles">Articles</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href="forum">Forum</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>

        <MDBDropdown className="me-3">
          <MDBDropdownToggle tag="a" href="#" role="button" onClick={toaster}>
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
        <div>
          <Toaster
            position="top-right"
            reverseOrder={false}
            containerStyle={{
              top: 80,
            }}
          />
        </div>
        <MDBDropdown className="me-3">
          <MDBDropdownToggle tag="a" href="#" role="button">
            <MDBIcon fas icon="user-circle" size="2x" className="me-2" />
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
