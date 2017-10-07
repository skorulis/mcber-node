let intSequence = [];
let doubleSequence = [];

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
  setNextDouble:function(value) {
    doubleSequence.push(value);
  },
  setNextIntArray:function(array) {
    intSequence = intSequence.concat(array)
  },
  getRandomInt:getRandomInt,
  makesChance:function(chance) {
    return getRandomInt(0,100) > chance
  },
  randomDouble:function() {
    if (doubleSequence.length > 0) {
      return doubleSequence.shift()
    }
    return Math.random()
  },
  randomElement:function(array) {
    let index = getRandomInt(0,array.length - 1);
    return array[index];
  }
};
