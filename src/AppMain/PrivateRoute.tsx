import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie'; // You can use any cookie library

const PrivateRoute: React.FC = () => {
  // Get the refresh token from cookies
  const refreshToken = Cookies.get('access_token');
  console.log("refreshToken", refreshToken)

  // If there's no refresh token, redirect to the login page
  if (!refreshToken) {
    return <Navigate to="/login" />;
  }

  // If the refresh token is present, render the nested route
  return <Outlet />;
};

export default PrivateRoute;
