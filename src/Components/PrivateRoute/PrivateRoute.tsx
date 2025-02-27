import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/auth";


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const accessToken = getCookie("access_token");
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
