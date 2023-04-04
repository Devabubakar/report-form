import React, { useState } from 'react';
import './style.css';
import { HotTable, HotColumn } from '@handsontable/react';
import { data } from './constant';
import { getGrade, getPoints, getRemark, meanGradeUtil } from '../utils/tableUtils';
import { addClassesToRows, alignHeaders } from './hooks';
import 'handsontable/dist/handsontable.min.css';
import { getTeacherComment, getPrincipalComment } from '../utils/tableUtils';
import { useTable } from '../utils/useTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const utils = useTable();
 const [meanPoints, setMeanPoints] = useState('');
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
      setMeanPoints(meanPoints);
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

  const totalRow =
    utils.form === '1' || utils.form === '2'
      ? ['TOTAL MARKS/POINTS', '', '', totalPercentage, '', '']
      : ['TOTAL MARKS/POINTS', '', '', '', '', totalPoints, ''];

  const OtherRow = ['MEAN SCORE', '', '', meanScore, '', ''];
  const GradeRow =
    
       ['MEAN GRADE', '', '', '', meanGradeUtil(utils.form,meanScore, meanPoints), '', '']
      

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

export default App;
