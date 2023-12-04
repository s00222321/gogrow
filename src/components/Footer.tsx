import { MDBFooter } from "mdb-react-ui-kit";

export default function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "50vh" }}
    >
      <div style={{ flex: 1 }}>{/* Your main content goes here */}</div>
      <MDBFooter
        bgColor="light"
        className="text-center text-lg-left"
        style={{ marginTop: "auto" }}
      >
        <div className="text-center p-3">
          &copy; {new Date().getFullYear()} Copyright:{" "}
          <a className="text-dark" href="gogrow">
            MDBootstrap.com
          </a>
        </div>
      </MDBFooter>
    </div>
  );
}
