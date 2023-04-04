import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import readXlsxFile from 'read-excel-file';
import { useTable } from '../utils/useTable';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Navigate } from 'react-router';
import Automate from '../components/Automate';

function ExcelToJson() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
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
        readXlsxFile(files[0]).then((rows) => {
          const headerRow = rows.shift();
  
          if (!headerRow || headerRow.length < 4) {
            setError('Invalid file format. Please upload a valid Excel file.');
            return;
          }
          //get first 3 items in headerRow array
          const header = headerRow.slice(0, 3);
  
          // get last item in headerRow array
          const lastColumnIndex = headerRow.length - 1;
  
          //read last item in headerRow array
          
  
          const headerSubjects = headerRow
            .slice(3)
            .filter((subject) => subject)
            .slice(0, -1)

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
                form: header[0],
                year: header[1],
                term: header[2],
                total: '',
                subjects: [],
              };
            }
  
            const subjectsData = [];
  
            headerSubjects.forEach((_, i) => {
              const subjectName = subjects[i][0];
              const cat = row[catIndexes[i]] || '';
              const main = row[mainIndexes[i]] || '';
  
              // Modify subjectData array format to [subjectName, cat, main]
              const subjectData = [subjectName.toUpperCase(), cat, main];
  
              // Push subjectData array into subjectsData array
              subjectsData.push(subjectData);
            });
  
            // Extract the value of the last column
            const totalMarks = row[lastColumnIndex];
  
            // Add the totalMarks to the corresponding student object
            students[student_id].total = totalMarks;
  
            // Set subjects property of students object to subjectsData array
            students[student_id].subjects = subjectsData;
          });
  
          const studentsData = Object.values(students);
          setJsonData(studentsData);
          utils.setStudentsData(studentsData);
        });
      } else {
        setError('Invalid file type. Please upload an Excel file or CSV file.');
      }
    }
  };
  

  // Remove the first element of studentsData array, which contains hardcoded data
  const studentsData = utils.studentsData.slice(1);
  

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
