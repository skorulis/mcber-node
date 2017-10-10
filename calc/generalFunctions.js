const failureRate = function(skill,difficulty) {
  if (difficulty === 1) {
    return 0;
  }
  let failure = difficulty / skill;
  if (difficulty > skill) {
    failure = 2 - ( skill / difficulty);
  } else {
    failure = Math.pow(failure,2);
  }
  failure = failure / 2;
  failure = failure.toFixed(2);
  failure = Math.min(failure,0.99);
  return failure;
};

module.exports = {
  failureRate
};