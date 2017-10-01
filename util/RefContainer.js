'use strict';

let rand = require("../calc/rand");

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

  randomElement() {
    let index = rand.getRandomInt(0, this.array.length - 1);
    return this.atIndex(index)
  }
}

module.exports = RefContainer;