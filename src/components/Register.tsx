import React, { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import UserPool from "../Cognito";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
  county: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    county: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailAttribute = new CognitoUserAttribute({
      Name: "email",
      Value: formData.email,
    });

    const countyAttribute = new CognitoUserAttribute({
      Name: "custom:county",
      Value: formData.county,
    });

    UserPool.signUp(
      formData.username,
      formData.password,
      [emailAttribute, countyAttribute],
      [],
      (err, data) => {
        if (err) {
          console.error("Error during registration:", err);
        } else {
          console.log("Registration successful:", data);
          navigate("/login"); // Redirect to login page
        }
      }
    );
  };

  return (
    <MDBContainer
      fluid
      className="d-flex vh-100 justify-content-center align-items-center register-form-container"
    >
      <div className="p-5 border rounded shadow bg-white">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <span className="h4">Sign up</span>
          </div>
          <div className="mb-4">
            <MDBInput
              label="Username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <MDBInput
              label="Your email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <MDBInput
              label="Your password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <select
              className="form-select"
              id="county"
              name="county"
              value={formData.county}
              onChange={handleChange}
              style={{ color: formData.county === "" ? "#6c757d" : "#495057" }}
            >
              {/* options */}
            </select>
          </div>
          <div className="text-center mt-4">
            <MDBBtn color="primary" type="submit">
              Register
            </MDBBtn>
          </div>
        </form>
      </div>
    </MDBContainer>
  );
};

export default Register;
