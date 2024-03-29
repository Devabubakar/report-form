import React, { useState } from 'react';
import './style.css';
import { HotTable, HotColumn } from '@handsontable/react';

import {
  getGrade,
  getPoints,
  getRemark,
  meanGradeUtil,
} from '../utils/tableUtils';
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
    const requiredSubjects = [
      'ENGLISH',
      'KISWAHILI',
      'MATHEMATICS',
      'CHEMISTRY',
      'BIOLOGY',
    ];

    const totals = data.reduce(
      (totals, row) => {
        if (row[3] !== '' && row[5] !== '') {
          if (row[4] !== '') {
            if (requiredSubjects.includes(row[0])) {
              totals.totalPoints += row[5];
              totals.subjectCount++;
            } else if (
              !totals.optionalSubjects[row[0]] ||
              row[5] > totals.optionalSubjects[row[0]].points
            ) {
              totals.optionalSubjects[row[0]] = {
                points: row[5],
                index: totals.optionalSubjects.length,
              };
            }
          }
        }
        return totals;
      },
      { totalPoints: 0, subjectCount: 0, optionalSubjects: [] }
    );

    const sortedOptionalSubjects = Object.values(totals.optionalSubjects)
      .sort((a, b) => b.points - a.points)
      .slice(0, 7 - totals.subjectCount);

    sortedOptionalSubjects.forEach((subject) => {
      totals.totalPoints += subject.points;
      totals.subjectCount++;
    });
    

    let meanScore = '';

    if (utils.form === '1' || utils.form === '2'  ) {
      meanScore =
        totals.subjectCount > 0 ? (studentsData.total / 9).toFixed(1) : '';
    }

    if (utils.form === '4' || utils.form === '3' ) {
      meanScore =
        totals.subjectCount > 0 ? (studentsData.total / 7).toFixed(1) : '';
    }
    setTotalPoints(totals.totalPoints);
    // Update the meanPoints calculation
    const meanPoints =
      totals.subjectCount > 0 ? (totals.totalPoints / 7).toFixed(1) : '';
    setMeanPoints(meanPoints);
    //if form 1 or two, mean grade is mean score, true
    //if form 3 or 4, mean grade is mean points, false

    const teacherComment = getTeacherComment(meanScore);
    const principalComment = getPrincipalComment(meanScore);

    utils.setPrincipalsComment(principalComment);
    utils.setClassTeachersComment(teacherComment);

    // Update state for totalPoints and meanScore

    setMeanScore(meanScore);

    return {
      ...totals,
      meanScore,
      meanPoints,
      teacherComment,
      principalComment,
    };
  };

  const dataWithCalculations = studentsData.subjects.map((row) => {
    //if row[1] and row[2] are not empty, add them together and store in percentage
    // if row[1] is 0 or row[2] is 0, percentage is either which is not 0
    const percentage = row[1] + row[2];

    const grade = percentage !== '' ? getGrade(row[0], percentage) : '';
    const points = grade !== '' ? getPoints(grade) : '';
    const remark = grade !== '' ? getRemark(grade) : '';
    // update intials row with data from utils.initials
    let initials = ""
    if (percentage !== "" && row[4] !== ""){
      initials = utils.initials[row[0]]
    }
  

    return [...row, percentage, grade, points, remark,];
  });

  const [tableData, setTableData] = useState(dataWithCalculations);

  const [totalPoints, setTotalPoints] = useState('');
  const [meanPoints, setMeanPoints] = useState('');
  const [meanScore, setMeanScore] = useState('');


  

  React.useEffect(() => {
    const updatedDataWithCalculations = studentsData.subjects.map((row) => {
      const percentage = row[1] + row[2];
      let initials = '';
      
      if (percentage !== "" && row[4] !== ""){
        initials = utils.initials[row[0]] || '';
      }
      
      const grade = percentage !== '' ? getGrade(row[0], percentage) : '';
      const points = grade !== '' ? getPoints(grade) : '';
      const remark = grade !== '' ? getRemark(grade) : '';
  
      return [...row, percentage, grade, points, remark]; 
    });
  
    const { totalPoints, meanPoints } = calculateTotals(updatedDataWithCalculations);
  
    setMeanPoints(meanPoints);
    setTotalPoints(totalPoints);
  
    setTableData(updatedDataWithCalculations);
  }, [ studentsData]);

  console.log(tableData)
  console.log(utils.initials)
  

  const totalRow =
    utils.form === '1' || utils.form === '2'  
      ? ['TOTAL MARKS/POINTS', '', '', studentsData.total, '', '']
      : ['TOTAL MARKS/POINTS', '', '', '', '', studentsData.totalPoints, ''];

  const OtherRow =
    utils.form === '1' || utils.form === '2'  
      ? ['MEAN SCORE', '', '', studentsData.meanScore, '', '']
      : ['MEAN SCORE', '', '', '', '', studentsData.meanPoints, ''];


  const GradeRow =
    utils.form === '1' || utils.form === '2' 
      ? ['MEAN GRADE', '', '', '', meanGradeUtil(studentsData.meanScore, false), '', '']
      : ['MEAN GRADE', '', '', '', meanGradeUtil(studentsData.meanPoints, true), '', ''];

  const positionThisTermRow = [
    'POSITION THIS TERM',
    '',
    '',
    '',
    studentsData.position,
    '',
    '',
  ];
  const outOfRow = ['OUT OF', '', '', '', utils.studentsData.length, '', ''];
  const positionLastTermRow = ['POSITION LAST TERM', '', '', '', '', '', ''];
  console.log(tableData)

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
        height={570}
        colWidths={[160, 80, 80, 10, 10, 10, 100, 70, 10, 100]}
        nestedHeaders={[
          [
            { label: 'SUBJECTs', colspan: 1 },
            { label: 'CAT', colspan: 1 },
            { label: 'MAIN ', colspan: 1 },
            { label: 'Total', colspan: 3 }, { label: 'Remarks', colspan: 1 }, { label: 'INITIALS', colspan: 1 }, ],
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
        className="hot-column-header"
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
        
      </HotTable>
      <ToastContainer />
    </div>
  );
};

export default App;
