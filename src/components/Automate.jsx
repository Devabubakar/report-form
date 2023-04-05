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
import CircularProgress from '@mui/material/CircularProgress';

import AutoTable from './Temp'





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
                {utils.form}
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



const generateReportCard = (student) => {
  
  return (
    <div>
      <Header utils={student} />
      <AutoTable studentsData={student} />
      <Last />
      <br />
    </div>
  );
};

function Automate({ utils }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);



  async function* generatePDFs(students) {
    const sortedStudents = students.sort((a, b) =>
      a.student_name.localeCompare(b.student_name)
    );
    setLoading(true); 

    for (const student of sortedStudents) {
      setContent(generateReportCard(student));

      // Add a short delay to give the component time to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(document.querySelector('#content'));

      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png', 1.0);

      let pdfName = `${student.student_name
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()}`;

      if (student.student_id) {
        pdfName += `_${student.student_id}`;
      }

      pdf.addImage(imgData, 'PNG', 10, 10);

      const pdfData = await pdf.output('blob');

      yield {
        name: pdfName,
        data: pdfData,
      };

    }
    setLoading(false);
  }

  const handleGeneratePDF = async () => {
    try {
      const zip = new JSZip();
      for await (const pdf of generatePDFs(utils)) {
        zip.file(`${pdf.name}.pdf`, pdf.data, { filename: `${pdf.name}.pdf` });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'report-cards.zip');

    
        window.location.reload();
      

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <Button variant='contained' onClick={handleGeneratePDF}>
        Download All Report Cards
      </Button>

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <CircularProgress size={80} />
        </div>
      )}

      <div id='content' style={{marginTop:'100vh'}}>{content}</div>
    </>
  );
}

export default Automate;
