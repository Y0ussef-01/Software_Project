const getLetterGrade = (score) => {
    if (score < 60)  return 'Fail';
    if (score < 65)  return 'Pass';
    if (score < 75)  return 'Good';
    if (score < 85)  return 'Very Good';
    return 'Excellent';
};

module.exports = { getLetterGrade };