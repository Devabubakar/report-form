import {  Typography } from '@mui/material';
import React from 'react';
import { useTable } from '../utils/useTable';


const ReportCard = () => {
  const utils = useTable();
  return (
    <div>
      <Typography
        color='red'
        variant='body2'
        fontWeight='600'
        sx={{ borderBottom: '1px solid black' }}
      >
        CLASS TEACHERS COMMENT'S
      </Typography>
      <br />
      <Typography
        variant='body1'
        fontWeight='400'
        sx={{ width: '90% ', margin: '10px 0' }}
      >
        {utils.classTeachersComment}
      </Typography>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='body2' fontWeight='400'>
          Date:
        </Typography>
        <Typography variant='body2' fontWeight='400'>
          Sign:
        </Typography>
        <div></div>
      </div>

      <hr style={{width:'90%'}}/>
      <Typography
        color='red'
        variant='body2'
        fontWeight='600'
        sx={{ borderBottom: '1px solid black' }}
      >
        PRINCIPALS/D-PRINCIPALS COMMENT'S
      </Typography>
      <br />
      <Typography
        variant='body1'
        fontWeight='400'
        sx={{ margin: '10px 0' }}
      >
        {utils.principalsComment}
      </Typography>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='body2' fontWeight='400'>
          Date:
        </Typography>
        <Typography variant='body2' fontWeight='400'>
          Sign:
        </Typography>
        <div></div>
      </div>
      <hr style={{width:'90%'}}/>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='body2' fontWeight='400'>
          Closing Date: <span>{utils.openingDate} </span>
        </Typography>
        <Typography variant='body2' fontWeight='400'>
          Opening Date: <span>{utils.closingDate}</span>
        </Typography>
        <div></div>
      </div>
    </div>
  );
};

export default ReportCard;
