import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: import.meta.env.VITE_REACT_APP_USER_POOL_ID as string,
  ClientId: import.meta.env.VITE_REACT_APP_CLIENT_ID as string,
};

const UserPool = new CognitoUserPool(poolData);

export default UserPool;
