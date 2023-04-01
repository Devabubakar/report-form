import React, { useState } from 'react';
import { useTable } from '../utils/useTable';
import MyExcel from './MyExcel';
import Last from './Last';
import Button from '@mui/material/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Navigate } from 'react-router';

import { Typography } from '@mui/material';
import styled from 'styled-components';
import Hulucho from '../assets/hulucho.jpeg';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 600px;
`;

const HuluchoImg = styled.img`
  width: 200px;
  height: 160px;
  object-fit: cover;
  margin: 10px 0 0px 0;
`;

const Content = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const PersonalContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  text-align: left;
  margin-left: 10px;
`;

const Header = ({ utils }) => {
  return (
    <HeaderContainer>
      <HuluchoImg src={Hulucho} alt='hulucho' />

      <Content>
        <Typography fontWeight={900} variant='h5' color='green'>
          PROGRESS REPORT
        </Typography>
        <Typography fontWeight={600} variant='h6'>
          HULUGHO GIRLS SEC. SCHOOL
        </Typography>
        <br />
        <Typography fontSize={18} variant='h6' fontWeight={500}>
          P.O. BOX 53-70105, MASALANI
        </Typography>
        <Typography fontSize={13} variant='h6' fontWeight={500}>
          SCHOOL MOTTO: Education is Power{' '}
        </Typography>
        <hr />
        <PersonalContainer>
          <div>
            <Typography fontSize={12} variant='h6' fontWeight={500}>
              NAMES:{' '}
              <span style={{ color: 'red', textTransform: 'uppercase' }}>
                {utils.student_name}
              </span>
            </Typography>
            <Typography fontSize={13} variant='h6' fontWeight={500}>
              FORM:{' '}
              <span style={{ color: 'red', textTransform: 'uppercase' }}>
                {12}
              </span>
            </Typography>
            <Typography fontSize={13} variant='h6' fontWeight={500}>
              YEAR{' '}
              <span style={{ color: 'red', textTransform: 'uppercase' }}>
                {2023}
              </span>
            </Typography>
          </div>
          <div style={{ marginTop: '21px' }}>
            <Typography fontSize={13} variant='h6' fontWeight={500}>
              STRM:{' '}
              <span style={{ color: 'red', textTransform: 'uppercase' }}>
                {utils.student_id}
              </span>
            </Typography>
            <Typography fontSize={13} variant='h6' fontWeight={500}>
              TERM :{' '}
              <span style={{ color: 'red', textTransform: 'uppercase' }}>
                {3}
              </span>
            </Typography>
          </div>
          <Typography fontSize={12} variant='h6' fontWeight={500}>
            ADM:{' '}
            <span style={{ color: 'red', textTransform: 'uppercase' }}>
              {utils.student_id}
            </span>
          </Typography>
        </PersonalContainer>
      </Content>
    </HeaderContainer>
  );
};
function generateReportCard(student) {
  return (
    <div>
      <Header utils={student} />
      <br />
    </div>
  );
}

function Automate({ utils }) {
  const [content, setContent] = useState(null);
  const handleGeneratePDF = async () => {
    try {
      // Create a new instance of JSZip
      const zip = new JSZip();

      // Loop through each student and create a separate PDF file for each
      for (let i = 0; i < utils.length; i++) {
        const student = utils[i];
        // Generate HTML content for the student report card
        setContent(generateReportCard(student));
        // Wait for the content to be added to the DOM before rendering it as a canvas
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // Convert HTML content to canvas
        const canvas = await html2canvas(document.querySelector('#content'));

        // Create a new PDF document
        const doc = new jsPDF();

        // Add canvas to PDF document
        const imgData = canvas.toDataURL('image/jpeg');
        doc.addImage(imgData, 'JPEG', 10, 10, 190, 277);

        // Add PDF file for the student to JSZip instance
        const pdfData = doc.output('blob');
        zip.file(`${student.student_name}.pdf`, pdfData);
      }

      // Generate the folder containing all PDF files
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'report-cards.zip');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {utils.map((student, index) => (
        <div id='content' style={{ display: 'none' }}>
          {content}
        </div>
      ))}
      <Button variant='contained' onClick={handleGeneratePDF}>
        Download All Report Cards
      </Button>
    </>
  );
}

export default Automate;
