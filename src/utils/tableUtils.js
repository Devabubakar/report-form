export const getGrade = (subject, percentage) => {
  const isHumanities =
    subject.toLowerCase().includes('english') ||
    subject.toLowerCase().includes('ire') ||
    subject.toLowerCase().includes('kiswahili') ||
    subject.toLowerCase().includes('history & govt') ||
    subject.toLowerCase().includes('geography') ||
    subject.toLowerCase().includes('arabic') ||
    subject.toLowerCase().includes('business studies');

  const gradingSchema = isHumanities
    ? [
        { grade: 'E', min: 0.0, max: 24.9 },
        { grade: 'D-', min: 25.0, max: 29.9 },
        { grade: 'D', min: 30.0, max: 34.9 },
        { grade: 'D+', min: 35.0, max: 39.9 },
        { grade: 'C-', min: 40.0, max: 44.9 },
        { grade: 'C', min: 45.0, max: 49.9 },
        { grade: 'C+', min: 50.0, max: 54.9 },
        { grade: 'B-', min: 55.0, max: 59.9 },
        { grade: 'B', min: 60.0, max: 61.9 },
        { grade: 'B+', min: 62.0, max: 64.9 },
        { grade: 'A-', min: 65.0, max: 69.9 },
        { grade: 'A', min: 70.0, max: 100.0 },
      ]
    : [
        { grade: 'E', min: 0.0, max: 14.9 },
        { grade: 'D-', min: 15.0, max: 19.9 },
        { grade: 'D', min: 20.0, max: 24.9 },
        { grade: 'D+', min: 25.0, max: 29.9 },
        { grade: 'C-', min: 30.0, max: 34.9 },
        { grade: 'C', min: 35.0, max: 39.9 },
        { grade: 'C+', min: 40.0, max: 44.9 },
        { grade: 'B-', min: 45.0, max: 49.9 },
        { grade: 'B', min: 50.0, max: 51.9 },
        { grade: 'B+', min: 52.0, max: 54.9 },
        { grade: 'A-', min: 55.0, max: 59.9 },
        { grade: 'A', min: 60.0, max: 100.0 },
      ];

  const matchingEntry = gradingSchema.find(
    (entry) => percentage >= entry.min && percentage <= entry.max
  );

  return matchingEntry?.grade;
};

export const meanGradeUtil = (meanScore, isPoint) => {
  if (isPoint && meanScore < 1) {
    return 'E';
  }

  if (isPoint === false && meanScore > 100) {
    return 'A';
  }

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
        { grade: 'E', min: 0, max: 30.99 },
        { grade: 'D-', min: 31.0, max: 40.9 },
        { grade: 'D', min: 41.0, max: 45.9 },
        { grade: 'D+', min: 46.0, max: 49.9 },
        { grade: 'C-', min: 50.0, max: 52.9 },
        { grade: 'C', min: 53.0, max: 56.9 },
        { grade: 'C+', min: 57.0, max: 59.9 },
        { grade: 'B-', min: 60.0, max: 62.9 },
        { grade: 'B', min: 63.0, max: 66.9 },
        { grade: 'B+', min: 67.0, max: 69.9 },
        { grade: 'A', min: 70.0, max: 100 },
      ];

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
      return 'Work Hard';
    case 'C-':
      return 'Work Hard';
    case 'D+':
      return 'Poor';
    case 'D':
      return 'Very Poor';
    case 'D-':
      return 'Failed';
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
    case meanGrade >= 57:
      return 'Outstanding performance! Continue to excel and maintain this level of dedication.';
    case meanGrade >= 50.0 && meanGrade < 56.9:
      return 'Average. Work hard. You can do better than this.';
    case meanGrade < 49.9:
      return 'Unfortunately, your performance this term was inadequate. We strongly suggest devoting more time to reviewing class materials.';
    default:
      return '';
  }
};

export const getPrincipalComment = (meanGrade) => {
  switch (true) {
    case meanGrade >= 57:
      return 'Exceptional performance you have achieved a remarkable result this term. Keep it up.';
    case meanGrade >= 50.0 && meanGrade < 56.9:
      return 'Aspire to improve this grade';
    case meanGrade < 49.9:
      return 'Your results this term were disappointing. We strongly suggest to Dedicate more time to reviewing Class materials';
    default:
      return '';
  }
};
