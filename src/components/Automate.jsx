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

import './style.css';
import { HotTable, HotColumn } from '@handsontable/react';

import { getGrade, getPoints, getRemark, meanGrade } from '../utils/tableUtils';
import { addClassesToRows, alignHeaders } from './hooks';
import 'handsontable/dist/handsontable.min.css';
import { getTeacherComment, getPrincipalComment } from '../utils/tableUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



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



const AutoTable = ({studentsData}) => {
  const utils = useTable(); 
  const data = studentsData.subjects
  const dataWithCalculations = data.map((row) => {
    const percentage =
      (row[1] !== '' || row[1]) < 30 && (row[2] !== '' || row[2] < 70)
        ? row[1] + row[2]
        : '';

    const grade = percentage !== '' ? getGrade(row[0], percentage) : '';
    const points = grade !== '' ? getPoints(grade) : '';
    const remark = grade !== '' ? getRemark(grade) : '';
    return [...row, percentage, grade, points, remark];
  });

  const [tableData, setTableData] = useState(dataWithCalculations);
  const [totalPercentage, setTotalPercentage] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [meanScore, setMeanScore] = useState('');

  console.log(`${utils.student_name } : ${tableData}`)
  const calculateTotals = (data) => {
    const totals = data.reduce(
      (totals, row) => {
        if (row[3] !== '' && row[5] !== '') {
          totals.totalPercentage += row[3];
          totals.totalPoints += row[5];
          totals.subjectCount++;
        }
        return totals;
      },
      { totalPercentage: 0, totalPoints: 0, subjectCount: 0 }
    );

    let meanScore = '';

    if (utils.form === '1' || utils.form === '2') {
      meanScore =
        totals.subjectCount > 0 ? (totals.totalPercentage / 10).toFixed(1) : '';
    }

    if (utils.form === '3' || utils.form === '4') {
      meanScore =
        totals.subjectCount > 0 ? (totals.totalPoints / 7).toFixed(1) : '';
    }

    const meanPoints =
      totals.subjectCount > 0 ? totals.totalPoints / totals.subjectCount : '';
    const meanGrade = getGrade('english', meanScore);
    const teacherComment = getTeacherComment(meanScore);
    const principalComment = getPrincipalComment(meanScore);

    utils.setPrincipalsComment(principalComment);
    utils.setClassTeachersComment(teacherComment);

    return {
      ...totals,
      meanScore,
      meanPoints,
      meanGrade,
      teacherComment,
      principalComment,
    };
  };

  const handleAfterChange = (changes, source) => {
    if (source === 'edit') {
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (prop === 1 && newValue > 30) {
          toast.error('CAT cannot be greater than 30', {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          return;
        }
        if (prop === 2 && newValue > 70) {
          toast.error('MAIN cannot be greater than 70', {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          return;
        }

        if (prop === 1 || prop === 2) {
          const newRowData = [...tableData[row]];
          newRowData[prop] = newValue; // Update value
          newRowData[3] = newRowData[1] + newRowData[2]; // Update percentage
          const grade = getGrade(newRowData[0], newRowData[3]); // Calculate grade
          newRowData[4] = grade; // Update grade
          newRowData[5] = getPoints(grade); // Update points
          newRowData[6] = getRemark(grade); // Update remarks

          const updatedData = [...tableData];
          updatedData[row] = newRowData;
          setTableData(updatedData);

          // Update totalPercentage, totalPoints, meanScore, and meanPoints
          const { totalPercentage, totalPoints, meanScore } =
            calculateTotals(updatedData);
          setTotalPercentage(totalPercentage);
          setTotalPoints(totalPoints);
          setMeanScore(meanScore);
        }
      });
    }
  };

  React.useEffect(() => {
    const { totalPercentage, totalPoints, meanScore } =
      calculateTotals(tableData);
    setTotalPercentage(totalPercentage);
    setTotalPoints(totalPoints);
    setMeanScore(meanScore);
  }, [tableData]);

  React.useEffect(() => {
    const updatedDataWithCalculations = studentsData.subjects.map((row) => {
      const percentage =
        (row[1] !== '' || row[1]) < 30 && (row[2] !== '' || row[2] < 70)
          ? row[1] + row[2]
          : '';
      const grade = percentage !== '' ? getGrade(row[0], percentage) : '';
      const points = grade !== '' ? getPoints(grade) : '';
      const remark = grade !== '' ? getRemark(grade) : '';
      return [...row, percentage, grade, points, remark];
    });
    setTableData(updatedDataWithCalculations);
  }, [studentsData]);

  const totalRow =
    utils.form === '1' || utils.form === '2'
      ? ['TOTAL MARKS/POINTS', '', '', totalPercentage, '', '']
      : ['TOTAL MARKS/POINTS', '', '', '', '', totalPoints, ''];

  const OtherRow = ['MEAN SCORE', '', '', meanScore, '', ''];
  const GradeRow =
    utils.form === '1' || utils.form === '2'
      ? ['MEAN GRADE', '', '', '', meanGrade(meanScore, false), '', '']
      : ['MEAN GRADE', '', '', '', meanGrade(totalPoints, true), '', ''];

  const positionThisTermRow = ['POSITION THIS TERM', '', '', '', '', '', ''];
  const outOfRow = ['OUT OF', '', '', '', '', '', ''];
  const positionLastTermRow = ['POSITION LAST TERM', '', '', '', '', '', ''];

  return (
    <div>
      <HotTable
        data={[
          ...tableData,
          totalRow,
          OtherRow,
          GradeRow,
          positionThisTermRow,
          outOfRow,
          positionLastTermRow,
        ]}
        height={550}
        colWidths={[140, 80, 80, 10, 10, 10, 100, 70, 10, 70]}
        nestedHeaders={[
          [
            { label: 'SUBJECTs', colspan: 1 },
            { label: 'CAT', colspan: 1 },
            { label: 'MAIN ', colspan: 1 },
            { label: 'Total', colspan: 3 },
            { label: 'Remarks', colspan: 1 },
            { label: 'INITIALS', colspan: 1 },
          ],

          [
            '',
            'out of 30',
            'out of 70 ',
            'Percentage',
            'Grade',
            'Points',
            '',
            '',
            '',
          ],
        ]}
        columnSorting={true}
        hiddenColumns={{
          indicators: true,
        }}
        contextMenu={true}
        multiColumnSorting={true}
        filters={true}
        afterGetColHeader={alignHeaders}
        beforeRenderer={addClassesToRows}
        manualRowMove={true}
        licenseKey='non-commercial-and-evaluation'
        afterChange={handleAfterChange}
        columnHeaderHeight={[20, 20]}
      >
        <HotColumn data={0} readOnly />
        <HotColumn data={1} type='numeric' />
        <HotColumn data={2} type='numeric' />
        <HotColumn data={3} type='numeric' readOnly />
        <HotColumn data={4} readOnly />
        <HotColumn data={5} readOnly />
        <HotColumn data={6} readOnly />
        <HotColumn data={7} />
      </HotTable>
      <ToastContainer />
    </div>
  );
};




const generateReportCard = (student) => {
  
  return (
    <div>
      <Header utils={student} />
      <AutoTable studentsData={student} />
      <br />
    </div>
  );
};

function Automate({ utils }) {
  const [content, setContent] = useState(null);

  const waitForImageLoad = (elem) => {
    return new Promise((resolve) => {
      const img = elem.querySelector('img');
      if (!img) {
        resolve();
        return;
      }
      if (img.complete) {
        resolve();
      } else {
        img.addEventListener('load', () => resolve());
      }
    });
  };

  async function* generatePDFs(students) {
    const sortedStudents = students.sort((a, b) =>
      a.student_name.localeCompare(b.student_name)
    );

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
  }

  const handleGeneratePDF = async () => {
    try {
      const zip = new JSZip();
      for await (const pdf of generatePDFs(utils)) {
        zip.file(`${pdf.name}.pdf`, pdf.data, { filename: `${pdf.name}.pdf` });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'report-cards.zip');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div id='content'>{content}</div>

      <Button variant='contained' onClick={handleGeneratePDF}>
        Download All Report Cards
      </Button>
    </>
  );
}

export default Automate;
