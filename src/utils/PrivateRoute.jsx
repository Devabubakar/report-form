import React from 'react';
import { useAuth } from './useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  if (auth?.loading) {
    <div>Loading..</div>;
  }

  return auth?.user ? children : <Navigate to='/signin' replace />;
};

export default PrivateRoute;
