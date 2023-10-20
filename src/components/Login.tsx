import React, { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login data submitted:", loginData);
  };

  return (
    <MDBContainer
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundColor: "#E8F5E9",
      }}
    >
      <div className="p-5 border rounded shadow bg-white">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <span className="h4">Log in</span>
          </div>
          <div className="mb-4">
            <MDBInput
              label="Your email"
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <MDBInput
              label="Your password"
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
            />
          </div>
          <div className="text-center mt-4">
            <MDBBtn color="primary" type="submit">
              Log in
            </MDBBtn>
          </div>
        </form>
      </div>
    </MDBContainer>
  );
};

export default Login;
