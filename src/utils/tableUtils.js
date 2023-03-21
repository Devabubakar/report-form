export const getGrade = (subject, percentage) => {
  const isHumanities =
    subject.toLowerCase().includes('english') ||
    subject.toLowerCase().includes('ire') ||
    subject.toLowerCase().includes('kiswahili') ||
    subject.toLowerCase().includes('history & govt') ||
    subject.toLowerCase().includes('geoghraphy') ||
    subject.toLowerCase().includes('arabic') ||
    subject.toLowerCase().includes('business studies');

  const gradingSchema = isHumanities
    ? [
        { grade: 'E', min: 0, max: 24 },
        { grade: 'D-', min: 25, max: 29 },
        { grade: 'D', min: 30, max: 34 },
        { grade: 'D+', min: 35, max: 39 },
        { grade: 'C-', min: 40, max: 44 },
        { grade: 'C', min: 45, max: 49 },
        { grade: 'C+', min: 50, max: 54 },
        { grade: 'B-', min: 55, max: 59 },
        { grade: 'B', min: 60, max: 61 },
        { grade: 'B+', min: 65, max: 69 },
        { grade: 'A-', min: 70, max: 74 },
        { grade: 'A', min: 75, max: 100 },
      ]
    : [
        { grade: 'E', min: 0, max: 14 },
        { grade: 'D-', min: 15, max: 19 },
        { grade: 'D', min: 20, max: 24 },
        { grade: 'D+', min: 25, max: 29 },
        { grade: 'C-', min: 30, max: 34 },
        { grade: 'C', min: 35, max: 39 },
        { grade: 'C+', min: 40, max: 44 },
        { grade: 'B-', min: 45, max: 49 },
        { grade: 'B', min: 50, max: 51 },
        { grade: 'B+', min: 55, max: 59 },
        { grade: 'A-', min: 60, max: 64 },
        { grade: 'A', min: 65, max: 100 },
      ];

  const matchingEntry = gradingSchema.find(
    (entry) => percentage >= entry.min && percentage <= entry.max
  );

  return matchingEntry?.grade;
};
export const meanGrade = (meanScore, isPoint) => {
  const gradingSchema = isPoint
    ? [
        { grade: 'E', result: 1 },
        { grade: 'D-', result: 2 },
        { grade: 'D', result: 3 },
        { grade: 'D+', result: 4 },
        { grade: 'C-', result: 5 },
        { grade: 'C', result: 6 },
        { grade: 'C+', result: 7 },
        { grade: 'B-', result: 8 },
        { grade: 'B', result: 9 },
        { grade: 'B+', result: 10 },
        { grade: 'A-', result: 11 },
        { grade: 'A', result: 12 },
      ]
    : [
        { grade: 'E', min: 0, max: 19 },
        { grade: 'D-', min: 20, max: 24 },
        { grade: 'D', min: 25, max: 29 },
        { grade: 'D+', min: 30, max: 34 },
        { grade: 'C-', min: 35, max: 39 },
        { grade: 'C', min: 40, max: 44 },
        { grade: 'C+', min: 45, max: 49 },
        { grade: 'B-', min: 50, max: 54 },
        { grade: 'B', min: 55, max: 59 },
        { grade: 'B+', min: 60, max: 64 },
        { grade: 'A-', min: 65, max: 69 },
        { grade: 'A', min: 70, max: 100 },
      ];

  console.log(meanScore);

  let matchingEntry = isPoint
    ? gradingSchema.find((entry) => entry.result === Math.round(meanScore))
    : gradingSchema.find(
        (entry) => meanScore >= entry.min && meanScore <= entry.max
      );

  return matchingEntry?.grade;
};

export const getPoints = (grade) => {
  switch (grade) {
    case 'A':
      return 12;
    case 'A-':
      return 11;
    case 'B+':
      return 10;
    case 'B':
      return 9;
    case 'B-':
      return 8;
    case 'C+':
      return 7;
    case 'C':
      return 6;
    case 'C-':
      return 5;
    case 'D+':
      return 4;
    case 'D':
      return 3;
    case 'D-':
      return 2;
    case 'E':
      return 1;
    default:
      return null;
  }
};
export const getRemark = (grade) => {
  switch (grade) {
    case 'A':
      return 'Excellent';
    case 'A-':
      return 'Very Good';
    case 'B+':
      return 'Good';
    case 'B':
      return 'Above Average';
    case 'B-':
      return 'Average';
    case 'C+':
      return 'Average';
    case 'C':
      return 'Needs Improvement';
    case 'C-':
      return 'Work Hard';
    case 'D+':
      return 'Poor';
    case 'D':
      return 'Very Poor';
    case 'D-':
      return 'Failing';
    case 'E':
      return 'Failed';
    default:
      return null;
  }
};

export const getPercentage = (cat, main, row, percentageSum) => {
  if (row.subject === 'TOTAL MARKS/POINTS') {
    return percentageSum;
  }
  if (cat > 30 || main > 70) return 'Error';
  if ((cat && main) === undefined) return null;

  const percentage = parseInt(cat) + parseInt(main);

  return percentage;
};

export const getTeacherComment = (meanGrade) => {
  switch (true) {
    case meanGrade >= 70:
      return 'Outstanding performance! Continue to excel and maintain this level of dedication.';
    case meanGrade >= 65 && meanGrade < 70:
      return "Good job! You have demonstrated a solid understanding, but there's potential for excellence. Strive for improvement next term.";
    case meanGrade >= 60 && meanGrade < 65:
      return "You have shown moderate understanding, but there's room for growth. Dedicate more time to reviewing class materials for better results.";
    case meanGrade >= 50 && meanGrade < 60:
      return "Your performance is below expectations. It's crucial to invest more time in understanding the topics covered in class.";
    case meanGrade < 50:
      return 'Unfortunately, your performance this term was inadequate. We strongly suggest devoting more time to reviewing class materials.';
    default:
      return '';
  }
};

export const getPrincipalComment = (meanGrade) => {
  switch (true) {
    case meanGrade >= 70:
      return 'Exceptional work! You have achieved remarkable results this term. Keep it up!';
    case meanGrade >= 65 && meanGrade < 70:
      return "You have displayed commendable dedication; however, there's always room for growth. Continue to strive for excellence next term.";
    case meanGrade >= 60 && meanGrade < 65:
      return 'Your performance indicates the need for improvement. We recommend allocating more time to review the topics covered in class.';
    case meanGrade >= 50 && meanGrade < 60:
      return 'Your performance has not met the desired standards. It is crucial to invest more time in understanding the topics covered in class.';
    case meanGrade < 50:
      return 'Your results this term were disappointing. We strongly encourage you to dedicate more time to reviewing class materials.';
    default:
      return '';
  }
};
