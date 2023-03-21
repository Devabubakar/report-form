import React from 'react';
import { useAuth } from './useAuth';
import { Navigate } from 'react-router';
import { Backdrop, CircularProgress } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  if (auth.loading === true) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  return auth?.user ? children : <Navigate to='/signin' replace />;
};

export default PrivateRoute;
