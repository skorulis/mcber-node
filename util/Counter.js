'use strict'; 

//Class for counting object values

class Counter {
  constructor() {
    this.counts = {}
  }

  add(key,value) {
    if (key in this.counts) {
      this.counts[key] = this.counts[key] + value
    } else {
      this.counts[key] = value
    }
  }

  valueFor(key) {
    let value = this.counts[key];
    return value ? value : 0
  }

  asArray() {
    let ret = [];
    for (let key in this.counts) {
      ret.push({key:key,value:this.counts[key]})
    }
    return ret
  }

  asNamedArray(keyName,valueName) {
    let ret = [];
    for (let key in this.counts) {
      let item = {};
      item[keyName] = key;
      item[valueName] = this.counts[key];
      ret.push(item)
    }
    return ret
  } 
}



module.exports = Counter;