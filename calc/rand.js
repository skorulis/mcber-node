let intSequence = [];
let doubleSequence = [];
let namedDoubles = {};

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
  setNextDouble:function(value,name) {
    console.log(name);
    if (name === undefined) {
      doubleSequence.push(value);
    } else {
      let array = namedDoubles[name];
      if (array) {
        array.push(value);
      } else {
        namedDoubles[name] = [value];
      }
    }
  },
  setNextIntArray:function(array) {
    intSequence = intSequence.concat(array)
  },
  getRandomInt:getRandomInt,
  makesChance:function(chance) {
    return getRandomInt(0,100) > chance
  },
  randomDouble:function(named) {
    if (named === undefined) {
      if (doubleSequence.length > 0) {
        return doubleSequence.shift()
      }
    } else {
      let seq = namedDoubles[named];
      if (seq && seq.length > 0) {
        return seq.shift();
      }
    }

    return Math.random()
  },
  randomElement:function(array) {
    let index = getRandomInt(0,array.length - 1);
    return array[index];
  }
};
