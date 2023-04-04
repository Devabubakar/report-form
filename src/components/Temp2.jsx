import React, { useState, useEffect } from 'react';
import './style.css';
import { HotTable, HotColumn } from '@handsontable/react';
import { getGrade, getPoints, getRemark, meanGrade } from '../utils/tableUtils';
import { addClassesToRows, alignHeaders } from './hooks';
import 'handsontable/dist/handsontable.min.css';
import { getTeacherComment, getPrincipalComment } from '../utils/tableUtils';
import { useTable } from '../utils/useTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const utils = useTable();
  const data = utils.studentsData.subjects;

  const [tableData, setTableData] = useState([]);

  const calculateTotals = (data) => {
    const totals = data.reduce(
      (totals, row) => {
        if (row[3] !== '' && row[5] !== '') {
          totals.totalPoints += row[5];
          totals.subjectCount++;
        }
        return totals;
      },
      {  totalPoints: 0, subjectCount: 0 }
    );

    // Calculate the correct total percentage

    let meanScore = '';

    if (utils.studentsData.form === 1 || utils.studentsData.form === 2) {
      meanScore =
        totals.subjectCount > 0
          ? (utils.studentsData.total / 10).toFixed(1)
          : '';
    }

    if (utils.studentsData.form === 3 || utils.studentsData.form === 4) {
      meanScore =
        totals.subjectCount > 0 ? (totals.totalPoints / 7).toFixed(1) : '';
    }

    const meanPoints =
      totals.subjectCount > 0 ? totals.totalPoints / totals.subjectCount : '';
    const meanGrade = getGrade('english', meanScore) || '';
    const teacherComment = getTeacherComment(meanScore) || '';
    const principalComment = getPrincipalComment(meanScore) || '';

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

  useEffect(() => {
    if (!data.length) return;

    const dataWithCalculations = data.map((row) => {
      const percentage = utils.studentsData.total;

      const grade = getGrade(row[0], percentage) || '';
      const points = getPoints(grade) || '';
      const remark = getRemark(grade) || '';

      return [...row, percentage, grade, points, remark];
    });

    setTableData(dataWithCalculations);
  }, [data]);

  useEffect(() => {
    const {  totalPoints, meanScore } =
      calculateTotals(tableData);

    
    setTotalPoints(totalPoints);
    setMeanScore(meanScore);
  }, [tableData]);


  const [totalPoints, setTotalPoints] = useState('');
  const [meanScore, setMeanScore] = useState('');

  const totalRow =
    utils.studentsData.form === 1 || utils.studentsData.form === 2
      ? ['TOTAL MARKS/POINTS', '', '', utils.studentsData.total, '', '']
      : ['TOTAL MARKS/POINTS', '', '', '', '', totalPoints, ''];

  const OtherRow = ['MEAN SCORE', '', '', meanScore, '', ''];
  const GradeRow =
    utils.studentsData.form === 1 || utils.studentsData.form === 2
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
