import React, { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import UserPool from "../Cognito";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

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

    UserPool.signUp(
      formData.username,
      formData.password,
      [emailAttribute],
      [],
      (err, data) => {
        if (err) console.error(err);
        else console.log(data);
      }
    );
  };

  return (
    <MDBContainer
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
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
              <option value="" disabled>
                Select County
              </option>
              <option value="Antrim">Antrim</option>
              <option value="Armagh">Armagh</option>
              <option value="Carlow">Carlow</option>
              <option value="Cavan">Cavan</option>
              <option value="Clare">Clare</option>
              <option value="Cork">Cork</option>
              <option value="Derry">Derry</option>
              <option value="Donegal">Donegal</option>
              <option value="Down">Down</option>
              <option value="Dublin">Dublin</option>
              <option value="Fermanagh">Fermanagh</option>
              <option value="Galway">Galway</option>
              <option value="Kerry">Kerry</option>
              <option value="Kildare">Kildare</option>
              <option value="Kilkenny">Kilkenny</option>
              <option value="Laois">Laois</option>
              <option value="Leitrim">Leitrim</option>
              <option value="Limerick">Limerick</option>
              <option value="Longford">Longford</option>
              <option value="Louth">Louth</option>
              <option value="Mayo">Mayo</option>
              <option value="Meath">Meath</option>
              <option value="Monaghan">Monaghan</option>
              <option value="Offaly">Offaly</option>
              <option value="Roscommon">Roscommon</option>
              <option value="Sligo">Sligo</option>
              <option value="Tipperary">Tipperary</option>
              <option value="Tyrone">Tyrone</option>
              <option value="Waterford">Waterford</option>
              <option value="Westmeath">Westmeath</option>
              <option value="Wexford">Wexford</option>
              <option value="Wicklow">Wicklow</option>
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
