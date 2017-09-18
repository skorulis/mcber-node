var intSequence = [];

module.exports = {
  setNextInt:function(value) {
    intSequence.push(value)
  },
  setNextIntArray:function(array) {
    intSequence = intSequence.concat(array)
  },
  getRandomInt:function(min, max) {
    if (intSequence.length > 0) {
      return intSequence.shift()
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  
}
