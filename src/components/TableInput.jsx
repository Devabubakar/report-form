import { TextField } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { useTable } from '../utils/useTable';
import Typography from '@mui/material/Typography';
import Automate from './Automate';
import UploadFile from '../pages/UploadFile';
const PersonalContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20% 10%;
`;

const Header = () => {
  const utils = useTable();
  return (
    <PersonalContainer>
      <Typography variant='subtitle1' color='red'>
        Ensure you fill this section first
      </Typography>{' '}
      <br />
      <TextField
        value={utils.names}
        onChange={(e) => utils.setNames(e.target.value)}
        label='Names'
      />
      <TextField
        value={utils.form}
        onChange={(e) => utils.setForm(e.target.value)}
        label='Form'
      />
      <TextField
        value={utils.year}
        onChange={(e) => utils.setYear(e.target.value)}
        label='Year (2023)'
      />
      <TextField
        value={utils.stream}
        onChange={(e) => utils.setStream(e.target.value)}
        label='Stream'
      />
      <TextField
        value={utils.term}
        onChange={(e) => utils.setTerm(e.target.value)}
        label='Term'
      />
      <TextField
        value={utils.admissionNumber}
        onChange={(e) => utils.setAdmissionNumber(e.target.value)}
        label='Admission Number'
      />
      <TextField
        multiline
        rows={2}
        maxRows={4}
        label='Opening Date'
        onChange={(e) => utils.setOpeningDate(e.target.value)}
      />
      <TextField
        multiline
        rows={2}
        maxRows={4}
        label='Closing Date'
        onChange={(e) => utils.setClosingDate(e.target.value)}
      />
      
      <Typography variant='h6' style={{ marginTop: '10px' }}>
        OR UPLOAD EXCEL FILE
      </Typography>
      <UploadFile />
      
    </PersonalContainer>
  );
};

export default Header;
