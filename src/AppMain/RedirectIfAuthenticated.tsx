import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface RedirectIfAuthenticatedProps {
  children: ReactNode;
}

const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
  const token = Cookies.get('access_token');

  if (token) {
    return <Navigate to="/admin/article" />;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
