let intSequence = [];

const getRandomInt = function(min, max) {
  if (intSequence.length > 0) {
    return intSequence.shift()
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  setNextInt:function(value) {
    intSequence.push(value)
  },
  setNextIntArray:function(array) {
    intSequence = intSequence.concat(array)
  },
  getRandomInt:getRandomInt,
  makesChance:function(chance) {
    return getRandomInt(0,100) > chance
  }
};
