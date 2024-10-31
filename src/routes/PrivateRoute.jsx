import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const accessToken = sessionStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
