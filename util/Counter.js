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

  addAll(values,keyName,valueName) {
    for (let x of values) {
      this.add(x[keyName],x[valueName])
    }
  }

  maxValue() {
    var maxValue = 0;
    var maxKey = null;
    for (let key in this.counts) {
      if(this.valueFor(key) > maxValue) {
        maxValue = this.valueFor(key)
          maxKey = key
      }
    }
    return {key:maxKey,value:maxValue}
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