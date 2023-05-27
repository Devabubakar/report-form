import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import readXlsxFile from 'read-excel-file';
import { useTable } from '../utils/useTable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Navigate } from 'react-router';
import Automate from '../components/Automate';
import { getTeacherComment, getPrincipalComment } from '../utils/tableUtils';

import {
  getGrade,
  getPoints,
  getRemark,
  meanGradeUtil,
} from '../utils/tableUtils';

function ExcelToJson() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [meanPoints, setMeanPoints] = useState('');

  const utils = useTable();
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      // Check file type
      const fileType = files[0].type;
      if (
        fileType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileType === 'application/vnd.ms-excel' ||
        fileType === 'text/csv'
      ) {
        setError(null);
        setFile(files[0]);
        readXlsxFile(files[0], { sheet: 2 }).then((rows) => {
          // get access to headers and rows

          let Initials = {};

          rows.forEach((row) => {
            const subject = row[0];
            const initial = row[1];

            if (subject && initial) {
              Initials[subject] = initial;
            }
          });
          utils.setInitials(Initials);
        });
        readXlsxFile(files[0]).then((rows) => {
          const headerRow = rows.shift();

          if (!headerRow || headerRow.length < 4) {
            setError('Invalid file format. Please upload a valid Excel file.');
            return;
          }
         

          //read last item in headerRow array

          const headerSubjects = headerRow
            .slice(3)
            .filter((subject) => subject)
            .slice(0, -1);

          //remove last item in headerSubjects array

          // Read categories (cat) and main values from the excel
          const catIndexes = headerSubjects.map(
            (subject, index) => index * 2 + 3
          );
          const mainIndexes = headerSubjects.map(
            (subject, index) => index * 2 + 4
          );

          const subjects = headerSubjects.map((subject) => [
            subject?.toUpperCase() ?? '',
            '',
            '',
          ]);

          // ...
          const students = {};

          rows.forEach((row) => {
            const student_id = row[0];

            

            if (!students[student_id]) {
              students[student_id] = {
                student_id: student_id,
                student_name: row[1],
                class_section: row[2],
                total: '',
                subjects: [],
              };
            }

            const subjectsData = [];

            headerSubjects.forEach((_, i) => {
              const subjectName = subjects[i][0];
              const cat = row[catIndexes[i]] || '';
              const main = row[mainIndexes[i]] || '';

              const catValue = parseInt(cat) || '';
              const mainValue = parseInt(main) || '';

              const percentage = catValue + mainValue;

              const grade =
                percentage !== '' ? getGrade(subjectName, percentage) : '';
              const points = grade !== '' ? getPoints(grade) : '';
              const remark = grade !== '' ? getRemark(grade) : '';

              // Modify subjectData array format to [subjectName, cat, main]
              const subjectData = [
                subjectName.toUpperCase(),
                cat,
                main,
                percentage,
                grade,
                points,
                remark,
              ];

              // Push subjectData array into subjectsData array
              subjectsData.push(subjectData);
            });

            const requiredSubjects = [
              'ENGLISH',
              'KISWAHILI',
              'MATHEMATICS',
              'CHEMISTRY',
              'BIOLOGY',
            ];

            //  check if form is 3 or 4 then calculate total marks by summing all the values of row 4

            const totals = subjectsData.reduce(
              (totals, row) => {
                if (row[3] !== '' && row[5] !== '') {
                  if (row[4] !== '') {
                    if (requiredSubjects.includes(row[0])) {
                      totals.totalPoints += row[5];
                      totals.totalMarks += Number(row[3]); // Add the percentage to totalMarks
                      totals.subjectCount++;
                    } else if (
                      !totals.optionalSubjects[row[0]] ||
                      row[5] > totals.optionalSubjects[row[0]].points
                    ) {
                      totals.optionalSubjects[row[0]] = {
                        points: row[5],
                        percentage: row[3],
                        index: totals.optionalSubjects.length,
                      };
                    }
                  }
                }
                return totals;
              },
              {
                totalPoints: 0,
                totalMarks: 0,
                subjectCount: 0,
                optionalSubjects: [],
              }
            );

            const sortedOptionalSubjects = Object.values(
              totals.optionalSubjects
            )
              .sort((a, b) => b.points - a.points)
              // if form 3 or 4, only get the first 2 optional subjects
              .slice(0, utils.form === '3' || utils.form === '4' ? 2 : 4);

            sortedOptionalSubjects.forEach((subject) => {
              totals.totalPoints += subject.points;
              totals.totalMarks += subject.percentage;
              totals.subjectCount++;
            });

            let meanScore = '';

            // Update the meanPoints calculation
            const meanPoints =
              totals.subjectCount > 0
                ? (totals.totalPoints / 7).toFixed(1)
                : '';
            setMeanPoints(meanPoints);
            //if form 1 or two, mean grade is mean score, true
            //if form 3 or 4, mean grade is mean points, false
            const meanGrade =
              utils.form === '3' || utils.form === '4'
                ? meanGradeUtil(meanPoints, true)
                : meanGradeUtil(meanScore, false);

            const teacherComment = getTeacherComment(meanScore);
            const principalComment = getPrincipalComment(meanScore);

            // Add meanScore, meanGrade, meanPoints, teacherComment, principalComment to subjectsData array
            students[student_id].meanScore =
              utils.form === '3' || utils.form === '4'
                ? (totals.totalMarks / 7).toFixed(1)
                : (totals.totalMarks / 9).toFixed(1);
            students[student_id].totalPoints = totals.totalPoints;
            students[student_id].meanGrade = meanGrade;
            students[student_id].meanPoints = meanPoints;
            students[student_id].teacherComment = teacherComment;
            students[student_id].principalComment = principalComment;

            // Add the totalMarks to the corresponding student object
            students[student_id].total = totals.totalMarks;

            // Set subjects property of students object to subjectsData array
            students[student_id].subjects = subjectsData;
          });

          const studentsData = Object.values(students);
          const filteredStudentsData = studentsData.filter(
            (student) => student.class_section !== null && student.total !== 0
          );
          filteredStudentsData.sort((a, b) => b.total - a.total);

          setJsonData(filteredStudentsData);
          utils.setStudentsData(filteredStudentsData);
        });
      } else {
        setError('Invalid file type. Please upload an Excel file or CSV file.');
      }
    }
  };

  const studentsData = utils.studentsData;

  let position = 1;

  // Add position property to each student object
  studentsData.map((student) => {
    student.position = position++;
    return student;
  });

  console.log(studentsData);

  return (
    <div>
      <input
        type='file'
        id='upload-button'
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor='upload-button'>
        <Button variant='outlined' component='span'>
          Upload Excel File
        </Button>
      </label>
      {error && <Typography color='error'>{error}</Typography>}
      {jsonData && (
        <div>
          <Automate utils={studentsData} />
        </div>
      )}
    </div>
  );
}

export default ExcelToJson;
