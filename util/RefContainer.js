'use strict'; 

class RefContainer {
  constructor(items,idKey) {
    this.array = items;
    this.dict = {};
    for (let obj of items) {
      let key = obj[idKey];
      this.dict[key] = obj;
    }
  }

  atIndex(index) {
    return this.array[index]
  }

  withId(id) {
    return this.dict[id]
  }
}

module.exports = RefContainer;