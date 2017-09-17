var intSequence = [];

module.exports = {
  setNextInt:function(value) {
    intSequence.push(value)
  },
  getRandomInt:function(min, max) {
    if (intSequence.length > 0) {
      return intSequence.pop()
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }  
}
