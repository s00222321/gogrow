import React, { useState } from 'react';
import { MDBContainer, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../Cognito';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = new CognitoUser({
      Username: loginData.username,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: loginData.username,
      Password: loginData.password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        console.log('Authentication Successful', session);
        login(loginData.username);
        navigate('/home');
      },
      onFailure: (err) => {
        console.error('Authentication failed', err);
        toast.error("Incorrect username or password");
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('Password change required');
      },
    });
  };

  return (
    <MDBContainer
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
    >
      <div className="p-5 border rounded shadow bg-white login-form-container">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <span className="h4">Log in</span>
          </div>
          <div className="mb-4">
            <MDBInput
              label="Your username"
              type="username"
              id="username"
              name="username"
              value={loginData.username}
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
          <div className="text-center mt-4 d-flex justify-content-between">
            <MDBBtn color="primary" type="submit">
              Log in
            </MDBBtn>
            <MDBBtn onClick={() => navigate('/register')}>
              Register
            </MDBBtn>
          </div>
        </form>
      </div>
    </MDBContainer>
  );
};

export default Login;
