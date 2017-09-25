'use strict'; 

//Class for counting object values

class Counter {
  constructor() {
    this.counts = {}
  }

  add(key,value) {
    if (this.counts[key] == null) {
      this.counts[key] = value
    } else {
      this.counts[key] = this.counts[key] + value
    }
  }

  valueFor(key) {
    var value = this.counts[key]
    return value ? value : 0
  }

  asArray() {
    var ret = []
    for (var key in this.counts) {
      ret.push({key:key,value:this.counts[key]})
    }
    return ret
  }

  asNamedArray(keyName,valueName) {
    var ret = []
    for (var key in this.counts) {
      var item = {}
      item[keyName] = key
      item[valueName] = this.counts[key]
      ret.push(item)
    }
    return ret
  } 
}



module.exports = Counter;