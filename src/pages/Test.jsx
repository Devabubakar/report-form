import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import readXlsxFile from 'read-excel-file';

function ExcelToJson() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

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

        // Read the file and convert it to JSON data
        readXlsxFile(files[0]).then((rows) => {
          const subjects = rows[0].slice(3).reduce((acc, curr, i) => {
            if (i % 2 === 0) {
              acc.push({
                subject_name: curr,
                cat: 'cat',
                main: 'main',
              });
            }
            return acc;
          }, []);

          const students = {};
          rows.slice(2).forEach((row) => {
            const student_id = row[0];
            if (!students[student_id]) {
              students[student_id] = {
                student_id: student_id,
                student_name: row[1],
                class_section: row[2],
                subjects: [],
              };
            }
            for (let i = 3; i < row.length; i += 2) {
                const subject_index = Math.floor((i - 3) / 2);
                const subject_name = subjects[subject_index].subject_name;
                const cat = row[i];
                const main = row[i + 1];
                students[student_id].subjects.push({
                  subject_name: subject_name,
                  cat: cat,
                  main: main,
                });
              }
              
          });
          setJsonData(Object.values(students));
        });
      } else {
        setError('Invalid file type. Please upload an Excel file or CSV file.');
      }
    }
  };

  // Handle submit button click
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(jsonData);
  };

  return (
    <div>
      <input type='file' onChange={handleFileChange} />
      {error && <Typography color='error'>{error}</Typography>}
      {jsonData && (
        <div>
          <Typography>JSON data:</Typography>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          <Button variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

export default ExcelToJson;
