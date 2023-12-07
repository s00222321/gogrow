import { MDBFooter, MDBContainer, MDBIcon, MDBBtn } from "mdb-react-ui-kit";

export default function App() {
  return (
    <MDBFooter className="bg-light text-center text-white">
      <MDBContainer className="p-4 pb-0">
        <section className="mb-4">
          <MDBBtn
            floating
            className="m-1"
            style={{ backgroundColor: "#3b5998" }}
            href="#!"
            role="button"
          >
            <MDBIcon fab icon="facebook-f" />
          </MDBBtn>

          <MDBBtn floating className="m-1" href="#!" role="button">
            <MDBIcon fab icon="twitter" />
          </MDBBtn>

          <MDBBtn floating className="m-1" href="#!" role="button">
            <MDBIcon fab icon="google" />
          </MDBBtn>
          <MDBBtn floating className="m-1" href="#!" role="button">
            <MDBIcon fab icon="instagram" />
          </MDBBtn>

          <MDBBtn floating className="m-1" href="#!" role="button">
            <MDBIcon fab icon="linkedin-in" />
          </MDBBtn>

          <MDBBtn floating className="m-1" href="#!" role="button">
            <MDBIcon fab icon="github" />
          </MDBBtn>
        </section>
      </MDBContainer>

      <div
        className="text-center p-3 text-dark"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2022 Copyright:
        <a className="text-dark" href="#">
          GoGrow
        </a>
      </div>
    </MDBFooter>
  );
}
