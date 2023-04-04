import React from 'react';
import AppBar from '../components/AppBar';
import { Grid } from '@mui/material';

import CrudInput from '../components/TableInput';

import Combined from './Combined';
import Typography from '@mui/material/Typography';
import Automate from '../components/Automate';

const Home = () => {
  return (
    <React.Fragment>
      <AppBar />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CrudInput />
         
        </Grid>
        <Grid item xs={12} sm={8}>
          <Combined />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Home;
