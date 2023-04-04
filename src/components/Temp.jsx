import React, { useState } from 'react';
import './style.css';
import { HotTable, HotColumn } from '@handsontable/react';

import { getGrade, getPoints, getRemark,  meanGradeUtil } from '../utils/tableUtils';
import { addClassesToRows, alignHeaders } from './hooks';
import 'handsontable/dist/handsontable.min.css';
import { getTeacherComment, getPrincipalComment } from '../utils/tableUtils';
import { useTable } from '../utils/useTable';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = ({ studentsData }) => {
  const utils = useTable();
  
  // Define calculateTotals function outside useEffect
  const calculateTotals = (data) => {
    //function to calculate total percentage and total points
    const totals = data.reduce(
      (totals, row) => {
        if (row[3] !== '' && row[5] !== '') {
          if (row[4] !== '') {
            totals.totalPoints += row[5];
            totals.subjectCount++;
          }
        }
        return totals;
      },
      { totalPoints: 0, subjectCount: 0 }
    );
  
    let meanScore = '';
  
    if (studentsData.form === 1 || studentsData.form === 2) {
      meanScore =
        totals.subjectCount > 0 ? (studentsData.total / 10).toFixed(1) : '';
    }
  
    if (studentsData.form === 3 || studentsData.form === 4) {
      meanScore =
        totals.subjectCount > 0 ? (totals.totalPoints / 7).toFixed(1) : '';
    }
  
    const meanPoints =
      totals.subjectCount > 0 ? totals.totalPoints / totals.subjectCount : '';
    //if form 1 or two, mean grade is mean score, true 
    //if form 3 or 4, mean grade is mean points, false
    const meanGrade = meanGradeUtil(studentsData.form, meanScore, meanPoints);
    const teacherComment = getTeacherComment(meanScore);
    const principalComment = getPrincipalComment(meanScore);
  
    utils.setPrincipalsComment(principalComment);
    utils.setClassTeachersComment(teacherComment);

    // Update state for totalPoints and meanScore
    setTotalPoints(totals.totalPoints);
    setMeanScore(meanScore);
  
    return {
      ...totals,
      meanScore,
      meanPoints,
      meanGrade,
      teacherComment,
      principalComment,
    };  
  };

  const dataWithCalculations = studentsData.subjects.map((row) => {
    //if row[1] and row[2] are not empty, add them together and store in percentage
    // if row[1] is 0 or row[2] is 0, percentage is either which is not 0
    const percentage = row[1] + row[2]
    
      
    const grade = percentage !== '' ? getGrade(row[0], percentage) : '';
    const points = grade !== '' ? getPoints(grade) : '';
    const remark = grade !== '' ? getRemark(grade) : '';
      
    return [...row, percentage, grade, points, remark];
 });
 
  const [tableData, setTableData] = useState(dataWithCalculations);
 
  const [totalPoints, setTotalPoints] = useState('');
  const [meanScore, setMeanScore] = useState('');

  React.useEffect(() => {
    // Pass updated tableData to calculateTotals function
    const { totalPercentage, totalPoints, meanScore } =
      calculateTotals(tableData);

    const updatedDataWithCalculations = studentsData.subjects.map((row) => {
      const percentage = row[1] + row[2]
    

      const grade = percentage !== '' ? getGrade(row[0], percentage) : '';
      const points = grade !== '' ? getPoints(grade) : '';
      const remark = grade !== '' ? getRemark(grade) : '';
      
      return [...row, percentage, grade, points, remark];
    });

    setTableData(updatedDataWithCalculations);
  }, [studentsData]);

  const totalRow =
    studentsData.form === 1 || studentsData.form === 2
      ? ['TOTAL MARKS/POINTS', '', '', studentsData.total, '', '']
      : ['TOTAL MARKS/POINTS', '', '', '', '', totalPoints, ''];

  const OtherRow = ['MEAN SCORE', '', '', meanScore, '', ''];

  const GradeRow =
    studentsData.form === 1 || studentsData.form === 2
      ? ['MEAN GRADE', '', '', '', meanGradeUtil(meanScore, false), '', '']
      : ['MEAN GRADE', '', '', '', meanGradeUtil(totalPoints, true), '', ''];

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

export default App;
