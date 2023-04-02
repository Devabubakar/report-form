import React, { useState, useEffect } from 'react';
import { HotTable, HotColumn } from '@handsontable/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getGrade, getPoints, getRemark, meanGrade } from '../utils/tableUtils';
import { useTable } from '../utils/useTable';

import 'handsontable/dist/handsontable.min.css';
import { getTeacherComment, getPrincipalComment } from '../utils/tableUtils';

const AutoTable = ({ student, subjects }) => {
  const utils = useTable();

  // calculate total Percentage

  // Manipulate the data to match the format expected by the table
  const dataWithCalculations = subjects.map((subject) => {
    const totalMarks = subject.cat + subject.main;
    const percentage = (totalMarks / 100) * 100;
    const grade = getGrade(subject.subject_name, totalMarks.toFixed(1));
    console.log(grade)
    const points = getPoints(grade);
    const remark = getRemark(grade);

    return [
      
      subject.subject_name,
      subject.cat,
      subject.main,
      totalMarks.toFixed(1),
      grade,
      points,
      remark,
      '',
    ];
  });

  const [tableData, setTableData] = useState(dataWithCalculations);

  const totalRow = ['Total', '', '', '', '', '', '', '', '', ''];
  const otherRow = ['Other-', '', '', '', '', '', '', '', '', ''];
  const gradeRow = ['Grade', '', '', '', '', '', '', '', '', ''];
  const positionThisTermRow = [
    'Position This Term',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];
  const outOfRow = ['Out Of', '', '', '', '', '', '', ''];
  const positionLastTermRow = [
    'Position Last Term',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];

  const [totalPercentage, setTotalPercentage] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [meanScore, setMeanScore] = useState('');

  const calculateTotals = (data) => {
    const totals = data.reduce(
      (totals, row) => {
        if (row[3] !== '' && row[5] !== '') {
          totals.totalPercentage += parseFloat(row[3]);
          totals.totalPoints += parseFloat(row[5]);
          totals.subjectCount++;
        }
        return totals;
      },
      { totalPercentage: 0, totalPoints: 0, subjectCount: 0 }
    );

    let meanScore = '';

    if (student.class_section === '1' || student.class_section === '2') {
      meanScore =
        totals.subjectCount > 0 ? (totals.totalPercentage / 10).toFixed(1) : '';
    }

    if (student.class_section === '3' || student.class_section === '4') {
      meanScore =
        totals.subjectCount > 0
          ? ((totals.totalPoints / 7) * 10).toFixed(1)
          : '';
    }

    const meanPoints =
      totals.subjectCount > 0 ? totals.totalPoints / totals.subjectCount : '';
    const meanGrade = getGrade('english', meanScore);
    const teacherComment = getTeacherComment(meanScore);
    const principalComment = getPrincipalComment(meanScore);

    utils.setPrincipalsComment(principalComment);
    utils.setClassTeachersComment(teacherComment);

    return {
      totalPercentage: totals.totalPercentage.toFixed(2),
      totalPoints: totals.totalPoints.toFixed(2),
      subjectCount: totals.subjectCount,
      meanScore,
      meanPoints: meanPoints.toFixed(2),
      meanGrade,
      teacherComment,
      principalComment,
    };
  };

  function updatePercentage(row) {
    const cat = parseFloat(tableData[row][1]);
    const main = parseFloat(tableData[row][2]);

    if (!isNaN(cat) && !isNaN(main)) {
      const percentage = ((cat + main) / 100) * 100;
      tableData[row][3] = percentage.toFixed(2);
      setTableData(tableData);
    }
  }

  const afterChange = (changes, source) => {
    if (source !== 'edit') return;

    changes.forEach(([row, col, oldValue, newValue]) => {
      if (col === 1 || col === 2) {
        updatePercentage(row);
      }
    });
  };

  return (
    <div>
      <HotTable
        data={[
          ...tableData,
          totalRow,
          otherRow,
          gradeRow,
          positionThisTermRow,
          outOfRow,
          positionLastTermRow,
        ]}
        height={550}
        colWidths={[140, 80, 80, 10, 10, 10, 100, 70, 10, 70]}
        nestedHeaders={[
          [
            { label: 'SUBJECTS', colspan: 1 },
            { label: 'CAT', colspan: 1 },
            { label: 'MAIN', colspan: 1 },
            { label: 'Total', colspan: 3 },
            { label: 'Remarks', colspan: 1 },
            { label: 'INITIALS', colspan: 1 },
          ],
          [
            '',
            'out of 30',
            'out of 70',
            'Percentage',
            'Grade',
            'Points',
            '',
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
        manualRowMove={true}
        licenseKey='non-commercial-and-evaluation'
        afterChange={afterChange}
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

export default AutoTable;
